var spiderConfig = require('./config');
var News = require('../models/news');
var querystring = require('querystring');
var superagent = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var async = require('async');

charset(superagent);
var urls = [];
var news = [];

/**
 * 请求页面获取html
 * @param  {String}   item 每个页面的html
 * @param  {Function} cb   回调
 * @return {Error}        错误处理
 */
var getHtml = function (item, cb) {
  superagent
    .post(spiderConfig.news.baseUrl)
    .send(querystring.parse(item))
    .set(spiderConfig.news.headers)
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }
      cb(null, sres.text);
      console.log('urls ok!');
    })
}

/**
 * 获取新闻urls
 * @param  {Array} result html集合
 * @return {Error}        错误处理
 */
var getUrls = function (result) {
  async.each(result, function (item, cb) {
    var $ = cheerio.load(item);
    $('a').each(function (i, elem) {
      if ($(this).attr('onclick') === undefined) {
        urls.push($(this).attr('href'));
      }
    });
    cb(null);
  }, function (err) {
    if (err) {
      return next(err);
    }
  });
}

/**
 * 获取新闻内容
 * @param  {String}   item 每个文章的url
 * @param  {Function} cb   回调
 * @return {Error}        错误处理
 */
var getContent = function (item, cb) {
  superagent
    .get(item)
    .charset('gbk')
    .set(spiderConfig.news.headers)
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }
      cb(null, [sres.text, item]);
      console.log('content ok!');
    })
}

/**
 * 持久化数据
 * @param  {String}   item 新闻内容html
 * @param  {Function} cb   回调
 * @return {Error}        错误处理
 */
var saveItem = function (item, cb) {
  var $ = cheerio.load(item[0]);
  var html = $('td', '#body').filter(function (i, ele) {
    return $(this).attr('align') === 'left';
  });

  var title = $('.NewsTitle', html).text();
  var time = Date.parse(($('tr', html).eq(2).text()).match(
    /\d{4}(-)\d{2}\1\d{2}/)[0]);
  var tag = $('a', html).eq(1).text();
  var content = $('#NewsContent', html).html();
  var cover = $('img', html).attr('src') === undefined ?
    'http://www.hpu.edu.cn/www/upload/2015/5/2295835501.jpg' : $('img', html)
    .attr('src');
  var link = item[1];

  news.push({
    title: title,
    time: time,
    tag: tag,
    content: content,
    cover: cover,
    url: link
  });

  var n = new News({
    title: title,
    time: time,
    tag: tag,
    content: content,
    cover: cover,
    url: link
  }).save();

  cb(null);
}

var getNews = function (req, res, next) {

  async.map(spiderConfig.news.pars, function (item, cb) {
    getHtml(item, cb);
  }, function (err, result) {
    if (err) {
      return next(err);
    }
    getUrls(result);

    async.mapLimit(urls, 3, function (item, cb) {
      getContent(item, cb);
    }, function (err, result) {
      if (err) {
        return next(err);
      }

      async.each(result, function (item, cb) {
        saveItem(item, cb);
        console.log('saved ok!');
      }, function (err) {
        if (err) {
          return next(err);
        }
      });

      res.send(news);
    });
  });

};

exports.getNews = getNews;

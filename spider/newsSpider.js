var express = require('express');
var router = express.Router();

var spiderConfig = require('./config.spider');
var querystring = require('querystring');
var superagent = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var async = require('async');

charset(superagent);
var urls = [];
var news = [];

/**
 * 请求指定页面获取html
 * @param  {String}   item 每个页面的html
 * @param  {Function} cb   回调
 * @return {Error}        错误处理
 */
var getHtml = function(item, cb) {
  superagent
  .post(spiderConfig.news.baseUrl)
  .send(querystring.parse(item))
  .set(spiderConfig.news.headers)
  .end(function(err, sres) {
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
var getUrls = function(result) {
  async.each(result, function(item, cb) {
    var $ = cheerio.load(item);
    $('a').each(function(i, elem){
      if ($(this).attr('onclick') === undefined) {
        urls.push($(this).attr('href'));
      }
    });
    cb(null);
  }, function(err) {
    if (err) {
      return next(err);
    }
  });
}

router.get('/', function(req, res, next) {

  async.map(spiderConfig.news.pars, function(item, cb){
    getHtml(item, cb);
  }, function(err, result){
    if (err) {
      return next(err);
    }
    getUrls(result);

    async.mapLimit(urls, 3, function(item, cb) {
      superagent
        .get(item)
        .charset('gbk')
        .set(spiderConfig.news.headers)
        .end(function(err, sres) {
          if (err) {
            return next(err);
          }
          cb(null, sres.text);
          console.log('content ok!');
        })
    }, function(err, result) {
      if (err) {
        return next(err);
      }

      async.each(result, function(item, cb) {

        var $ = cheerio.load(item);
        var html = $('td', '#body').filter(function(i, ele) {
          return $(this).attr('align') === 'left';
        });
        news.push(
          {
            title: $('.NewsTitle', html).text(),
            time: ($('tr', html).eq(2).text()).match(/\d{4}(-)\d{2}\1\d{2}/)[0],
            tag: $('a', html).eq(1).text(),
            content: $('#NewsContent', html).html(),
            cover: $('img', html).attr('src') === undefined ? 'http://www.hpu.edu.cn/www/upload/2015/5/2295835501.jpg' : $('img', html).attr('src'),
            url: 'url'
          }
        );

        cb(null);
      }, function(err) {
        if (err) {
          return next(err);
        }
      });

      res.send(news);
    });

  });

});

module.exports = router;

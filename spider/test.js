var mongoose = require('mongoose');

var spiderConfig = require('./config.spider');
var News = require('./models/news_model');
var querystring = require('querystring');
var superagent = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var async = require('async');

charset(superagent);
var url = 'http://news.hpu.edu.cn/news/contents/544/119023.html';
var news = [];

var test = function(req, res, next) {
  // superagent
  //   .get(url)
  //   .charset('gbk')
  //   .end(function(err, sres) {
  //     if (err) {
  //       return next(err);
  //     }
  //
  //     var $ = cheerio.load(sres.text);
  //     var html = $('td', '#body').filter(function(i, ele) {
  //       return $(this).attr('align') === 'left';
  //     });
  //
  //     var title = $('.NewsTitle', html).text();
  //     var time = Date.parse(($('tr', html).eq(2).text()).match(/\d{4}(-)\d{2}\1\d{2}/)[0]);
  //     var tag = $('a', html).eq(1).text();
  //     var content = $('#NewsContent', html).html();
  //     var cover = $('img', html).attr('src') === undefined ? 'http://www.hpu.edu.cn/www/upload/2015/5/2295835501.jpg' : $('img', html).attr('src');
  //     var link = url;
  //     news.push(
  //       {
  //         title: title,
  //         time: time,
  //         tag: tag,
  //         content: content,
  //         cover: cover,
  //         url: link
  //       }
  //     );
  //
  //       console.log('connecting...');
  //       var n = new News({
  //         title: title,
  //         time: time,
  //         tag: tag,
  //         content: content,
  //         cover: cover,
  //         url: link
  //       }).save();
  //       console.log('save ok!');
    // });

  News.find({}, null, {limit: 5, sort: {time: -1}}, function(err, n) {
    res.json(n);
  });
};


exports.test = test;

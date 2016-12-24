var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/hpuDog');

var spiderConfig = require('./config.spider');
var News = require('./models/newsModel.js');
var querystring = require('querystring');
var superagent = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var async = require('async');

charset(superagent);
var url = 'http://news.hpu.edu.cn/news/contents/544/119023.html';
var news = [];

router.get('/', function(req, res, next) {
  superagent
    .get(url)
    .charset('gbk')
    .end(function(err, sres) {
      if (err) {
        return next(err);
      }

      var $ = cheerio.load(sres.text);
      var html = $('td', '#body').filter(function(i, ele) {
        return $(this).attr('align') === 'left';
      });

      var title = $('.NewsTitle', html).text();
      var time = Date.parse(($('tr', html).eq(2).text()).match(/\d{4}(-)\d{2}\1\d{2}/)[0]);
      var tag = $('a', html).eq(1).text();
      var content = $('#NewsContent', html).html();
      var cover = $('img', html).attr('src') === undefined ? 'http://www.hpu.edu.cn/www/upload/2015/5/2295835501.jpg' : $('img', html).attr('src');
      var link = url;
      news.push(
        {
          title: title,
          time: time,
          tag: tag,
          content: content,
          cover: cover,
          url: link
        }
      );

        console.log('connecting...');
        var n = new News({
          title: title,
          time: time,
          tag: tag,
          content: content,
          cover: cover,
          url: link
        }).save();
        console.log('save ok!');
      res.send(news);
    });
});


module.exports = router;

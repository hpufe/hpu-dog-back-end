var express = require('express');
var router = express.Router();

var spiderConfig = require('./config.spider');
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

      console.log($('body', html).attr('src'));
      news.push(
        {
          title: $('.NewsTitle', html).text(),
          time: ($('tr', html).eq(2).text()).match(/\d{4}(-)\d{2}\1\d{2}/)[0],
          tag: $('a', html).eq(1).text(),
          content: $('#NewsContent', html).html(),
          cover: $('img', html).attr('src') === undefined ? 'http://www.hpu.edu.cn/www/upload/2015/5/2295835501.jpg' : $('img', html).attr('src'),
          url: url
        }
      );
      res.send(news);
    });
});


module.exports = router;

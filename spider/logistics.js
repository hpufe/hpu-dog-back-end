var mongoose = require('mongoose');
var Logistics = require('../models/logistics');

var spiderConfig = require('./config');
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');

var getItems = function (req, res, next) {
  var urls = [];
  var items = [];

  superagent
    .get(spiderConfig.logistics.url)
    .set(spiderConfig.logistics.headers)
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }

      var $ = cheerio.load(sres.text);
      $('a', '.datarow').each(function (i, ele) {
        urls.push(url.resolve(spiderConfig.logistics.baseUrl, $(this).attr(
          'href')));
      });

      async.mapLimit(urls, 3, function (item, cb) {
        superagent
          .get(item)
          .set(spiderConfig.logistics.headers)
          .end(function (err, sres) {
            if (err) {
              return next(err);
            }
            cb(null, [sres.text, item])
          });
      }, function (err, result) {
        if (err) {
          return next(err);
        }

        async.each(result, function (item, cb) {
          var $ = cheerio.load(item[0]);
          var title = $('h2', '.title').text();
          var time = Date.parse(($('span', '.title').text()).match(
            /\d{4}(\/)\d{1,2}\1\d{1,2}/)[0].replace(/\//g, '-'));
          var tag = $('a', '.centerrighthead').eq(1).text();
          var content = $('.Newstxt').html();
          var cover = $('img', '.Newstxt').attr('src') ===
            undefined ?
            'http://www.hpu.edu.cn/www/upload/2015/5/2295835501.jpg' :
            $('img', '.Newstxt').attr('src');
          var url = item[1];

          items.push({
            title: title,
            time: time,
            tag: tag,
            content: content,
            cover: cover,
            url: url
          });
          // // 持久化数据
          var s = new Logistics({
            title: title,
            time: time,
            tag: tag,
            content: content,
            cover: cover,
            url: url
          }).save();

        }, function (err) {
          if (err) {
            return next(err);
          }
        });

        res.send(items);
      });
    });
}

exports.getItems = getItems;

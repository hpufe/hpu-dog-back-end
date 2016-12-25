var mongoose = require('mongoose');
var Job = require('./models/job_model');

var spiderConfig = require('./config.spider');
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');

var getJobs = function(req, res, next) {
  var urls = [];
  var items = [];

  async.map(spiderConfig.job.urls, function(item, cb) {
    superagent
      .get(item)
      .set(spiderConfig.job.headers)
      .end(function(err, sres) {
        cb(null, sres.text);
      });
  }, function(err, result) {
    if (err) {
      return next(err);
    }
    // 获取url
    async.each(result, function(item, cb) {

      var $ = cheerio.load(item);
      $('li a', '.content-title').each(function(i, ele) {
        urls.push({
          url: url.resolve(spiderConfig.job.baseUrl, $(this).attr('href')),
          tag: $('a', '.now-location').eq(2).text()
        });
      });
    }, function(err) {
      if (err) {
        return next(err);
      }
    });
    // 获取内容
    async.mapLimit(urls, 3, function(it, cb) {
      superagent
        .get(it.url)
        .set(spiderConfig.logistics.headers)
        .end(function(err, sres) {
          if (err) {
            return next(err);
          }
          cb(null, [sres.text, it.url, it.tag]);
        });
    }, function(err, result) {
      if (err) {
        return next(err);
      }

      async.each(result, function(item, cb) {
        var $ = cheerio.load(item[0]);
        $('.cnt-title').remove();
        var title = $('a', '.now-location').eq(2).text();
        var time = Date.parse($('.cnt-date', '.content-text').text());
        var tag = item[2];
        var content = $('.content-text').html();
        var url = item[1];

        items.push({
          title: title,
          time: time,
          tag: tag,
          content: content,
          url: url
        });

        // 持久化
        var s = new Job({
          title: title,
          time: time,
          tag: tag,
          content: content,
          url: url
        }).save();

        cb(null);
      }, function(err) {
        if (err) {
          return next(err);
        }
      });

      res.send(items);
    });
  });
}

exports.getJobs = getJobs;

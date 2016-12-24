var spiderConfig = require('./config.spider');
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var url = require('url');

var getItems = function(req, res, next) {
  var urls = [];
  var items = [];

  superagent
    .get(spiderConfig.logistics.url)
    .end(function(err, sres) {
      if (err) {
        return next(err);
      }

      var $ = cheerio.load(sres.text);
      $('a', '.datarow').each(function(i, ele) {
        urls.push(url.resolve(spiderConfig.logistics.baseUrl, $(this).attr('href')));
      });

      async.mapLimit(urls, 3, function(item, cb) {
        superagent
          .get(item)
          .end(function(err, sres) {
            if (err) {
              return next(err);
            }
            cb(null, [sres.text, item])
          });
      }, function(err, result) {
        if (err) {
          return next(err);
        }

        async.each(result, function(item, cb) {
          var $ = cheerio.load(item[0]);
          var title = $('h2').text();
          var content = $('.Newstxt').html();
          var cover = $('img', '.Newstxt').attr('src') === undefined ? 'http://www.hpu.edu.cn/www/upload/2015/5/2295835501.jpg' : $('img', '.Newstxt').attr('src');

          items.push({
            title: title,
            content: content,
            cover: cover,
            url: item[1]
          });
        }, function(err) {
          if (err) {
            return next(err);
          }
        });

        res.send(items);
      });
    });
}

exports.getItems = getItems;

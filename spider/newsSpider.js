var express = require('express');
var router = express.Router();

var spiderConfig = require('./config.spider');
var querystring = require('querystring');
var superagent = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var async = require('async');

charset(superagent);

router.get('/', function(req, res, next) {

  async.map(spiderConfig.news.pars, function(item, cb){
    superagent
      .post(spiderConfig.news.baseUrl)
      .send(querystring.parse(item))
      .set(spiderConfig.news.headers)
      .end(function(err, sres) {
        if (err) {
          return next(err);
        }
        cb(null, sres.text);
        console.log('ok!');
      })
  }, function(err, result){
    if (err) {
      return next(err);
    }
    var urls = [];
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
        console.log('err');
        return next(err);
      }
    });
    res.send(urls);
  });

});

module.exports = router;

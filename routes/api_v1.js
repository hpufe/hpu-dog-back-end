var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var News = require('../models/news');

var newsController = require('../api/v1/news');

router.get('/', function (req, res, next) {
  res.jsonp({
    name: 'hpu-dog',
    version: '1.0.0'
  });
});
router.get('/news', newsController.show);

module.exports = router;

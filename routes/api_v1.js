var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var News = require('../spider/models/news_model');

var newsController = require('../api/v1/news');

router.get('/news', newsController.show);
router.get('/news/:id', newsController.show);

module.exports = router;

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/hpuDog');

var newsController = require('../spider/news');
var logisticsController = require('../spider/logistics');
var jobController = require('../spider/job');
var testController = require('../spider/test');

// 新闻
router.get('/news', newsController.getNews);
// 后勤
router.get('/logistics', logisticsController.getItems);
// 招聘
router.get('/job', jobController.getJobs);
// 测试
router.get('/test', testController.test);


module.exports = router;

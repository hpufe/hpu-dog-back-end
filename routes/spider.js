var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/hpuDog');

var newsController = require('../spider/news_spider');
var logisticsController = require('../spider/logistics_spider');
var jobController = require('../spider/job_spider');
var testController = require('../spider/test');

router.get('/news', newsController.getNews);
router.get('/logistics', logisticsController.getItems);
router.get('/job', jobController.getJobs);

router.get('/test', testController.test);


module.exports = router;

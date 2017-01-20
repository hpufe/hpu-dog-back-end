var express = require('express');
var router = express.Router();

var newsController = require('../api/v1/news');
var jobController = require('../api/v1/job');
var logisticsController = require('../api/v1/logistics');

router.get('/', function (req, res, next) {
  res.jsonp({
    name: 'hpu-dog',
    version: '1.0.0'
  });
});

router.get('/news', newsController.show);
router.get('/job', jobController.show);
router.get('/logistics', logisticsController.show);

module.exports = router;

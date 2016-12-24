var mongoose = require('mongoose');
var News = require('../../spider/models/news_model');

var show = function(req, res, next) {
  var id = req.params.id;
  res.json({api: id});
}

exports.show = show;

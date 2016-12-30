var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 招聘
 * @type {Schema}
 * title 标题
 * time 发布时间
 * tag 分类
 * content 内容
 * url 链接
 */
var jobSchema = new Schema({
  title: String,
  time: {type: Date, default: Date.now()},
  tag: String,
  content: String,
  url: {type: String, unique: true}
});

var Job = mongoose.model('Job', jobSchema);

module.exports = Job;

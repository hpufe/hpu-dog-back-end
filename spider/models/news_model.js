var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 新闻信息
 * @type {Schema}
 * title　新闻标题
 * time　新闻发布时间
 * tag　新闻类别
 * content　新闻内容
 * cover　封面图片
 * url　新闻链接
 */
var newsSchema = new Schema({
  title: String,
  time: {type: Date, default: Date.now()},
  tag: String,
  content: String,
  cover: String,
  url: {type: String, unique: true}
});

var News = mongoose.model('News', newsSchema);

module.exports = News;

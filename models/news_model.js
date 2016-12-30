var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 新闻信息
 * @type {Schema}
 * title　标题
 * time　发布时间
 * tag　类别
 * content　内容
 * cover　封面
 * url　链接
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

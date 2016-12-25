var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 后勤服务
 * @type {Schema}
 * title 标题
 * time 发布时间
 * tag 分类
 * content 内容
 * cover 封面
 * url 链接
 */
var logisticsSchema = new Schema({
  title: String,
  time: {type: Date, default: Date.now()},
  tag: String,
  content: String,
  cover: String,
  url: {type: String, unique: true}
});

var Logistics = mongoose.model('Logistics', logisticsSchema);

module.exports = Logistics;

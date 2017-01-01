/**
 * config
 */

var config = {

  // port
  port: process.env.PORT || '3000',

  // mongodb
  db: 'mongodb://127.0.0.1:27017/hpuDog',

  // JWT认证私钥　部署时务必修改！
  authentication: {
    privateKey: 'a258fb28806feb24d07c381b481a5a49'
  },

}

module.exports = config;

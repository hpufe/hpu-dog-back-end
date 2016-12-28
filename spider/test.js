var querystring = require('querystring');
var superagent = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var async = require('async');

charset(superagent);
// 禁用https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

var headers = {
  'Origin': 'https://vpn.hpu.edu.cn',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; InfoPath.3)',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.8,zh;q=0.6',
  'Referer': 'https://vpn.hpu.edu.cn'
}

var url = 'https://vpn.hpu.edu.cn/por/login_psw.csp';
var noticeUrl =
  'https://vpn.hpu.edu.cn/web/1/http/2/218.196.240.155/swfweb/hpugg.aspx?text=&page=1';
var pars =
  'svpn_name=311509040120&svpn_password=7797f7fbf7339c5d12799b6591975cfc6e253f0c15403fb494120de83fc04403a5eda00d71223ffd549a4c89408defc2ebf41f1c6c355d3ad8b5da77a16db52609eec5e7b0b394d6efc33dce104dea2ea86dab9f059e171d530a880e23a932117ce5fbfd6f087b2e5cd6d7539943c7c2a4695a6eba4da8a5d3859967c5832e93';

var test = function (req, res, next) {
  // 获取vpn登陆动态表单地址
  superagent
    .get(url)
    .set(headers)
    .end(function (err, res1) {
      if (err) {
        return next(err);
      }
      var cookie1 = res1.headers['set-cookie'];
      console.log(cookie1);

      var $ = cheerio.load(res1.text);
      var action = 'https://vpn.hpu.edu.cn/por/' + $('form').attr('action') +
        '&encrypt=1';
      headers.Referer = action;
      // 登陆vpn
      superagent
        .post(action)
        .send(querystring.parse(pars))
        .set(headers)
        .set('Cookie', cookie1[0])
        .redirects()
        .end(function (err, res2) {
          if (err) {
            return next(err);
          }
          res.send(res2.text);

        });
    });

};


exports.test = test;

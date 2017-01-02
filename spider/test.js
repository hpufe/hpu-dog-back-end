var querystring = require('querystring');
var superagent = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var async = require('async');

charset(superagent);

// 禁用https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

var headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; InfoPath.3)',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.8,zh;q=0.6',
  'Referer': 'https://vpn.hpu.edu.cn'
}

var noticeUrl =
  'https://vpn.hpu.edu.cn/web/1/http/0/218.196.240.155/swfweb/hpugg.aspx';

var test = function (req, res, next) {
  superagent
    .get(noticeUrl)
    .set(headers)
    .set('Cookie',
      'language=en_US; collection=%7Bpage_state%3A%27started%27%2Cneed_ist_cscm%3A%27-1%27%2CscacheUseable%3A0%2CAppCount%3A0%7D; g_LoginPage=login_psw; VisitTimes=0; haveLogin=1; ENABLE_RANDCODE=0; LoginMode=2; websvr_cookie=1483367073257638; TWFID=0b20169190006945; VpnLine=https%3A%2F%2Fvpn.hpu.edu.cn%2F; webonly=1; allowlogin=1'
    )
    .redirects()
    .end(function (err, res3) {
      var cookie3 = res3.headers['set-cookie'];
      console.log(cookie3 + 'cookie3');
      res.send(res3.text);

    })
};


exports.test = test;

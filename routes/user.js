var express = require('express');
var router = express.Router();

var signController = require('../controllers/sign');

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,content-type, Authorization');
  next();
});

function ensureAuthorized(req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    console.log(bearerHeader);
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({
      err: '没有访问权限'
    });
  }
};

// 注册
router.post('/signup', signController.signup);
// 登陆
router.post('/signin', signController.signin);
// 登出
router.get('/signout', signController.signout);

// 个人信息
router.get('/me', ensureAuthorized, function (req, res, next) {
  res.send('me!');
})


module.exports = router;

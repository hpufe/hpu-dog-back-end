var express = require('express');
var router = express.Router();

var signController = require('../controllers/sign');

// 注册
router.post('/signup', signController.signup);
// 登陆
router.post('/signin', signController.signin);
// 登出
router.get('/signout', signController.signout);


module.exports = router;

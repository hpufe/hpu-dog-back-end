var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');
var signController = require('../controllers/sign');

// 用户
router.post('/signup', signController.signup);
router.post('/signin', signController.signin);

// 个人信息
router.get('/me', auth.ensureAuthorized, auth.roleAuth,
  function (req, res, next) {
    var token = req.token;
    res.send(token);
  })


module.exports = router;

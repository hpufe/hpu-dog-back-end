var User = require('../models/user');

var validator = require('validator');

/**
 * 注册
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.signup = function (req, res, next) {
  var userName = validator.trim(req.body.userName).toLowerCase();
  var email = validator.trim(req.body.email).toLowerCase();
  var pass = validator.trim(req.body.pass);
  var repass = validator.trim(req.body.repass);

  if ([userName, email, pass, repass].some(function (item) {
      return item === '';
    })) {
    res.status(422).json({
      err: '信息不完整'
    });
    return;
  }

  if (userName.length < 3) {
    res.status(422).json({
      err: '用户名至少需要5个字符'
    });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(422).json({
      err: '请填写正确的邮箱'
    });
    return;
  }

  if (pass !== repass) {
    res.status(422).json({
      err: '两次输入密码不一致'
    });
    return;
  }

  var s = new User({
    userName: userName,
    email: email,
    pass: pass
  }).save();

  res.send('add user ok! ' + userName);
}

/**
 * 登陆
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.signin = function (req, res, next) {
  var userName = validator.trim(req.body.userName).toLowerCase();
  var pass = validator.trim(req.body.pass);

  if ([userName, pass].some(function (item) {
      return item === '';
    })) {
    res.status(422).json({
      err: '信息不完整'
    });
    return;
  }
  // 用户名合法验证
  if (userName.length < 3) {
    res.status(422).json({
      err: '用户名至少需要5个字符'
    });
    return;
  }

  User.findOne({
    userName: userName
  }, function (err, user) {
    if (err) {
      return next(err);
    }

    user.comparePass(pass, function (err, isMatch) {
      if (isMatch) {
        res.json({
          user: userName
        });
      } else {
        res.status(422).json({
          err: '登陆失败'
        });
      }
    });
  });
}

/**
 * 登出
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.signout = function (req, res, next) {
  res.send('signout');
}

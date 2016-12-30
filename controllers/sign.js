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

  res.send('user ok! ' + email + userName);
}

/**
 * 登陆
 * @param  {HttpRequest}   req
 * @param  {HttpResponse}   res
 * @param  {Function} next
 * @return {[type]}
 */
exports.signin = function (req, res, next) {
  res.send('signin');
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
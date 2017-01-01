var jwt = require('jsonwebtoken');
var config = require('../config');

/**
 * 验证token
 */
exports.ensureAuthorized = function (req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];

    jwt.verify(bearerToken, config.authentication.privateKey,
      function (err, decoded) {
        if (err) {
          res.status(403).json({
            err: '没有访问权限'
          });
        } else {
          req.token = bearerToken;
          next();
        }
      });
  } else {
    res.status(403).json({
      err: '没有访问权限'
    });
  }
};

/**
 * 角色认证
 */
exports.roleAuth = function (req, res, next) {
  var token = req.headers["authorization"].split(" ")[1];
  var decoded = jwt.decode(token);

  console.log(decoded);
  if (decoded.role < 10) {
    console.log('you are nomal user!');
    next();
  } else {
    res.status(403).json({
      err: '没有访问权限'
    });
  }
}

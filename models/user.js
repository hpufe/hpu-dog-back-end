var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var saltRounds = 10;

var userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  pass: String,
  email: String,
  createAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
});

userSchema.pre('save', function (next) {
  var user = this;

  if (this.isNew) {
    this.createAt = this.updateAt = Date.now();
  } else {
    this.updateAt = Date.now();
  }

  bcrypt.hash(user.pass, saltRounds, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.pass = hash;
    next();
  });
});

userSchema.methods = {
  comparePass: function (password, cb) {
    bcrypt.compare(password, this.pass, function (err, res) {
      if (err) {
        return next(err);
      }

      cb(null, res);
    })
  }
}

var User = mongoose.model('User', userSchema);

module.exports = User;

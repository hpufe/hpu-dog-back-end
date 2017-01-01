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

  avatar: {
    type: String,
    default: 'img/avatar.png'
  },
  realName: {
    type: String,
    default: '未完善'
  },
  phoneNum: {
    type: Number,
    default: 0
  },
  qq: {
    type: Number,
    default: 0
  },

  role: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },

  studentNum: {
    type: Number,
    default: 0
  },
  vpnPass: {
    type: Number,
    default: 0
  },
  jwcPass: {
    type: Number,
    default: 0
  },
  timeTable: String,
  studentScore: String,

  token: String,
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

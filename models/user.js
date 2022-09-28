const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Unauthorized } = require('../utils/Unauthorized');

const userSchema = new mongoose.Shcema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неверный email или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Unauthorized('Неверный email или пароль'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);

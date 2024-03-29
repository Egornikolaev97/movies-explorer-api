const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { JWT_SECRET_DEV } = require('../configuration/index');
const NotFoundError = require('../utils/NotFoundError');
const ConflictError = require('../utils/ConflictError');
const BadRequestError = require('../utils/BadRequestError');
const {
  errorIncorrectData,
  errorUserAlreadyExists,
  errorUserNotFound,
  errorIncorrectUserId,
} = require('../configuration/constants');

// получение данных о пользователе
module.exports.getUserMe = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => res.send(user))
    .catch(next);
};

// создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.send({
        data: {
          email: user.email,
          name: user.name,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorIncorrectData));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(errorUserAlreadyExists));
        return;
      }
      next(err);
    });
};

// обновление данных пользователя
module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
        return;
      }
      throw new NotFoundError(errorUserNotFound);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorIncorrectData));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(errorUserAlreadyExists));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError(errorIncorrectUserId));
        return;
      }
      next(err);
    });
};

// логин
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

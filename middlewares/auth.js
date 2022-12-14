const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { JWT_SECRET_DEV } = require('../configuration/index');
const Unauthorized = require('../utils/Unauthorized');
const { errorAuthorization } = require('../configuration/constants');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized(errorAuthorization);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    next(new Unauthorized(errorAuthorization));
    return;
  }

  req.user = payload;

  next();
};

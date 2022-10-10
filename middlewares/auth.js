const jwt = require('jsonwebtoken');
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
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new Unauthorized(errorAuthorization));
    return;
  }

  req.user = payload;

  next();
};

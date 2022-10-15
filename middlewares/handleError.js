const { SERVER_ERROR_STATUS } = require('../utils/status');
const { errorServerMessage } = require('../configuration/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR_STATUS, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR_STATUS
        ? errorServerMessage
        : message,
    });
  next();
};

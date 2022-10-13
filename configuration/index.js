require('dotenv').config();

const DATABASE = 'mongodb://localhost:27017/bitfilmsdb';
const JWT_SECRET_DEV = 'secret-key';

module.exports = {
  DATABASE,
  JWT_SECRET_DEV,
};

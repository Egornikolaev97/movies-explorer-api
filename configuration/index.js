require('dotenv').config();

const DATABASE_DEV = 'mongodb://localhost:27017/moviesdb';
const JWT_SECRET_DEV = 'secret-key';

module.exports = {
  DATABASE_DEV,
  JWT_SECRET_DEV,
};

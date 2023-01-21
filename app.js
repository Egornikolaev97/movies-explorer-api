require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
// const cors = require('cors');
const handleError = require('./middlewares/handleError');
const cors = require('./middlewares/cors');
const routes = require('./routes/index');
const { DATABASE_DEV } = require('./configuration/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter');

const app = express();
const { PORT = 3500, NODE_ENV, DATABASE_PROD } = process.env;

console.log(process.env.JWT_SECRET);
console.log(process.env.NODE_ENV);
console.log(process.env.DATABASE_PROD);

mongoose.connect(NODE_ENV === 'production' ? DATABASE_PROD : DATABASE_DEV, {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log('hello world');
});

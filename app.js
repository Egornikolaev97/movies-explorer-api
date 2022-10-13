require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { DATABASE } = require('./configuration/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');

const app = express();
const { PORT = 3000 } = process.env;

console.log(process.env.JWT_SECRET);
console.log(process.env.NODE_ENV);

mongoose.connect(DATABASE);

app.use(helmet());

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log('hello world');
});

const { Joi, celebrate } = require('celebrate');
const router = require('express').Router();
const NotFoundError = require('../utils/NotFoundError');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { errorPageNotFound } = require('../configuration/constants');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use(() => {
  throw new NotFoundError(errorPageNotFound);
});

module.exports = router;

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const moviesRoutes = require('./movies');
const usersRoutes = require('./users');
const { createUser, authAdmin } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }),
}), authAdmin);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.use('/users', auth, usersRoutes);
router.use('/movies', auth, moviesRoutes);
router.use((req) => {
  throw new NotFoundError(`Ресурс по адресу ${req.path} не найден`);
});

module.exports = router;

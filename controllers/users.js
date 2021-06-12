const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-error");
const AuthError = require("../errors/auth-error");
const EmailError = require('../errors/email-error');

const { JWT_SECRET_KEY = 'secret_key', saltRounds = 10 } = process.env;

exports.getUserInfo = async (req, res, next) => {
  try {
    const userId = await User.findById(req.user._id);
    const { email, name } = userId;
    if (!userId) {
      throw new Error('Пользователь не найден');
    }
    res.send(email, name);
  } catch (e) {
    if (e.name === "CastError") {
      throw new Error('Переданы некорректные данные');
    } else {
      next(e);
    }
  }
};

exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new Error('Переданы некорректные данные');
      }
      next(err);
    });
};

exports.authAdmin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      throw new AuthError('Авторизация не пройдена');
    })
    .catch(next);
};

exports.createUser = async (req, res, next) => {
  const {
    name, email,
  } = req.body;
  bcrypt.hash(req.body.password, saltRounds)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const userData = {
        email: user.email,
        name: user.name,
      };
      res.send(userData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы неверные данные');
      } else if (err.name === 'MongoError') {
        throw new EmailError('Пользователь с таким email уже зарегистрирован');
      } else {
        next(err);
      }
    })
    .catch(next);
};

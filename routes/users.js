const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { updateProfile, getUserInfo } = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get(
  '/me',
  getUserInfo,
);

usersRoutes.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

module.exports = usersRoutes;

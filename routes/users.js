const express = require("express");
const { celebrate, Joi } = require('celebrate');

const { updateProfile, getUserInfo } = require("../controllers/users");

const usersRoutes = express.Router();

usersRoutes.get("/me", celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
}), getUserInfo);

usersRoutes.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
}), updateProfile);

module.exports = usersRoutes;

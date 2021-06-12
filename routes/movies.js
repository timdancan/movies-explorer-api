const express = require("express");
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

const moviesRoutes = express.Router();

moviesRoutes.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message(
            'Поле "image" должно быть валидным url-адресом',
          );
        })
        .messages({
          "any.required": 'Поле "image" должно быть заполнено',
        }),
      trailer: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message(
            'Поле "trailer" должно быть валидным url-адресом',
          );
        })
        .messages({
          "any.required": 'Поле "trailer" должно быть заполнено',
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message(
            'Поле "thumbnail" должно быть валидным url-адресом',
          );
        })
        .messages({
          "any.required": 'Поле "thumbnail" должно быть заполнено',
        }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().min(2).max(200).required(),
      })
      .unknown(),
  }), createMovie,
);

moviesRoutes.get("/", celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
}), getMovies);

moviesRoutes.delete("/movieId", celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id фильма');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200).required(),
  }).unknown(),
}), deleteMovie);

module.exports = moviesRoutes;

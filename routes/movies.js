const express = require("express");
const { getMovies, createMovie, deleteMovie } = require("../controllers/movies");

// const { celebrate, Joi } = require('celebrate');

const moviesRoutes = express.Router();

moviesRoutes.get("/", getMovies);

moviesRoutes.post("/", createMovie);

moviesRoutes.delete("/movieId", deleteMovie);

module.exports = moviesRoutes;

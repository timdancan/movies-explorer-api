const express = require("express");

const { updateProfile, getUserInfo } = require("../controllers/users");
// const { celebrate, Joi } = require('celebrate');

const usersRoutes = express.Router();

usersRoutes.get("/me", getUserInfo);

usersRoutes.patch("/me", updateProfile);

module.exports = usersRoutes;

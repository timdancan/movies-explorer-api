const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const usersRoutes = require("./routes/users");
const moviesRoutes = require("./routes/movies");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, authAdmin } = require("./controllers/users");
const NotFoundError = require("./errors/not-found-err");
const errorHandler = require("./middlewares/error-handler");

const {
  PORT = 3000,
  MONGO_URL = "mongodb://localhost:27017/bitfilmsdb",
} = process.env;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  await app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
  });
}

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(1),
  }),
}), authAdmin);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.use("/users", auth, usersRoutes);
app.use("/movies", auth, moviesRoutes);
app.use((req) => {
  throw new NotFoundError(`Ресурс по адресу ${req.path} не найден`);
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

main();

const Movie = require("../models/movie");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-error");

exports.getMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    if (!movie) {
      throw new NotFoundError("фильмы или пользователь не найден");
    }
    res.send(movie);
  } catch (e) {
    next(e);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    res.json(movie);
  } catch (e) {
    if (e.name === "ValidationError") {
      throw new BadRequestError("Переданы некорректные данные");
    } else {
      next(e);
    }
  }
};

exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError("Фильм по указанному _id не найден");
      }
      if (movie.owner.toString() !== owner) {
        throw new BadRequestError("Можно удалять только свои фильмы");
      }
      Movie.findByIdAndRemove(movieId).then(() => {
        res.send(movie);
      });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        throw new BadRequestError("Неправильный формат id");
      } else {
        next(e);
      }
    });
};

const Movie = require("../models/movie");

exports.getMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    if (!movie) {
      throw new Error("фильмы или пользователь не найден");
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
      throw new Error("Переданы некорректные данные");
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
        throw new Error("карточка или пользователь не найден");
      }
      if (movie.owner.toString() !== owner) {
        throw new Error("Нет прав на удаление карточки");
      }
      Movie.findByIdAndRemove(movieId).then(() => {
        res.send(movie);
      });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        throw new Error("Переданы некорректные данные");
      } else {
        next(e);
      }
    });
};

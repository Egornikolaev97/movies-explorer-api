const Movie = require('../models/movie');
const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');
const {
  errorIncorrectMovieId,
  errorMovieIdNotFound,
  errorIncorrectUserId,
  errorDeleteRight,
  textMovieDeleted,
} = require('../configuration/constants');

// получение списка фильмов
module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;

  Movie.find({ owner: _id })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError(errorMovieIdNotFound);
      }
      res.send({ data: movies });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorIncorrectUserId));
        return;
      }
      next(err);
    });
};

// создание карточки фильма
module.exports.createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    nameRU,
    nameEN,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    nameRU,
    nameEN,
    trailerLink,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorIncorrectMovieId));
        return;
      }
      next(err);
    });
};

// удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError(errorMovieIdNotFound);
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError(errorDeleteRight));
      }
      return movie
        .remove()
        .then(() => res.status(200).send({ message: textMovieDeleted }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorIncorrectMovieId));
        return;
      }
      next(err);
    });
};

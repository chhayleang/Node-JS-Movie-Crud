const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth,async (req, res) => {
  const movies = await Movie.find().sort('name').select('-__v');
  res.send(movies);
});

router.post('/', auth,async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movie = await movie.save();
  movie.__v = undefined;
  res.send(movie);
});

router.put('/:id', auth,async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  movie.__v = undefined;

  res.send(movie);
});

router.delete('/:id',auth, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  movie.__v = undefined;

  res.send(movie);
});

router.get('/:id',auth, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  movie.__v = undefined;

  res.send(movie);
});

module.exports = router; 
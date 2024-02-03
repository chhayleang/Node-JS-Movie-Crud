const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // import middle ware
const admin = require('../middlewares/admin');

router.get('/', auth, async (req, res) => {
  const genres = await Genre.find().sort('name').select('-__v');
  res.send(genres);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  genre.__v = undefined;

  res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  genre.__v = undefined;
  res.send(genre);
});

// here middlewares is applied, first check if auth, then if admin
router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findOneAndDelete(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  genre.__v = undefined;

  res.send(genre);
});

router.get('/:id', auth, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  genre.__v = undefined;
  res.send(genre);
});

module.exports = router;
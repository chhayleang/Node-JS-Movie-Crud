const express = require('express');
const router = express.Router();
const { Rental, validateRental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const auth = require('../middlewares/auth');

router.get('/', auth, async (req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 }).select('-__v');
    res.send(rentals);
});


router.post('/', auth, async (req, res) => {
    console.log(`Rental Request ${JSON.stringify(req.body)}`);
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie is out of stock.');;

    let rental = new Rental({
        customer: customer,
        movie: movie,
        dateReturn: Date.parse(req.body.dateReturn),
        rentalFee: req.body.rentalFee
    });

    rental = await rental.save();
    movie.numberInStock--;
    movie.save();
    rental.__v = undefined;

    res.send(rental);
});


module.exports = router;
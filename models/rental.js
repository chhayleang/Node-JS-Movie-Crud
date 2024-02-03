const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 5,
                maxlength: 255,
                required: true,
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                default: '',
                maxlength: 255,
                required: false,
            }
        }),

    },
    movie: {
        type: new mongoose.Schema(
            {
                title: {
                    type: String,
                    trim: true,
                    required: true
                },
                dailyRentalRate: {
                    type: Number,
                    minlength: 0,// prevent negative
                    maxlength: 255,
                    required: true,
                },

            }
        ),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturn: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        default: 0,
        minlength: 0,
        required: true
    }
}));


function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
        dateReturn: Joi.date(),
        rentalFee: Joi.number().required()
    });
    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;
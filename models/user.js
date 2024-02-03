const joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/config.json');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        require: true,
        unique: true,
        maxlength: 100
    },
    password: {
        type: String,
        require: true,
        maxlength: 1024,// need to hash the password to long screen
        minlength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    console.log(`USER  FOR TOKEN ${this}`);
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.jwt_secret_key);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = joi.object({
        name: joi.string().min(5).max(255).required(),
        email: joi.string().min(5).max(255).email().required(),
        password: joi.string().min(8).max(1024).required()
    });

    return schema.validate(user);
}


exports.User = User;
exports.validateUser = validateUser;
// exports.generateAuthToken = this.generateAuthToken();
const { User, validateUser } = require('../models/user');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email }); // find if email is existed

    if (user) return res.status(400).send('Email is already registered.');

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    user = new User(_.pick(req.body, ['name', 'email', 'password']));// pick only name  email, password from request's body.
    // store hash of user password
    bcrypt.hash(user.password, 10, (err, hash) => {
        console.log(hash);
        user.password = hash;
        user.save();
    });
    user.__v = undefined;

    const token = user.generateAuthToken();

    // res.header('x-auth-token', token);
    res.status(200)
        .send({
            user: _.pick(user, ['name', 'email', 'password']),
            access_token: token
        });

});

router.post('/login', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    });

    if (!user) return res.status(400).send('Invalid email or password.');

    bcrypt.compare(req.body.password, user.password, (err, isValid) => {

        if (!isValid) return res.status(400).send('Invalid email or password.');

        const token = user.generateAuthToken();

        res.status(200)
            .send({
                user: _.pick(user, ['name', 'email', 'password']),
                access_token: token
            });
    });
});


router.get('/get-current-user', auth, async (req, res) => {
    // console.log(req.rawHeaders);
    const user = await User.findById(req.user._id).select('-password -__v');
    console.log(`user ${user}`);
    res.status(200).send({
        'user': user
    });
})


function validate(request) {
    const schema = Joi.object(
        {
            email: Joi.string().min(5).max(255).email().required(),
            password: Joi.string().min(5).max(255).required()
        }
    );
    return schema.validate(request);
}

module.exports = router;
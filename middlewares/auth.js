const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

module.exports = function auth(req, res, next) {
    const header = req.headers.authorization; // need authorization header here for bareer token


    if (!header) return res.status(401).send('Access denied. No token provided.');
    try {
        const token = header.split(' ')[1];

        console.log(`PAYLOAD ${token}`);

        jwt.verify(token, config.jwt_secret_key, (err, user) => {

            console.log(`USER FROM VERIFY ${user._id}`);
            req.user = user;
            console.log(user);
        });
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
}



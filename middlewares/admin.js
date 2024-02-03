module.exports = function (req, res, next) {

    // 401 for unauthorize  => invalid token
    // 403 for Forbidden = valid token but can't access

    if (!req.user.isAdmin) return res.status(403).send('Access denied');
    next();
}
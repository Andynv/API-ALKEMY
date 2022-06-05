const jwt = require('jsonwebtoken');

const config = process.env;

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).send('Invalid token.');
    }
};
module.exports = authenticate;
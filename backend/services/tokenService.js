const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const generateToken = (payload, expiresIn = '1h') =>
    jwt.sign(payload, jwtSecret, { expiresIn });

const verifyToken = token =>
    jwt.verify(token, jwtSecret);

module.exports = { generateToken, verifyToken };

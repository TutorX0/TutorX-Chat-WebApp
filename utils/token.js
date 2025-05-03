const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,    // Keep secret key in env file
        { expiresIn: "7d" }         // Token expires in 7 days
    );
};

module.exports = generateToken;

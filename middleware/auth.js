const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET; // use .env in production

exports.authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expecting: Bearer <token>
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-otp"); // exclude OTP details
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user; // attach user to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

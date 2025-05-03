const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    otp: {
        code: { type: String },
        createdAt: { type: Date }
    }
});

module.exports = mongoose.model("User", userSchema);

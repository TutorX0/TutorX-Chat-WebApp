const User = require("../models/userModel"); // Now user model has otp fields
const sendOTP = require("../utils/mailer");
const crypto = require("crypto");
const generateToken = require("../utils/token"); // import the token generator

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const otpCode = generateOTP();

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email });
        }

        user.otp = {
            code: otpCode,
            createdAt: new Date()
        };

        await user.save();

        await sendOTP(email, otpCode);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) return res.status(400).json({ message: "Email & OTP required" });

        const user = await User.findOne({ email });

        if (!user || !user.otp || !user.otp.code) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }

        // Check if OTP expired
        const now = new Date();
        const otpAge = now - user.otp.createdAt;
        if (otpAge > 300000) {
            // 5 minutes
            user.otp = undefined;
            await user.save();
            return res.status(400).json({ message: "OTP expired" });
        }

        if (user.otp.code !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP verified
        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        // Generate JWT Token
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Signup successful",
            token, // Send token back
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
      const user = req.user; // comes from middleware
      res.status(200).json({
        status: "success",
        user: {
          id: user._id,
          email: user.email,
          about : user.about,
          isVerified: user.isVerified,
        }
      });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
  };
  
  exports.updateAbout = async (req, res) => {
    const { email, about } = req.body;
  
    if (!email || typeof about !== "string") {
      return res.status(400).json({ status: "error", message: "Email and about are required." });
    }
  
    try {
      const user = await User.findOneAndUpdate(
        { email },
        { about },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ status: "error", message: "User not found." });
      }
  
      res.status(200).json({
        status: "success",
        message: "About section updated successfully.",
        user
      });
  
    } catch (error) {
      console.error("Update about error:", error);
      res.status(500).json({ status: "error", message: "Internal server error." });
    }
  };
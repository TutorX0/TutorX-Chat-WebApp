const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, getUserProfile } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
// Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/me", authenticateToken,getUserProfile);

module.exports = router;
const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, getUserProfile, updateAbout } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
// Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/me", authenticateToken,getUserProfile);
router.put("/update-about", updateAbout);

module.exports = router;

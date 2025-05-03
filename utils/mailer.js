const nodemailer = require("nodemailer");
require('dotenv').config();

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Signup",
        text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };
    await transport.sendMail(mailOptions);
};

module.exports = sendOTP;
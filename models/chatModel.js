const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        chatId: { type: String, required: true, unique: true }, // Unique ID based on phone number
        phoneNumber: { type: String, required: true }, // WhatsApp Number
        name: { type: String, required: true } // Dynamic Guest Name (e.g., Guest 1, Guest 2)
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
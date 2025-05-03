const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        chatId: { type: String, required: true }, // From Chat model
        phoneNumber: { type: String, required: true },
        sender: { type: String, enum: ["user", "admin"], required: true }, // Who sent it
        messageType: { type: String, required: true }, // text, image, video, etc.
        content: { type: String }, // Text or caption
        mediaUrl: { type: String } // Optional for media
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
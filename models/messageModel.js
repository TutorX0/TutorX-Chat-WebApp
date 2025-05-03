const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    sender: { type: String, enum: ["user", "admin"], required: true },
    messageType: { type: String, required: true },
    content: { type: String },
    mediaUrl: { type: String },
    fileName: { type: String } // Add this line
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

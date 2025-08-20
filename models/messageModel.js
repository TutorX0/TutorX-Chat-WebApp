const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        chatId: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        sender: { type: String, enum: ["user", "admin"], required: true },
        messageType: { type: String, required: true },
        content: { type: String },
        mediaUrl: { type: String },
        isForwarded: { type: Boolean, default: false },
        replyTo: {
            type: {
                sender: { type: String, default: "" },
                content: { type: String, default: "" },
                mediaType: { type: String, default: "" }
            },
            default: null
        },
        fileName: { type: String }, // Add this line
        whatsappMessageId: { type: String }, // to link WhatsApp ID to message
        status: {
        type: String,
        enum: ["pending", "sent", "delivered", "read", "failed"],
        default: "pending"
        },
        read: { type: Boolean, default: false }, // Add this in the schema
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

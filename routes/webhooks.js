const express = require("express");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
require("dotenv").config();

const router = express.Router();

const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;

// Generate guest name dynamically
const generateGuestName = async () => {
    const count = await Chat.countDocuments(); // Count existing chats
    return `Guest ${count + 1}`;
};

// Webhook Endpoint for Incoming WhatsApp Messages
router.post("/webhook", async (req, res) => {
    try {
        const body = req.body;

        if (body.object && body.entry?.[0]?.changes?.[0]?.value?.messages?.length > 0) {
            const message = body.entry[0].changes[0].value.messages[0];
            const phoneNumber = message.from;
            const type = message.type;
            let content = "";
            let mediaUrl = null;

            // Determine message content
            if (type === "text") {
                content = message.text.body;
            } else if (type === "image") {
                content = message.image?.caption || "Image received";
                mediaUrl = message.image?.link || null;
            } else if (type === "document") {
                content = message.document?.caption || "Document received";
                mediaUrl = message.document?.link || null;
            } else if (type === "audio") {
                content = "Audio received";
                mediaUrl = message.audio?.link || null;
            } else if (type === "video") {
                content = message.video?.caption || "Video received";
                mediaUrl = message.video?.link || null;
            } else {
                content = "Unsupported message type";
            }

            let chat = await Chat.findOne({ phoneNumber });

            if (!chat) {
                const name = await generateGuestName();
                chat = new Chat({
                    chatId: generateChatId(phoneNumber),
                    phoneNumber,
                    name
                });
                await chat.save();
            }

            const newMessage = new Message({
                chatId: chat.chatId,
                phoneNumber,
                sender: "user",
                messageType: type,
                content,
                mediaUrl
            });

            await newMessage.save();
            res.status(200).send("EVENT_RECEIVED");
        } else {
            res.status(404).send("No valid message");
        }
    } catch (err) {
        console.error("Webhook error:", err);
        res.sendStatus(500);
    }
});

// Webhook Verification (Required by Meta)
router.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;

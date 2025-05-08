const express = require("express");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
require("dotenv").config();

const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;
const generateGuestName = async () => {
    const count = await Chat.countDocuments();
    return `Guest ${count + 1}`;
};

module.exports = (io) => {
    const router = express.Router();

    // ✅ Verification route for Meta
    router.get("/", (req, res) => {
        const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    });

    // ✅ WhatsApp webhook message receiver
    router.post("/", async (req, res) => {
        try {
            const body = req.body;

            if (body.object && body.entry?.[0]?.changes?.[0]?.value?.messages?.length > 0) {
                const message = body.entry[0].changes[0].value.messages[0];
                const phoneNumber = message.from;
                const type = message.type;
                let content = "";
                let mediaUrl = null;
                let fileName = null;

                if (type === "text") {
                    content = message.text.body;
                } else if (type === "image") {
                    content = message.image?.caption || "";
                    mediaUrl = message.image?.link || null;
                } else if (type === "document") {
                    content = message.document?.caption || "Document received";
                    mediaUrl = message.document?.link || null;
                    fileName = message.document?.filename || null;
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
                    mediaUrl,
                    fileName
                });

                await newMessage.save();

                io.emit("newMessage", {
                    chatId: chat.chatId,
                    phoneNumber,
                    sender: "user",
                    messageType: type,
                    content,
                    mediaUrl,
                    fileName,
                    timestamp: newMessage.createdAt
                });

                return res.status(200).send("EVENT_RECEIVED");
            } else {
                return res.status(404).send("No valid message");
            }
        } catch (err) {
            console.error("Webhook error:", err);
            return res.sendStatus(500);
        }
    });

    return router;
};

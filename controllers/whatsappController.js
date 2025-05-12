// controllers/whatsappController.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const { getIO } = require("../socket");

const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;
const generateGuestName = async () => {
    const count = await Chat.countDocuments();
    return `Guest ${count + 1}`;
};

exports.receiveMessage = async (req, res) => {
    try {
        const body = req.body;
        const change = body?.entry?.[0]?.changes?.[0]?.value;

        if (!change) {
            return res.sendStatus(400);
        }

        // ✅ Case 1: Incoming message from user
        if (change.messages && change.messages[0]) {
            const message = change.messages[0];
            const phoneNumber = message.from;
            const type = message.type;

            let content = "";
            let mediaUrl = null;
            let fileName = null;

            const token = process.env.ACCESS_TOKEN;

            const saveMedia = async (mediaId) => {
                const mediaInfoResponse = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const mediaUrlFromAPI = mediaInfoResponse.data.url;
                const mediaResponse = await axios.get(mediaUrlFromAPI, {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "arraybuffer"
                });

                const uploadDir = path.join(__dirname, "../uploads");
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

                let fileExt = ".bin";
                const contentType = mediaResponse.headers["content-type"];
                if (contentType) {
                    const extMap = {
                        "image/jpeg": ".jpg",
                        "image/png": ".png",
                        "video/mp4": ".mp4",
                        "audio/mpeg": ".mp3",
                        "audio/mp3": ".mp3",
                        "application/pdf": ".pdf",
                        "application/msword": ".doc",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx"
                    };
                    fileExt = extMap[contentType.toLowerCase()] || ".bin";
                }

                const savedFileName = `${Date.now()}-whatsapp-media${fileExt}`;
                const savedPath = path.join(uploadDir, savedFileName);
                fs.writeFileSync(savedPath, mediaResponse.data);
                return {
                    filePath: `/uploads/${savedFileName}`,
                    fileName: savedFileName
                };
            };

            // Process message type
            switch (type) {
                case "text":
                    content = message.text.body;
                    break;
                case "image":
                    content = message.image.caption || "";
                    const imageData = await saveMedia(message.image.id);
                    mediaUrl = imageData.filePath;
                    fileName = imageData.fileName;
                    break;
                case "document":
                    content = message.document.caption || "";
                    const docData = await saveMedia(message.document.id);
                    mediaUrl = docData.filePath;
                    fileName = message.document.filename || docData.fileName;
                    break;
                case "audio":
                    content = "Audio received";
                    const audioData = await saveMedia(message.audio.id);
                    mediaUrl = audioData.filePath;
                    fileName = audioData.fileName;
                    break;
                case "video":
                    content = message.video.caption || "";
                    const videoData = await saveMedia(message.video.id);
                    mediaUrl = videoData.filePath;
                    fileName = videoData.fileName;
                    break;
                case "sticker":
                    content = "Sticker received";
                    const stickerData = await saveMedia(message.sticker.id);
                    mediaUrl = stickerData.filePath;
                    fileName = stickerData.fileName;
                    break;
                case "button":
                    content = `Button clicked: ${message.button.text}`;
                    break;
                case "interactive":
                    content = `Interactive response: ${
                        message.interactive.button_reply?.title || message.interactive.list_reply?.title
                    }`;
                    break;
                default:
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

            const io = getIO();
            if (io) {
                io.emit("newMessage", {
                    chatId: chat.chatId,
                    phoneNumber,
                    sender: "user",
                    messageType: type,
                    content,
                    mediaUrl,
                    fileName,
                    isForwarded: false,
                    replyTo: null,
                    timestamp: newMessage.createdAt
                });
            } else {
                console.log("Socket.IO not initialized");
            }

            return res.status(200).send("EVENT_RECEIVED");
        }

        // 🚫 Case 2: Message status update (e.g., sent, delivered, failed)
        if (change.statuses && change.statuses[0]) {
            const statusObj = change.statuses[0];
            const messageId = statusObj.id;
            const status = statusObj.status;
            const recipientId = statusObj.recipient_id;
            const timestamp = statusObj.timestamp;
            const errors = statusObj.errors || [];

            console.log("📡 Status Update:");
            console.log({ messageId, status, recipientId, timestamp, errors });

            // You can optionally log to DB or emit to UI here

            return res.status(200).send("STATUS_RECEIVED");
        }

        return res.status(200).send("NO_RELEVANT_EVENT");
    } catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(500);
    }
};


exports.verifyWebhook = (req, res) => {
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully.");
        return res.status(200).send(challenge);
    } else {
        console.warn("Webhook verification failed.");
        return res.sendStatus(403);
    }
};

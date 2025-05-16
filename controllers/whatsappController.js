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

        if (
            body.object &&
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const message = body.entry[0].changes[0].value.messages[0];
            const phoneNumber = message.from.startsWith("+") ? message.from.slice(1) : message.from;
            const type = message.type;
            let content = "";
            let mediaUrl = null;
            let fileName = null;

            const token = process.env.ACCESS_TOKEN;

            // Inline media download logic (similar to Multer's file saving style)
            const saveMedia = async (mediaId) => {
                const mediaInfoResponse = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const mediaUrlFromAPI = mediaInfoResponse.data.url;
                const mediaResponse = await axios.get(mediaUrlFromAPI, {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "arraybuffer"
                });

                // Save to uploads folder
                const uploadDir = path.join(__dirname, "../uploads");
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

                let fileExt = ".bin";
                const contentType = mediaResponse.headers["content-type"];
                if (contentType) {
                    switch (contentType.toLowerCase()) {
                        case "image/jpeg":
                            fileExt = ".jpg";
                            break;
                        case "image/png":
                            fileExt = ".png";
                            break;
                        case "video/mp4":
                            fileExt = ".mp4";
                            break;
                        case "audio/mpeg":
                        case "audio/mp3":
                            fileExt = ".mp3";
                            break;
                        case "application/pdf":
                            fileExt = ".pdf";
                            break;
                        case "application/msword":
                            fileExt = ".doc";
                            break;
                        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                            fileExt = ".docx";
                            break;
                    }
                }

                const savedFileName = `${Date.now()}-whatsapp-media${fileExt}`;
                const savedPath = path.join(uploadDir, savedFileName);
                fs.writeFileSync(savedPath, mediaResponse.data);
                return {
                    filePath: `/uploads/${savedFileName}`,
                    fileName: savedFileName
                };
            };

            // Process message based on type
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

            // Find or create chat
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

            // Create new message
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

            // Emit event via Socket.IO
            const io = getIO();
            if (io) {
                io.emit("newMessage", {
                    chatId: chat.chatId,
                    chatName: chat.name,
                    chat_id: chat._id,
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

            res.status(200).send("EVENT_RECEIVED");
        } else {
            res.sendStatus(404);
        }
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

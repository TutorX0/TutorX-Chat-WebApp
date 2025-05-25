const axios = require("axios");
const path = require("path");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const { getIO } = require("../socket");
const s3 = require("../utils/s3config");
const mime = require("mime-types");

const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;
const generateGuestName = async () => {
    const count = await Chat.countDocuments();
    return `Guest ${count + 1}`;
};

const getExtensionFromMime = (contentType) => {
    const ext = mime.extension(contentType);
    return ext ? `.${ext}` : ".bin";
};

const uploadMediaToS3 = async (mediaId, token) => {
    // Step 1: Get media URL from WhatsApp API
    const mediaInfoRes = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const mediaUrl = mediaInfoRes.data.url;

    // Step 2: Download media as buffer
    const mediaRes = await axios.get(mediaUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer"
    });

    const contentType = mediaRes.headers["content-type"];
    const fileExt = getExtensionFromMime(contentType);
    const fileName = `${Date.now()}-whatsapp-media${fileExt}`;

    // Step 3: Upload to S3
    const uploadRes = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/${fileName}`,
        Body: mediaRes.data,
        ContentType: contentType
        // ACL should NOT be set here if ACLs are blocked
    }).promise();

    return { s3Url: uploadRes.Location, fileName };
};

exports.receiveMessage = async (req, res) => {
    try {
        const body = req.body;

        if (
            body.object &&
            body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
        ) {
            const message = body.entry[0].changes[0].value.messages[0];
            const phoneNumber = message.from.startsWith("+") ? message.from.slice(1) : message.from;
            const type = message.type;

            let content = "";
            let mediaUrl = null;
            let fileName = null;
            const token = process.env.ACCESS_TOKEN;

            switch (type) {
                case "text":
                    content = message.text.body;
                    break;
                case "image":
                    content = message.image.caption || "";
                    ({ s3Url: mediaUrl, fileName } = await uploadMediaToS3(message.image.id, token));
                    break;
                case "document":
                    content = message.document.caption || "";
                    ({ s3Url: mediaUrl, fileName } = await uploadMediaToS3(message.document.id, token));
                    fileName = message.document.filename || fileName;
                    break;
                case "audio":
                    content = "Audio received";
                    ({ s3Url: mediaUrl, fileName } = await uploadMediaToS3(message.audio.id, token));
                    break;
                case "video":
                    content = message.video.caption || "";
                    ({ s3Url: mediaUrl, fileName } = await uploadMediaToS3(message.video.id, token));
                    break;
                case "sticker":
                    content = "Sticker received";
                    ({ s3Url: mediaUrl, fileName } = await uploadMediaToS3(message.sticker.id, token));
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
            io?.emit("newMessage", {
                chatId: chat.chatId,
                chatName: chat.name,
                chat_id: chat._id,
                messageId: newMessage._id,
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

            res.status(200).send("EVENT_RECEIVED");
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Webhook error:", error.message || error);
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

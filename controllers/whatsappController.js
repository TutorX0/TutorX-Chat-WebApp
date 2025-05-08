const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;
const generateGuestName = async () => {
    const count = await Chat.countDocuments();
    return `Guest ${count + 1}`;
};

// ✅ Webhook Verification
exports.verifyWebhook = (req, res) => {
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    } else {
        return res.sendStatus(403);
    }
};

// ✅ Webhook Receiver
exports.receiveMessage = async (req, res) => {
    try {
        const body = req.body;

        const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        if (!message) return res.status(404).send("No valid message");

        const phoneNumber = message.from;
        const type = message.type;
        let content = "";
        let mediaUrl = null;
        let fileName = null;

        switch (type) {
            case "text":
                content = message.text.body;
                break;
            case "image":
                content = message.caption || "";
                mediaUrl = message.link;
                console.log(content);
                console.log(mediaUrl);
                break;
            case "document":
                content = message.document?.caption || "Document received";
                mediaUrl = message.document?.link;
                fileName = message.document?.filename;
                break;
            case "audio":
                content = "Audio received";
                mediaUrl = message.audio?.link;
                break;
            case "video":
                content = message.video?.caption || "Video received";
                mediaUrl = message.video?.link;
                break;
            case "sticker":
                content = "Sticker received";
                mediaUrl = message.sticker?.link;
                break;
            case "location":
                content = `Location: lat=${message.location.latitude}, long=${message.location.longitude}`;
                break;
            case "button":
                content = `Button clicked: ${message.button.text}`;
                break;
            case "interactive":
                content = `Interactive response: ${message.interactive?.button_reply?.title || message.interactive?.list_reply?.title}`;
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

        console.log(newMessage);
        await newMessage.save();

        // Broadcast to socket.io
        req.io.emit("newMessage", {
            chatId: chat.chatId,
            phoneNumber,
            sender: "user",
            messageType: type,
            content,
            mediaUrl,
            fileName,
            timestamp: newMessage.createdAt
        });

        res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(500);
    }
};

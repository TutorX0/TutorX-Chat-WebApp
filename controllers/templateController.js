const axios = require("axios");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const { getIO } = require("../socket");
const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0";
const WABA_ID = process.env.WABA_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
// ✅ Fetch all templates from Meta
exports.getTemplates = async (req, res) => {
    try {
        const response = await axios.get(`${WHATSAPP_API_URL}/${WABA_ID}/message_templates`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });

        res.status(200).json({
            status: "success",
            templates: response.data.data
        });
    } catch (err) {
        console.error("❌ Error fetching templates:", err.response?.data || err.message);
        res.status(500).json({
            status: "error",
            error: err.response?.data || err.message
        });
    }
};

// ✅ Send template to multiple contacts
const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;

// Generate guest name dynamically
const generateGuestName = async () => {
    const count = await Chat.countDocuments();
    return `Guest ${count + 1}`;
};

exports.sendTemplate = async (req, res) => {
    const { templateName, language, contacts, parameters } = req.body;

    if (!templateName || !language || !contacts?.length) {
        return res.status(400).json({
            status: "error",
            message: "templateName, language, and contacts[] are required"
        });
    }

    try {
        const results = [];
        const savedMessages = [];

        for (let phoneNumber of contacts) {
            // 🔹 Normalize phone number (remove + if present)
            phoneNumber = phoneNumber.startsWith("+") ? phoneNumber.slice(1) : phoneNumber;

            // 🔹 Check if chat already exists
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

            // 🔹 Prepare WhatsApp payload
            const payload = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                    name: templateName,
                    language: { code: language },
                    components: parameters?.length ? [{ type: "body", parameters }] : []
                }
            };

            // 🔹 Send to WhatsApp
            const response = await axios.post(`${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`, payload, {
                headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
            });

            const waMsgId = response.data.messages?.[0]?.id;

            // 🔹 Save message in DB
            const newMessage = new Message({
                chatId: chat.chatId,
                phoneNumber,
                sender: "admin",
                messageType: "template",
                content: templateName, // storing template name
                mediaUrl: null,
                fileName: null,
                whatsappMessageId: waMsgId,
                status: "sent"
            });

            await newMessage.save();
            savedMessages.push(newMessage);

            // 🔹 Update last message in chat
            await Chat.findOneAndUpdate(
                { chatId: chat.chatId },
                {
                    $set: {
                        lastMessage: {
                            content: templateName,
                            messageType: "template",
                            timestamp: newMessage.createdAt
                        }
                    }
                }
            );

            // 🔹 Emit via socket
            const io = getIO();
            if (io) {
                console.log("emit_4");
                io.emit("newMessage", {
                    chatId: chat.chatId,
                    chatName: chat.name,
                    chat_id: chat._id,
                    messageId: newMessage._id,
                    phoneNumber,
                    sender: "admin",
                    messageType: newMessage.messageType,
                    content: newMessage.content,
                    mediaUrl: newMessage.mediaUrl,
                    fileName: newMessage.fileName,
                    timestamp: newMessage.createdAt,
                    status: newMessage.status
                });
            }

            results.push({
                to: phoneNumber,
                messageId: waMsgId
            });
        }

        res.status(200).json({
            status: "success",
            sent: results
        });
    } catch (err) {
        console.error("❌ Error sending template:", err.response?.data || err.message);
        res.status(500).json({
            status: "error",
            error: err.response?.data || err.message
        });
    }
};

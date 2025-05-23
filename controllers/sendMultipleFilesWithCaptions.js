const axios = require("axios");
const { join } = require("path");
const { unlinkSync } = require("fs");

const uploadImageToWhatsapp = require("../utils/uploadImageToWhatsapp");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const { getIO } = require("../socket");

// Generate chatId based on phone number
const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;

// Generate guest name dynamically
const generateGuestName = async () => {
    const count = await Chat.countDocuments(); // Count existing chats
    return `Guest ${count + 1}`;
};

exports.sendMultipleFilesWithCaptions = async (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const body = JSON.parse(JSON.stringify(req.body));

    const result = body.files.map((item, index) => {
        const file = req.files.find((f) => f.fieldname === `files[${index}][file]`);
        return { ...item, file };
    });

    const savedMessages = [];
    const responses = [];

    try {
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

        for (const field of result) {
            const mediaId = await uploadImageToWhatsapp(field.file.filename);

            const payload = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: field.type,
                [field.type]: { id: mediaId, caption: field.message ?? "" }
            };

            try {
                const response = await axios.post(
                    `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` }
                    }
                );

                responses.push(response.data);
            } catch {
                const filePath = join(__dirname, "..", "uploads", field.file.filename);
                unlinkSync(filePath);
                continue;
            }

            const newMessage = new Message({
                chatId: chat.chatId,
                phoneNumber,
                isForwarded: false,
                replyTo: req.body.replyTo ?? null,
                sender: "admin",
                messageType: field.type,
                content: field.message || "",
                mediaUrl: `${req.protocol}://${req.get("host")}/uploads/${field.file.filename}`,
                fileName: field.file.filename
            });

            await newMessage.save();
            savedMessages.push(newMessage);

            const io = getIO();
            io.emit("newMessage", {
                chatId: chat.chatId,
                chatName: chat.name,
                chat_id: chat._id,
                messageId: newMessage._id,
                phoneNumber,
                sender: "admin",
                messageType: newMessage.messageType,
                isForwarded: newMessage.isForwarded,
                replyTo: newMessage.replyTo ?? null,
                content: newMessage.content,
                mediaUrl: newMessage.mediaUrl,
                fileName: newMessage.fileName,
                timestamp: newMessage.createdAt
            });
        }

        res.status(200).json({
            status: "success",
            chatId: chat.chatId,
            responses
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.response?.data?.error?.message || error.message,
            details: error.response?.data || {}
        });
    }
};

const axios = require("axios");
const uploadImageToWhatsapp = require("../utils/uploadImageToWhatsapp");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const { getIO } = require("../socket");

const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;

const generateGuestName = async () => {
    const count = await Chat.countDocuments();
    return `Guest ${count + 1}`;
};

exports.sendMultipleFilesWithCaptions = async (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const body = JSON.parse(JSON.stringify(req.body));

    // Match each file object with the file in req.files
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
            if (!field.file) continue;

            const fileBuffer = field.file.buffer;
            const fileName = field.file.originalname;

            let mediaId, s3Url;
            try {
                const uploadResult = await uploadImageToWhatsapp(fileBuffer, fileName);
                mediaId = uploadResult.mediaId;
                s3Url = uploadResult.s3Url;
            } catch (err) {
                console.error("Media upload failed:", err.message);
                continue;
            }

            const payload = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: field.type,
                [field.type]: {
                    id: mediaId,
                    caption: field.message ?? ""
                }
            };

            try {
                const response = await axios.post(
                    `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                        }
                    }
                );

                responses.push(response.data);

                const newMessage = new Message({
                    chatId: chat.chatId,
                    phoneNumber,
                    isForwarded: false,
                    replyTo: req.body.replyTo ?? null,
                    sender: "admin",
                    messageType: field.type,
                    content: field.message || "",
                    mediaUrl: s3Url,
                    fileName: fileName
                });

                await newMessage.save();
                savedMessages.push(newMessage);

                console.log("Message saved:", newMessage);
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
            } catch (err) {
                console.error("Message send failed:", err.response?.data || err.message);
                continue;
            }
        }

        res.status(200).json({
            status: "success",
            chatId: chat.chatId,
            responses
        });
    } catch (error) {
        console.error("Fatal error:", error.message);
        res.status(500).json({
            status: "error",
            message: error.response?.data?.error?.message || error.message,
            details: error.response?.data || {}
        });
    }
};

const axios = require("axios");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const path = require("path");
const { getIO } = require("../socket");
const moment = require("moment"); // Make sure moment is installed
const uploadImageToWhatsapp = require("../utils/uploadImageToWhatsapp");
require("dotenv").config();

// Generate chatId based on phone number
const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;

// Generate guest name dynamically
const generateGuestName = async () => {
    const count = await Chat.countDocuments(); // Count existing chats
    return `Guest ${count + 1}`;
};

exports.sendMessage = async (req, res) => {
    const { message = "", type = "text" } = req.body;
    const phoneNumber = req.body.phoneNumber?.startsWith("+") ? req.body.phoneNumber.slice(1) : req.body.phoneNumber;
    let mediaUrls = [];

    try {
        if (!phoneNumber) {
            return res.status(400).json({ status: "error", message: "Phone number is required" });
        }

        // Handle multiple file uploads
        if (req.files && req.files.length > 0) {
            mediaUrls = req.files.map((file) => ({
                localUrl: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
                fileName: file.originalname,
                filename: file.filename
            }));
        }

        let responses = [];

        if (type === "template") {
            const payload = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                    name: "hello_world",
                    language: { code: "en_US" }
                }
            };

            const response = await axios.post(
                `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            responses.push(response.data);
        } else if (type === "text") {
            if (!message || typeof message !== "string") {
                return res.status(400).json({ status: "error", message: "Message is required" });
            }

            const payload = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "text",
                text: { body: message.trim() }
            };

            const response = await axios.post(
                `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            responses.push(response.data);
        } else {
            // Handle media messages (image, document, audio, video)
            if (!mediaUrls.length) {
                return res.status(400).json({ status: "error", message: "Media file(s) are required" });
            }

            for (let media of mediaUrls) {
                const mediaId = await uploadImageToWhatsapp(media.filename, true);
                let payload;

                if (type === "image") {
                    payload = {
                        messaging_product: "whatsapp",
                        to: phoneNumber,
                        type: "image",
                        image: { id: mediaId, caption: message || "" }
                    };
                } else if (type === "document") {
                    payload = {
                        messaging_product: "whatsapp",
                        to: phoneNumber,
                        type: "document",
                        document: { id: mediaId, caption: message || "" }
                    };
                } else if (type === "audio") {
                    payload = {
                        messaging_product: "whatsapp",
                        to: phoneNumber,
                        type: "audio",
                        audio: { id: mediaId }
                    };
                } else if (type === "video") {
                    payload = {
                        messaging_product: "whatsapp",
                        to: phoneNumber,
                        type: "video",
                        video: { id: mediaId, caption: message || "" }
                    };
                } else {
                    return res.status(400).json({ status: "error", message: "Unsupported media type" });
                }

                const response = await axios.post(
                    `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` }
                    }
                );

                responses.push(response.data);
            }
        }

        // Create Chat if not exists
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

        // Save message(s) in DB
        const savedMessages = [];

        if (type === "text" || type === "template") {
            const newMessage = new Message({
                chatId: chat.chatId,
                phoneNumber,
                isForwarded: req.body.isForwarded,
                replyTo: req.body.replyTo ?? null,
                sender: "admin",
                messageType: type,
                content: message || "",
                mediaUrl: null,
                fileName: null
            });

            await newMessage.save();
            savedMessages.push(newMessage);
        } else {
            for (let media of mediaUrls) {
                const newMessage = new Message({
                    chatId: chat.chatId,
                    phoneNumber,
                    isForwarded: req.body.isForwarded,
                    replyTo: req.body.replyTo ?? null,
                    sender: "admin",
                    messageType: type,
                    content: message || "",
                    mediaUrl: media.localUrl,
                    fileName: media.fileName
                });

                await newMessage.save();
                savedMessages.push(newMessage);
            }
        }

        // Emit each message to socket
        const io = getIO();
        if (io) {
            for (let newMessage of savedMessages) {
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
        }

        res.status(200).json({
            status: "success",
            chatId: chat.chatId,
            responses
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({
            status: "error",
            message: error.response?.data?.error?.message || error.message,
            details: error.response?.data || {}
        });
    }
};

exports.forwardMessage = async (req, res) => {
    const { phoneNumbers, messages } = req.body;

    for (const phoneNumber of phoneNumbers) {
        for (const message of messages) {
            let payload;
            const { type } = message;

            if (type === "template") {
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "template",
                    template: {
                        name: "hello_world",
                        language: { code: "en_US" }
                    }
                };
            } else if (type === "text") {
                if (!message.content || typeof message.content !== "string") {
                    return res.status(400).json({ status: "error", message: "Message is required" });
                }
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "text",
                    text: { body: message.content.trim() }
                };
            } else if (type === "image") {
                if (!message.mediaUrl) return res.status(400).json({ status: "error", message: "Image URL is required" });

                const mediaId = await uploadImageToWhatsapp(message.mediaUrl, true);
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "image",
                    image: { id: mediaId, caption: message.content || "" }
                };
            } else if (type === "document") {
                if (!message.mediaUrl) return res.status(400).json({ status: "error", message: "Document URL is required" });

                const mediaId = await uploadImageToWhatsapp(message.mediaUrl, true);
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "document",
                    document: { id: mediaId, caption: message.content || "" }
                };
            } else if (type === "audio") {
                if (!message.mediaUrl) return res.status(400).json({ status: "error", message: "Audio URL is required" });

                const mediaId = await uploadImageToWhatsapp(message.mediaUrl, true);
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "audio",
                    audio: { id: mediaId }
                };
            } else if (type === "video") {
                if (!message.mediaUrl) return res.status(400).json({ status: "error", message: "Video URL is required" });

                const mediaId = await uploadImageToWhatsapp(message.mediaUrl, true);
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "video",
                    video: { id: mediaId, caption: message.content || "" }
                };
            } else {
                return res.status(400).json({ status: "error", message: "Unsupported message type" });
            }

            try {
                // Send WhatsApp message
                await axios.post(`https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`, payload, {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                });

                // Create Chat if not exist
                let chat = await Chat.findOne({ phoneNumber });
                if (!chat) return res.status(404).json({ status: "error", message: "Chat not found" });

                // Save message in DB
                const newMessage = new Message({
                    chatId: chat.chatId,
                    phoneNumber,
                    isForwarded: true,
                    replyTo: null,
                    sender: "admin",
                    messageType: type,
                    content: message.content || "",
                    mediaUrl: message.mediaUrl || null,
                    fileName: null
                });

                await newMessage.save();

                const io = getIO();
                if (io) {
                    io.emit("newMessage", {
                        chatId: chat.chatId,
                        chatName: chat.name,
                        chat_id: chat._id,
                        messageId: newMessage._id,
                        phoneNumber,
                        sender: "admin",
                        messageType: type,
                        isForwarded: newMessage.isForwarded,
                        replyTo: newMessage.replyTo,
                        content: message.content || "",
                        mediaUrl: message.mediaUrl || null,
                        fileName: newMessage.fileName,
                        timestamp: newMessage.createdAt
                    });
                } else {
                    console.log("Socket.IO not initialized");
                }
            } catch (error) {
                // console.error("Error sending message:", error);
                return res.status(500).json({
                    status: "error",
                    message: error.response?.data?.error?.message || error.message,
                    details: error.response?.data || {}
                });
            }
        }
    }

    res.status(200).json({ status: "success", message: "Messages forwarded successfully" });
};

exports.createChat = async (req, res) => {
    try {
        const { name } = req.body;
        const phoneNumber = req.body.phoneNumber.startsWith("+") ? req.body.phoneNumber.slice(1) : req.body.phoneNumber;

        if (!name || !phoneNumber) {
            return res.status(400).json({ status: "error", message: "name and phoneNumber are required" });
        }

        const chatId = generateChatId(phoneNumber);

        // Check if chat already exists
        const existingChat = await Chat.findOne({ chatId });
        if (existingChat) {
            return res.status(400).json({ status: "error", message: "Chat with this phone number already exists" });
        }

        const newChat = new Chat({
            chatId,
            name,
            phoneNumber
        });

        await newChat.save();

        res.status(201).json({
            status: "success",
            message: "Chat created successfully",
            chat: newChat
        });
    } catch (err) {
        console.error("Error creating chat:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.updateGuestName = async (req, res) => {
    const { phoneNumber, newName } = req.body;

    try {
        if (!phoneNumber || !newName) {
            return res.status(400).json({
                status: "error",
                message: "Phone number and new name are required"
            });
        }

        const chat = await Chat.findOne({ phoneNumber });

        if (!chat) {
            return res.status(404).json({
                status: "error",
                message: "Chat not found for this phone number"
            });
        }

        chat.name = newName;
        await chat.save();

        res.status(200).json({
            status: "success",
            message: `Guest name updated successfully to ${newName}`,
            chat
        });
    } catch (error) {
        console.error("Error updating guest name:", error);
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// exports.getChatHistory = async (req, res) => {
//   try {
//     const { phoneNumber } = req.params;

//     if (!phoneNumber) return res.status(400).json({ message: "Phone number required" });

//     const chat = await Chat.findOne({ phoneNumber });

//     if (!chat) return res.status(404).json({ message: "No chat history found" });

//     res.status(200).json({ status: "success", chat });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

exports.getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findOne({ chatId });
        if (!chat) {
            return res.status(404).json({ status: "error", message: "Chat not found" });
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 }); // Oldest first

        const groupedMessages = {};

        messages.forEach((msg) => {
            const dateLabel = getDateLabel(msg.createdAt);
            if (!groupedMessages[dateLabel]) {
                groupedMessages[dateLabel] = [];
            }

            groupedMessages[dateLabel].push({
                _id: msg._id,
                sender: msg.sender,
                content: msg.content,
                type: msg.messageType,
                mediaUrl: msg.mediaUrl || null,
                fileName: msg.fileName || null,
                createdAt: msg.createdAt,
                isForwarded: msg.isForwarded,
                replyTo: msg.replyTo ?? null
            });
        });

        res.status(200).json({
            status: "success",
            chat: {
                chatId: chat.chatId,
                name: chat.name,
                phoneNumber: chat.phoneNumber,
                groupedMessages
            }
        });
    } catch (err) {
        console.error("Error fetching chat history:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
};

// Helper to format dates like WhatsApp
function getDateLabel(date) {
    const now = moment();
    const input = moment(date);

    if (input.isSame(now, "day")) {
        return "Today";
    } else if (input.isSame(now.clone().subtract(1, "day"), "day")) {
        return "Yesterday";
    } else if (input.isAfter(now.clone().subtract(7, "days"))) {
        return input.format("dddd"); // e.g., Tuesday
    } else {
        return input.format("DD MMM YYYY"); // e.g., 18 Apr 2025
    }
}

exports.getAllChats = async (req, res) => {
    try {
        // Fetch all chats
        const chats = await Chat.find();

        // Enrich each chat with the last message details
        const enrichedChats = await Promise.all(
            chats.map(async (chat) => {
                const lastMessage = await Message.findOne({ chatId: chat.chatId })
                    .sort({ createdAt: -1 })
                    .select("content type createdAt")
                    .lean();

                return {
                    _id: chat._id,
                    chatId: chat.chatId,
                    phoneNumber: chat.phoneNumber,
                    name: chat.name,
                    lastMessage: lastMessage?.content || "",
                    lastMessageType: lastMessage?.type || "",
                    lastMessageTime: lastMessage?.createdAt || chat.updatedAt
                };
            })
        );

        // Sort chats by last message time (descending)
        enrichedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        // Return all enriched chats
        res.status(200).json({
            status: "success",
            totalChats: enrichedChats.length,
            chats: enrichedChats
        });
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.getFilesByChatId = async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
        return res.status(400).json({ status: "error", message: "Chat ID is required" });
    }

    try {
        // Fetch all media messages for the chatId
        const mediaMessages = await Message.find({
            chatId,
            messageType: { $in: ["document", "image", "audio", "video"] }
        }).sort({ createdAt: -1 }); // latest first

        const formatted = mediaMessages.map((msg) => ({
            fileName: msg.fileName,
            messageType: msg.messageType,
            isForwarded: msg.isForwarded,
            replyTo: msg.replyTo ?? null,
            mediaUrl: msg.mediaUrl,
            caption: msg.content,
            createdAt: msg.createdAt
        }));

        res.status(200).json({
            status: "success",
            chatId,
            totalFiles: formatted.length,
            files: formatted
        });
    } catch (error) {
        console.error("Error fetching files by chatId:", error);
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

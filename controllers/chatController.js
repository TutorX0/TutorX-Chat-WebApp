const axios = require("axios");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const path = require("path");

const moment = require("moment"); // Make sure moment is installed
require("dotenv").config();

// Generate chatId based on phone number
const generateChatId = (phoneNumber) => `chat_${phoneNumber}`;

// Generate guest name dynamically
const generateGuestName = async () => {
    const count = await Chat.countDocuments(); // Count existing chats
    return `Guest ${count + 1}`;
};

exports.sendMessage = async (req, res) => {
  const { phoneNumber, message = "", type = "text" } = req.body;
  let mediaUrl = req.body.mediaUrl || null;

  try {
    if (!phoneNumber) {
      return res.status(400).json({ status: "error", message: "Phone number is required" });
    }
    
    // If a file is uploaded (handled by multer)
    if (req.file) {
      mediaUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    let payload;

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
      if (!message || typeof message !== "string") {
        return res.status(400).json({ status: "error", message: "Message is required" });
      }
      payload = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: { body: message.trim() }
      };
    } else if (type === "image") {
      if (!mediaUrl) return res.status(400).json({ status: "error", message: "Image URL is required" });
      payload = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "image",
        image: { link: mediaUrl, caption: message || "" }
      };
    } else if (type === "document") {
      if (!mediaUrl) return res.status(400).json({ status: "error", message: "Document URL is required" });
      payload = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "document",
        document: { link: mediaUrl, caption: message || "" }
      };
    } else if (type === "audio") {
      if (!mediaUrl) return res.status(400).json({ status: "error", message: "Audio URL is required" });
      payload = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "audio",
        audio: { link: mediaUrl }
      };
    } else if (type === "video") {
      if (!mediaUrl) return res.status(400).json({ status: "error", message: "Video URL is required" });
      payload = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "video",
        video: { link: mediaUrl, caption: message || "" }
      };
    } else {
      return res.status(400).json({ status: "error", message: "Unsupported message type" });
    }

    // Send WhatsApp message
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

    // Create Chat if not exist
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

    // Save message in DB
    const newMessage = new Message({
      chatId: chat.chatId,
      phoneNumber,
      sender: "admin",
      messageType: type,
      content: message || "",
      mediaUrl: mediaUrl || null,
      fileName: req.file?.originalname || null
    });

    await newMessage.save();

    res.status(200).json({
      status: "success",
      chatId: chat.chatId,
      data: response.data
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

exports.createChat = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

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

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 }); // Oldest first

    // Group messages by day using moment
    const groupedMessages = {};

    messages.forEach(msg => {
      const dateLabel = getDateLabel(msg.createdAt);
      if (!groupedMessages[dateLabel]) {
        groupedMessages[dateLabel] = [];
      }
      groupedMessages[dateLabel].push({
        _id: msg._id,
        sender: msg.sender,
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt,
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

// Helper to format dates like WhatsApp: Today, Yesterday, or Weekday
function getDateLabel(date) {
  const now = moment();
  const input = moment(date);

  if (input.isSame(now, 'day')) {
    return "Today";
  } else if (input.isSame(now.clone().subtract(1, 'day'), 'day')) {
    return "Yesterday";
  } else if (input.isAfter(now.clone().subtract(7, 'days'))) {
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
          chatId: chat.chatId,
          phoneNumber: chat.phoneNumber,
          name: chat.name,
          lastMessage: lastMessage?.content || "",
          lastMessageType: lastMessage?.type || "",
          lastMessageTime: lastMessage?.createdAt || chat.updatedAt,
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

const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

exports.sendMultipleFilesWithCaptions = async (req, res) => {
    const phoneNumber = req.body.phoneNumber?.startsWith("+") ? req.body.phoneNumber.slice(1) : req.body.phoneNumber;
    const fileCaptions = JSON.parse(req.body.fileCaptions || "[]"); // Parse caption array from stringified JSON

    try {
        if (!phoneNumber) {
            return res.status(400).json({ status: "error", message: "Phone number is required" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: "error", message: "Files are required" });
        }

        const io = getIO();
        const savedMessages = [];
        const responses = [];

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

        // Process each uploaded file
        for (let file of req.files) {
            const captionEntry = fileCaptions.find((item) => item.filename === file.originalname);
            const caption = captionEntry?.caption || "";

            const localUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
            const fileExtension = path.extname(file.originalname).toLowerCase();

            // Upload to WhatsApp
            const mediaId = await uploadImageToWhatsapp(file.filename, true); // Handles all file types
            let messageType;
            let payload;

            if ([".jpg", ".jpeg", ".png", ".webp"].includes(fileExtension)) {
                messageType = "image";
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "image",
                    image: { id: mediaId, caption }
                };
            } else if ([".mp4", ".mov"].includes(fileExtension)) {
                messageType = "video";
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "video",
                    video: { id: mediaId, caption }
                };
            } else if ([".mp3", ".ogg", ".wav"].includes(fileExtension)) {
                messageType = "audio";
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "audio",
                    audio: { id: mediaId }
                };
            } else {
                messageType = "document";
                payload = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "document",
                    document: { id: mediaId, caption }
                };
            }

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

            // Save message to DB
            const newMessage = new Message({
                chatId: chat.chatId,
                phoneNumber,
                sender: "admin",
                messageType,
                content: caption,
                mediaUrl: localUrl,
                fileName: file.originalname
            });
            await newMessage.save();
            savedMessages.push(newMessage);

            // Emit via socket
            if (io) {
                io.emit("newMessage", {
                    chatId: chat.chatId,
                    chatName: chat.name,
                    chat_id: chat._id,
                    messageId: newMessage._id,
                    phoneNumber,
                    sender: "admin",
                    messageType,
                    isForwarded: false,
                    replyTo: null,
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
            messageCount: savedMessages.length,
            responses
        });
    } catch (error) {
        console.error("Error sending multiple files:", error);
        res.status(500).json({
            status: "error",
            message: error.response?.data?.error?.message || error.message,
            details: error.response?.data || {}
        });
    }
};

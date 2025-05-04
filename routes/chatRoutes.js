const express = require("express");
const { sendMessage, updateGuestName, getAllChats, getChatHistory, createChat, getFilesByChatId } = require("../controllers/chatController");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/send",upload.single("mediaUrl"),  sendMessage);
router.post("/create", createChat);
router.put("/update", updateGuestName);
router.get("/all-chats", getAllChats);
router.get("/history/:chatId", getChatHistory); // <-- Add this
router.get("/files/:chatId", getFilesByChatId);

module.exports = router;

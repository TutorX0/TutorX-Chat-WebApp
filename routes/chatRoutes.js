const express = require("express");
const { sendMessage, updateGuestName, getAllChats, getChatHistory, createChat } = require("../controllers/chatController");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/send",upload.single("message"),  sendMessage);
router.get("/create", createChat);
router.put("/update", updateGuestName);
router.get("/all-chats", getAllChats);
router.get("/history/:chatId", getChatHistory); // <-- Add this

module.exports = router;
const express = require("express");
const {
    sendMessage,
    updateGuestName,
    getAllChats,
    getChatHistory,
    createChat,
    getFilesByChatId,
    forwardMessage
} = require("../controllers/chatController");
const upload = require("../middleware/upload");
const express = require("express");
router.post("/send", upload.array("mediaUrl", 10), sendMessage); // up to 10 files
router.post("/forward", forwardMessage);
router.post("/create", createChat);
router.put("/update", updateGuestName);
router.get("/all-chats", getAllChats);
router.get("/history/:chatId", getChatHistory); // <-- Add this
router.get("/files/:chatId", getFilesByChatId);

module.exports = router;

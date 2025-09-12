const express = require("express");
const {
    sendMessage,
    updateGuestName,
    getAllChats,
    getChatHistory,
    createChat,
    getFilesByChatId,
    forwardMessage,
    incrementUnreadCount,
    resetUnreadCount
} = require("../controllers/chatController");
const { sendMultipleFilesWithCaptions } = require("../controllers/sendMultipleFilesWithCaptions");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/send", sendMessage); // up to 10 files
router.post("/send-multiple-files/:phoneNumber", upload.any(), sendMultipleFilesWithCaptions);
router.post("/forward", forwardMessage);
router.post("/create", createChat);
router.put("/update", updateGuestName);
router.get("/all-chats", getAllChats);
router.get("/history/:chatId", getChatHistory);
router.get("/files/:chatId", getFilesByChatId);
router.patch("/:chatId/increment-unread", incrementUnreadCount);
router.patch("/:chatId/reset-unread", resetUnreadCount);
module.exports = router;

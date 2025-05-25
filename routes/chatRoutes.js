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
const { sendMultipleFilesWithCaptions } = require("../controllers/sendMultipleFilesWithCaptions");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/send", sendMessage); // up to 10 files
router.post(
  "/send/:phoneNumber",
  upload.any(), // since you're accepting dynamic file fields
  sendMultipleFilesWithCaptions
);
router.post("/forward", forwardMessage);
router.post("/create", createChat);
router.put("/update", updateGuestName);
router.get("/all-chats", getAllChats);
router.get("/history/:chatId", getChatHistory); // <-- Add this
router.get("/files/:chatId", getFilesByChatId);

module.exports = router;

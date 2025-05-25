const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsappController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Meta verification
router.get("/",  whatsappController.verifyWebhook);

// Message receiving
router.post("/",upload.any(), whatsappController.receiveMessage);

module.exports = router;

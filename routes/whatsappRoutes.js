const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsappController");
const upload = require("../middleware/upload");

// Meta verification
router.get("/", upload.single("mediaUrl"), whatsappController.verifyWebhook);

// Message receiving
router.post("/", whatsappController.receiveMessage);

module.exports = router;

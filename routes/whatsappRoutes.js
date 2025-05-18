const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsappController");
const upload = require("../middleware/upload");

// Meta verification
router.get("/",  whatsappController.verifyWebhook);

// Message receiving
router.post("/",upload.array("mediaUrl",10), whatsappController.receiveMessage);

module.exports = router;

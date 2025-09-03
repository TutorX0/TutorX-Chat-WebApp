const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");

// ✅ Fetch all templates
router.get("/templates", templateController.getTemplates);

// ✅ Send template to multiple contacts
router.post("/send-template", templateController.sendTemplate);

module.exports = router;

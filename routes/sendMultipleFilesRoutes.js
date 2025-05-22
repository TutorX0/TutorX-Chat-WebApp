const express = require("express");
const router = express.Router();
const {sendMultipleFilesWithCaptions} = require("../controllers/sendMultipleFilesWithCaptions");
const upload = require("../middleware/upload");

router.post("/chat/send-multiple-files", upload.array("files"), sendMultipleFilesWithCaptions);

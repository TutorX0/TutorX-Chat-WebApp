const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post("/addMessagesToGroup", groupController.addUsersToGroup);
router.post("/delete", groupController.removeUserFromGroup);
router.post("/add-user",groupController.addUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post("/addUsersToGroup", groupController.addUsersToGroup);
router.put("/remove-group/:groupName", groupController.removeGroup);
router.put("/remove-users", groupController.removeUserFromGroup);
router.patch("/add-user", groupController.addUser);
router.get("/groups", groupController.getAllGroups);
router.put("/group-name", groupController.updateGroupName);
router.put("/update-description", groupController.updateGroupDescription);

module.exports = router;

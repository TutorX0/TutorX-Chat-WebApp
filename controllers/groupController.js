const Group = require("../models/groupModel");
const Message = require("../models/chatModel");

exports.addUsersToGroup = async (req, res) => {
  const { groupName, description, messageIds } = req.body;

  if (!groupName || !Array.isArray(messageIds)) {
    return res.status(400).json({ message: "groupName and messageIds are required" });
  }

  try {
    // Validate message IDs exist
    const validMessages = await Message.find({ chatId: { $in: messageIds } });
    if (validMessages.length !== messageIds.length) {
      return res.status(404).json({ message: "Some message IDs are invalid" });
    }

    console.log(validMessages);
    // Check if group exists
    let group = await Group.findOne({ groupName });

    if (group) {
      // Add new messages to existing group
      group = await Group.findOneAndUpdate(
        { groupName, description },
        { $addToSet: { messageIds: { $each: messageIds } } },
        { new: true }
      );
    } else {
      // Create a new group
      group = await Group.create({ groupName, description, messageIds });
    }

    res.status(200).json({ message: "Group updated successfully", group });
  } catch (error) {
    console.error("Error adding messages to group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeUserFromGroup = async (req, res) => {
    const { groupName, messageId } = req.body;
  
    if (!groupName || !messageId) {
      return res.status(400).json({ message: "groupName and messageId are required" });
    }
  
    try {
      // Check if group exists
      const group = await Group.findOne({ groupName });
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      // Remove the messageId from the group's messageIds
      const updatedGroup = await Group.findOneAndUpdate(
        { groupName },
        { $pull: { messageIds: messageId } },
        { new: true }
      );
  
      res.status(200).json({ message: "Message removed from group", group: updatedGroup });
    } catch (error) {
      console.error("Error removing message from group:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.addUser = async (req, res) => {
    const { groupName, messageIds } = req.body;
  
    if (!groupName || !Array.isArray(messageIds)) {
      return res.status(400).json({ message: "groupName and messageIds are required" });
    }
  
    try {
      // Validate message IDs
      const validMessages = await Message.find({ chatId: { $in: messageIds } });
      const validChatIds = validMessages.map(msg => msg.chatId);
  
      if (validChatIds.length !== messageIds.length) {
        return res.status(404).json({ message: "Some message IDs are invalid" });
      }
  
      let group = await Group.findOne({ groupName });
  
      if (group) {
        group = await Group.findOneAndUpdate(
          { groupName },
          { $addToSet: { messageIds: { $each: validChatIds } } },
          { new: true }
        );
      } else {
        group = await Group.create({ groupName, messageIds: validChatIds });
      }
  
      res.status(200).json({ message: "Group updated successfully", group });
    } catch (error) {
      console.error("Error adding messages to group:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  exports.getAllGroups = async (req, res) => {
    try {
      const groups = await Group.find(); // optional: populate message data
      res.status(200).json({ status: "success", groups });
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };

  exports.updateGroupName = async (req, res) => {
    const { oldGroupName, newGroupName } = req.body;
  
    if (!oldGroupName || !newGroupName) {
      return res.status(400).json({ message: "Both oldGroupName and newGroupName are required" });
    }
  
    try {
      const updatedGroup = await Group.findOneAndUpdate(
        { groupName: oldGroupName },
        { groupName: newGroupName },
        { new: true }
      );
  
      if (!updatedGroup) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      res.status(200).json({ message: "Group name updated successfully", group: updatedGroup });
    } catch (error) {
      console.error("Error updating group name:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  exports.updateGroupDescription = async (req, res) => {
    const { groupName, newDescription } = req.body;
  
    if (!groupName || !newDescription) {
      return res.status(400).json({ message: "groupName and newDescription are required" });
    }
  
    try {
      const group = await Group.findOneAndUpdate(
        { groupName },
        { description: newDescription },
        { new: true }
      );
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      res.status(200).json({ message: "Group description updated successfully", group });
    } catch (error) {
      console.error("Error updating group description:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
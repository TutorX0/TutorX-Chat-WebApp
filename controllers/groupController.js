const Group = require("../models/groupModel");
const Message = require("../models/chatModel");

exports.addUsersToGroup = async (req, res) => {
  const { groupName, messageIds } = req.body;

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
        { groupName },
        { $addToSet: { messageIds: { $each: messageIds } } },
        { new: true }
      );
    } else {
      // Create a new group
      group = await Group.create({ groupName, messageIds });
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
  
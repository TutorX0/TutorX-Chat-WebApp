const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    messageIds: [{ type: String, ref: "ChatId" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);

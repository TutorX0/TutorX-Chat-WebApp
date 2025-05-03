const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    description : {type : String, default : ""},
    messageIds: [{ type: String, ref: "ChatId" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);

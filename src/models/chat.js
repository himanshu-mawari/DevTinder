const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    roomId: {
      type:String,
      unique: true,
      required: true
    },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

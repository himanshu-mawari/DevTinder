const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      required: true,
    },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
      type: String,
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
    lastReadBy: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

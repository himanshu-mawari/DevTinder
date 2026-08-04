const express = require("express");
const userAuth = require("../middlewares/auth");
const Chat = require("../models/chat");
const createError = require("../helpers/createError");
const mongoose = require("mongoose");
const Message = require("../models/message");

const chatRouter = express.Router();

chatRouter.get("/", userAuth, async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;

    const chats = await Chat.find({ participants: loggedInUserId })
      .populate("participants", "firstName lastName")
      .sort({ lastMessageAt: -1 });

    res.json({
      message: "Successfully fetch chats",
      chats,
    });
  } catch (err) {
    next(err);
  }
});

chatRouter.get("/:chatId/messages", userAuth, async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(createError(404, "Chat not found"));
    }
    const isLoggedInUserParticipate =
      chat.participants.includes(loggedInUserId);
    if (!isLoggedInUserParticipate) {
      return next(createError(403, "You are not a participant in this chat"));
    }

    const messages = await Message.find({ chatId: chat._id }).populate(
      "senderId",
      "firstName lastName",
    );

    res.json({
      message: "Successfully fetched all messages",
      messages,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = chatRouter;

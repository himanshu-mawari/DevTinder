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

    const chats = await Chat.find({ participants: loggedInUserId }).populate(
      "participants",
      "firstName lastName profilePicture lastMessage lastMessageAt",
    );

    const chatWithUnreadStatus = chats.map((chat) => {
      const isUnread =
        new Date(chat.lastMessageAt) >
        new Date(chat.lastReadBy[loggedInUserId] || 0);
      return {
        ...chat.toObject(),
        isUnread,
      };
    });

    res.json({
      message: "Successfully fetch chats",
      chatList: chatWithUnreadStatus,
    });
  } catch (err) {
    next(err);
  }
});

chatRouter.get("/:chatId/messages", userAuth, async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const { chatId } = req.params;
    let { limit, before } = req.query;
    limit = Number(limit);

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(createError(404, "Chat not found"));
    }
    const isLoggedInUserParticipate =
      chat.participants.includes(loggedInUserId);
    if (!isLoggedInUserParticipate) {
      return next(createError(403, "You are not a participant in this chat"));
    }

    const query = { chatId: chat._id };

    if (before) {
      query._id = { $lt: before };
    }

    let messages = await Message.find(query)
      .populate("senderId", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = messages.length > limit;
    const messageResults = (
      hasMore ? messages.slice(0, limit) : messages
    ).reverse();

    res.json({
      message: "Successfully fetched all messages",
      messages: messageResults,
      hasMore,
    });
  } catch (err) {
    next(err);
  }
});

chatRouter.patch("/:chatId/read", userAuth, async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const loggedInUserId = req.user._id.toString();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(createError(404, "Chat not found"));
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === loggedInUserId,
    );
    if (!isParticipant) {
      return next(createError(403, "Not a participant of this chat"));
    }

    await Chat.findByIdAndUpdate(chatId, {
      $set: { [`lastReadBy.${loggedInUserId}`]: new Date() },
    });

    res.json({ message: "Chat marked as read" });
  } catch (err) {
    next(err);
  }
});

module.exports = chatRouter;

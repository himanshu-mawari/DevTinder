const express = require("express");
const userAuth = require("../middlewares/auth");
const Chat = require("../models/chat");
const createError = require("../helpers/createError");

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

module.exports = chatRouter;

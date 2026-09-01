const { Server } = require("socket.io");
const verifyJwt = require("./verifyJwt");
const createError = require("./createError");
const ConnectionRequest = require("../models/connectionRequest");
const Message = require("../models/message");
const Chat = require("../models/chat");
const { getSecretRoomId } = require("../helpers/getSecretRoomId");
const { parseCookie } = require("cookie");
const mongoose = require("mongoose");
require("dotenv").config();

const initializeServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = parseCookie(socket.handshake.headers.cookie || "");
      const token = cookies.token;

      const decodedToken = verifyJwt(token, process.env.JWT_SECRET);
      if (!decodedToken) return next(createError(401, "invalid token"));
      const { _id: userId } = decodedToken;

      socket.userId = userId;
      next();
    } catch (err) {
      next(createError(401, "Auth failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    socket.join(`user:${userId}`);

    socket.on("joinChat", async ({ targetUserId }) => {
      if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
        return socket.emit("joinChatError", { message: "Invalid target user" });
      }

      const roomId = getSecretRoomId(userId, targetUserId);

      const connection = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: userId,
            toUserId: targetUserId,
            status: "accepted",
          },
          {
            fromUserId: targetUserId,
            toUserId: userId,
            status: "accepted",
          },
        ],
      });

      if (!connection) {
        socket.emit("joinChatError", {
          message: "You are not connected with this user",
        });
        return;
      }

      const chat = await Chat.findOneAndUpdate(
        { roomId },
        { $setOnInsert: { roomId, participants: [userId, targetUserId] } },
        { upsert: true, new: true },
      );

      socket.join(roomId);

      socket.emit("chatJoined", { chatId: chat._id });
    });

    socket.on("sendMessage", async ({ targetUserId, text }) => {
      const roomId = getSecretRoomId(socket.userId, targetUserId);
      if (!text || !text.trim()) {
        return socket.emit("sendMessageError", {
          message: "Message cannot be empty",
        });
      }
      if (!socket.rooms.has(roomId)) {
        socket.emit("sendMessageError", { message: "Join the chat first" });
        return;
      }

      const chat = await Chat.findOne({ roomId });
      if (!chat) {
        socket.emit("sendMessageError", { message: "Chat not found" });
        return;
      }

      const chatId = chat._id;

      let message = await Message.create({
        text,
        senderId: userId,
        chatId,
      });

      await Chat.findByIdAndUpdate(chatId, {
        $set: {
          lastMessage: text,
          lastMessageAt: message.createdAt,
          [`lastReadBy.${userId}`]: message.createdAt,
        },
      });

      const payload = {
        _id: message._id,
        senderId: message.senderId,
        text: message.text,
        createdAt: message.createdAt,
      };

      io.to(roomId).emit("messageReceived", payload);

      const chatPayload = {
        chatId: chat._id,
        lastMessage: text,
        lastMessageAt: message.createdAt,
        senderId: userId,
        isUnread: true,
      };

      io.to(`user:${targetUserId}`).emit("newChatMessage", chatPayload);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.userId} disconnected from the websocket server!!`);
    });
  });
  return io;
};

module.exports = initializeServer;

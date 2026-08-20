const { Server } = require("socket.io");
const verifyJwt = require("./verifyJwt");
const createError = require("./createError");
const ConnectionRequest = require("../models/connectionRequest");
const Message = require("../models/message");
const Chat = require("../models/chat");
const { getSecretRoomId } = require("../helpers/getSecretRoomId");
const { parseCookie } = require("cookie");
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
      next(new Error("Auth failed"));
    }
  });
  
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`${socket.userId} connected from the websocket server!!`);

    socket.on("joinChat", async ({ targetUserId }) => {
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
      console.log(chatId);

      let message = await Message.create({
        text,
        senderId: userId,
        chatId,
      });

      message = await message.populate("senderId", "firstName lastName");

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: text,
        lastMessageAt: Date.now(),
      });

      io.to(roomId).emit("messageReceived", message);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.userId} disconnected from the websocket server!!`);
    });
  });
};

module.exports = initializeServer;

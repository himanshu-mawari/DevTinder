const { Server } = require("socket.io");
const verifyJwt = require("./verifyJwt");
const createError = require("./createError");
const crypto = require("crypto");
const ConnectionRequest = require("../models/connectionRequest");
const Message = require("../models/message");
const Chat = require("../models/chat");
require("dotenv").config();

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeServer = (httpServer) => {
  const io = new Server(httpServer);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    const decodedToken = verifyJwt(token, process.env.JWT_SECRET);
    if (!decodedToken) return next(createError(401, "invalid token"));
    const { _id: userId } = decodedToken;

    socket.userId = userId;
    next();
  });

  //websocket server
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log("new user is connected");

    console.log(`${socket.userId} is joined`);

    // join a room when both has connection status accepted
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

      console.log(`${roomId} new user connected`);

      // Atomic upsert: if a Chat matching the filter exists, return it unchanged.
      // If not, create one — $setOnInsert only applies its fields on creation,
      // never on an existing match, so participants won't get rewritten on every join.
      // new: true returns the post-operation document either way.
      // Use atomic upsert to avoid separate find + create operations.
      // roomId's unique index guarantees only one chat per user pair.
      const chat = await Chat.findOneAndUpdate(
        { roomId },
        { $setOnInsert: { roomId, participants: [userId, targetUserId] } },
        { upsert: true, new: true },
      );

      socket.join(roomId);
      
      socket.emit("chatJoined" , {chatId : chat._id})

    });

    // send message
    socket.on("sendMessage", async ({ targetUserId, text }) => {
      const roomId = getSecretRoomId(socket.userId, targetUserId);

      if (!socket.rooms.has(roomId)) {
        socket.emit("sendMessageError", { message: "Join the chat first" });
        return;
      }

      // Todo : persistent message

      /**message :
       * {text , chatId , senderId}
       */

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

      message = await message.populate("senderId" , "firstName lastName") 

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: text,
        lastMessageAt: Date.now(),
      });

      // emit is a method which provide a way to send a named event with a data payload
      io.to(roomId).emit("messageReceived", message);
    });

    //client is disconnect
    socket.on("disconnect", () => {
      console.log(`${socket.userId} disconnected from the websocket server!!`);
    });
  });
};

module.exports = initializeServer;

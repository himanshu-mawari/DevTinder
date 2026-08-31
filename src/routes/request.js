const express = require("express");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const createError = require("../helpers/createError");
const Chat = require("../models/chat");
const { getSecretRoomId } = require("../helpers/getSecretRoomId");
const USER_SAFE_DATA =
  "profilePicture  firstName lastName bio  gender skills tags username githubUsername portfolioUrl location title";

requestRouter.post(
  "/send/:status/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const { status, userId } = req.params;
      const loggedinUserId = req.user._id;
      const io = req.app.get("io");

      const allowedStatus = ["ignored", "interested"];
      const isValidStatus = allowedStatus.includes(status);
      if (!isValidStatus) {
        return next(createError(400, "Invalid status value"));
      }

      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return next(createError(404, "User not found"));
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: loggedinUserId, toUserId: userId },
          { fromUserId: userId, toUserId: loggedinUserId },
        ],
      });
      if (existingRequest) {
        return next(createError(409, "Connection request already exist"));
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: loggedinUserId,
        toUserId: userId,
        status: status,
      });

      await connectionRequest.save();

      const newRequest = await connectionRequest.populate(
        "fromUserId",
        USER_SAFE_DATA,
      );

      io.to(`user:${userId}`).emit("connectionRequestReceived", newRequest);
      res.json({
        message: "Connection request sent successfully",
        data: connectionRequest,
      });
    } catch (err) {
      next(err);
    }
  },
);

requestRouter.patch(
  "/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      // todo : create chat docs , if status is accepted send

      const { status, requestId } = req.params;
      const loggedinUserId = req.user._id;

      const allowedStatuses = ["accepted", "rejected"];
      const isValidStatus = allowedStatuses.includes(status);
      if (!isValidStatus) {
        return next(createError(400, "Invalid status value"));
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedinUserId,
        status: "interested",
      });
      if (!connectionRequest) {
        return next(createError(404, "Connection request not found"));
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      const otherUserId = connectionRequest.fromUserId.toString();
      const roomId = getSecretRoomId(loggedinUserId.toString(), otherUserId);

      if (status === "accepted") {
        await Chat.findOneAndUpdate(
          { roomId },
          {
            $setOnInsert: {
              roomId,
              participants: [loggedinUserId, otherUserId],
            },
          },
          { upsert: true, new: true },
        );
      }

      res.json({
        message: "Connection request reviewed successfully",
        data: connectionRequest,
      });
    } catch (err) {
      next(err);
    }
  },
);

requestRouter.delete(
  "/connection/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const loggedInUserId = req.user._id;

      const removeConnection = await ConnectionRequest.findOneAndDelete({
        $or: [
          { fromUserId: userId, toUserId: loggedInUserId },
          { fromUserId: loggedInUserId, toUserId: userId },
        ],
        status: "accepted",
      });

      if (!removeConnection) {
        return next(createError(404, "Connection does not exist"));
      }

      res.json({
        message: "Connection deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = requestRouter;

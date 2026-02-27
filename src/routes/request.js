const express = require("express");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const createError = require("../helpers/createError")

requestRouter.post("/send/:status/:userId", userAuth, async (req, res , next) => {
  try {
    const { status, userId } = req.params;
    const loggedinUserId = req.user._id;

    const allowedStatus = ["ignored", "interested"];
    const isValidStatus = allowedStatus.includes(status);
    if (!isValidStatus) {
      return createError(400, "Invalid status value");
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return createError(404, "User not found");
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: loggedinUserId, toUserId: userId },
        { fromUserId: userId, toUserId: loggedinUserId },
      ],
    });
    if (existingRequest) {
      return createError(409, "Connection request already exist");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId: loggedinUserId,
      toUserId: userId,
      status: status,
    });

    await connectionRequest.save();

    res.json({
      message: "Connection request sent successfully",
      data: connectionRequest,
    });
  } catch (err) {
    next(err);
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res , next) => {
  try {
    const { status, requestId } = req.params;
    const loggedinUserId = req.user._id;

    const allowedStatuses = ["accepted", "rejected"];
    const isValidStatus = allowedStatuses.includes(status);
    if (!isValidStatus) {
      return createError(400, "Invalid status value");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedinUserId,
      status: "interested",
    });
    if (!connectionRequest) {
      return createError(404, "Connection request not found");
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.json({
      message: "Connection request reviewed successfully",
      data: connectionRequest,
    });
  } catch (err) {
    next(err);
  }
});

requestRouter.delete("/connection/:userId", userAuth, async (req, res , next) => {
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
      return createError(404, "Connection does not exist");
    }

    res.json({
      message: "Connection deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = requestRouter;

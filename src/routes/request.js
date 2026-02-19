const express = require("express");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post("/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const { status, userId } = req.params;
    const loggedinUserId = req.user._id;

    // check if it status allowed
    const allowedStatus = ["ignored", "interested"];
    const isValidStatus = allowedStatus.includes(status);
    if (!isValidStatus) {
      return res.status(404).json({
        message: "Invalid status value",
      });
    }

    // check if it toUserId exist in DB
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check if it connection request already exists
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: loggedinUserId, toUserId: userId },
        { fromUserId: userId, toUserId: loggedinUserId },
      ],
    });
    if (existingRequest) {
      return res.status(404).json({
        message: "Connection request already exist",
      });
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
    res.status(400).json({
      message: "Error sending connection request :" + err.message,
    });
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedinUserId = req.user._id;

    // check if it status allowed
    const allowedStatuses = ["accepted", "rejected"];
    const isValidStatus = allowedStatuses.includes(status);
    if (!isValidStatus) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    // find the connection request
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedinUserId,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.json({
      message: "Connection request reviewed successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error reviewing connection request : " + err.message,
    });
  }
});

module.exports = requestRouter;

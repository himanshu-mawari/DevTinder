const express = require("express");
const userRouter = express.Router();
const createError = require("../helpers/createError");
const mongoose = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const USER_SAFE_DATA =
  "profilePicture  firstName lastName bio age gender skills tags username githubUsername portfolioUrl location title";

userRouter.get("/requests/received", userAuth, async (req, res, next) => {
  try {
    const loggedinUserId = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedinUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Successfully fetching the pending requests",
      data: connectionRequests,
    });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/connections", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Successfully fetching the pending requests",
      data,
    });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/feed", userAuth, async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .select("fromUserId toUserId")
      .lean();

    const excludedUserIds = new Set([loggedInUserId.toString()]);

    connections.forEach(({ fromUserId, toUserId }) => {
      excludedUserIds.add(fromUserId.toString());
      excludedUserIds.add(toUserId.toString());
    });

    const feedUsers = await User.find({
      _id: {
        $nin: [...excludedUserIds],
      },
    })
      .select(USER_SAFE_DATA)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit + 1)
      .lean();

    const hasMore = feedUsers.length > limit;
    const pageResults = hasMore ? feedUsers.slice(0, limit) : feedUsers;
    res.json({
      message: "Successfully fetched the user profiles",
      data: pageResults,
      pagination: {
        page,
        limit,
        hasMore,
      },
    });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/:userId", userAuth, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(createError(400, "Invalid user id"));
    }

    const user = await User.findById(userId).select(
      "firstName lastName username profilePicture",
    );
    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.json({
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;

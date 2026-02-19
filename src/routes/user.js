const express = require("express");
const userRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../middlewares/auth");
const User = require("../models/user")
const USER_SAFE_DATA = "profilePicture username firstName lastName bio age gender skills";

// Get all the pending connection request for the loggedinuser
userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedinUserId = req.user._id

        // find the received connection request
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedinUserId,
            status: "interested"
        }).populate("fromUserId" , USER_SAFE_DATA)

        res.json({
            message: "Successfully fetching the pending requests",
            data: connectionRequests
        })
    } catch (err) {
        res.status(400).json({
            message: "Error viewing requests : " + err.message
        })
    }
});

// GET fetch all accepted connection requests made by the logged-in user

userRouter.get("/connections", userAuth, async (req, res) => {
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

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});


userRouter.get("/feed", userAuth , async (req, res) => {
    try {
        const loggedinUserId = req.user._id;
                
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = ( page - 1 ) * limit;
        
        limit = limit > 50 ? 50 : limit;     

        // find the all interacted user by loggedinuser
        const users = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedinUserId },
                { toUserId: loggedinUserId }    
            ]
        });
                
        // Storing which is hide from the loggedinuser feed
        const hideUserFromFeed = new Set();
        users.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });
        
        const feedUser = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedinUserId } }
            ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        
        res.json({
            message : "Successfully fetched the user profiles",
            data : feedUser
        });
    } catch (err) {
        res.status(400).json({
            message : "Error providing the feed to user : " + err.message
        })
    }
}); 

module.exports = userRouter;  
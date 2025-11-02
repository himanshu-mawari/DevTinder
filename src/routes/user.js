const express = require("express");
const ConnectionRequest = require("../models/connectionRequest")
const userAuth = require("../middlewares/auth")

const userRouter = express.Router();
const USER_SAFE_DATA = "profilePicture username firstName lastName bio age gender skills";

// Get all the pending connection request for the loggedinuser
userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedinUserId = req.user._id

        // find the received connection request
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedinUserId,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

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
        const loggedinUserId = req.user._id;

        // find all accepted connection requests 
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedinUserId, status: "accepted" },
                { toUserId: loggedinUserId, status: "accepted" }
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId" , USER_SAFE_DATA);

        const data = connectionRequest.map(row =>{
            if(row.fromUserId._id.toString() === loggedinUserId.toString()){
                    return row.toUserId
                }
                return row.fromUserId
        } 
    );
          
        res.json({
            message: "Successfully fetching requests",
            data: data
        });
    } catch (err) {
        res.status(400).json({
            message: "Error finding connection: " + err.message
        });
    }
});

module.exports = userRouter;
const express = require("express");
const ConnectionRequest = require("../models/connectionRequest")
const userAuth = require("../middlewares/auth")

const userRouter = express.Router();

// Get all the pending connection request for the loggedinuser
userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedinUserId = req.user._id

        // find the received connection request
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedinUserId,
            status: "interested"
        }).populate("fromUserId", "profilePicture username firstName lastName bio age gender skills")

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


module.exports = userRouter;
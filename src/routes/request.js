const express = require("express");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {

        const { status, userId } = req.params;
        const loggedinUserId = req.user._id;

        // check if it status allowed
        const allowedStatus = ["ignored", "interested"];
        const isValidStatus = allowedStatus.includes(status);
        if (!isValidStatus) {
            res.status(404).json({
                message: "Invalid status value"
            })
        };

        // check if it toUserId exist in DB
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            res.status(404).json({
                message: "User not found"
            })
        };

        // check if it connection request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [{ fromUserId: loggedinUserId, toUserId: userId },
            { fromUserId: userId, toUserId: loggedinUserId }
            ]
        });
        if (existingRequest) {
            res.status(404).json({
                message: "Connection request already exist"
            })
        };

        const connectionRequest = new ConnectionRequest({
            fromUserId: loggedinUserId,
            toUserId:  userId,
            status : status
        });
        
        await connectionRequest.save();
        
        res.json({
            message: "Connection request sent successfully",
            data : connectionRequest
        });

    } catch (err) {
        res.status(400).send("Error sending connection request :" + err.message);
    }
});

module.exports = requestRouter;

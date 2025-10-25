const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "intrested", "accepted", "rejected"],
            message: "{VALUE} is not valid status"
        },
        required: true
    }
}, { timestamps: true });

const ConnectionRequestModel = mongoose.model("connectionRequestModel" , connectionRequestSchema);

module.exports = ConnectionRequestModel;
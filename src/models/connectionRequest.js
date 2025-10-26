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

connectionRequestSchema.pre("save" , function(next){
    const connectionRequest = this;
   
    const isSameId = connectionRequest.fromUserId.equals(connectionRequest.toUserId);
    if(isSameId){
        throw new Error("You cannot send connection request to yourself")
    }

    next() 
})

const ConnectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
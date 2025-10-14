const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique : true
    },
    age: {
        type : Number
    },
    gender: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User" , userSchema);

module.exports = User;











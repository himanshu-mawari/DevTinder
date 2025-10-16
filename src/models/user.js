const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    } ,
    firstName : {
        type : String,
        required : true
    } ,
    lastName : {
        type : String,
        required : true
    } , 
    age : {
        type : String,
        required : true
    } ,
    password : {
        type : String,
        required : true
    } ,
    emailId : {
        type : String,
        required : true
    } 
});

const User = mongoose.model("User" , userSchema);

module.exports = User;
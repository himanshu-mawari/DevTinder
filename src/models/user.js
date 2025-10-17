const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        minLength: [4, "First name must be at least 4 characters"],
        maxLength: [30, "First name cannot exceed 40 characters"]
    },
    lastName: {
        type: String,
        minLength: [4, "last name must be at least 4 characters"],
        maxLength: [30, "last name cannot exceed 30 characters"]
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Make a strong password")
            }
        }
    },
    age: {
        type: Number,
        min: [18, "You must be at least 18 yrs old"]
    },
    photoUrl: {
        type: String,
        default:
            "https://cdn.vectorstock.com/i/1000v/96/77/blank-grey-scale-profile-picture-placeholder-vector-51589677.avif"
    },
    bio: {
        type: String,
        default: "This is a default about of the user",
        maxLength: [500, "Bio must be under 500 characters"]
    },
    skills: {
        type: [String],
        default: [],
        validate(value) {
            if (value.length > 10) {
                throw new Error("Maximum of 10 skills are allowed")
            }
        }
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: "{VALUE} is not a valid gender"
        }
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
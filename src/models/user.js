const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyArrayLength } = require("../helpers/validation");
require("dotenv").config();

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [30, "First name cannot exceed 30 characters"],
    },
    lastName: {
      type: String,
      minLength: [3, "last name must be at least 4 characters"],
      maxLength: [30, "last name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      index: true,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        const isVaildEmail = validator.isEmail(value);
        if (!isVaildEmail) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        const isStrongPassword = validator.isStrongPassword(value);
        if (!isStrongPassword) {
          throw new Error("Make a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "You must be at least 18 yrs old"],
      max: [100, "Age cannot be more than 100"],
    },
    profilePicture: {
      type: String,
      default: null,
      validate(value) {
        if (value === null) return;
        const isValidUrl = validator.isURL(value);

        if (!isValidUrl) {
          throw new Error("Invalid image url");
        }
      },
    },
    bio: {
      type: String,
      default: "This is a default about of the user",
      maxLength: [500, "Bio must be under 500 characters"],
    },
    skills: {
      type: [String],
      default: [],
      validate: verifyArrayLength(10),
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not a valid gender",
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: verifyArrayLength(5),
    },
    githubUsername: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9-]*$/, "Invalid GitHub username"],
    },
    portfolioUrl: {
      type: String,
      default: "",
      match: [/^$|^https?:\/\/.+/, "Must be a valid url"],
    },
    location: {
      type: String,
      trim: true,
      maxLength: 150,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function (req, res) {
  try {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return token;
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
};

userSchema.methods.verifyPassword = async function (password) {
  try {
    const user = this;
    const hashPassword = user.password;
    const passwordInputByUser = password;
    const isCorrectPassword = await bcrypt.compare(
      passwordInputByUser,
      hashPassword,
    );
    return isCorrectPassword;
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;

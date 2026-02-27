const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      default:
        "https://img.freepik.com/premium-vector/profile-icon_838328-1033.jpg",
      validate(value) {
        const isValidUrl = validator.isURL(value);

        const isImageUrl = /\.(jpg|jpeg|png|webp|gif)$/i.test(value);

        if (!isValidUrl || !isImageUrl) {
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
      validate(value) {
        if (value.length > 10) {
          throw new Error("Maximum of 10 skills are allowed");
        }
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not a valid gender",
      },
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function (req, res) {
  try {
    const user = this;

    const privateKey = "DevTinder@2108#&";
    const token = await jwt.sign({ _id: user._id }, privateKey, {
      expiresIn: "1d",
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

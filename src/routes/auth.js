const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { verifySignInput } = require("../helpers/validation");
const authRouter = express.Router();
const createError = require("../helpers/createError");

authRouter.post("/signup", async (req, res, next) => {
  try {
    verifySignInput(req);

    const { firstName, lastName, email, password, username } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.send(savedUser);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return next(createError(401, "Invalid credentials"));
    }

    const isCorrectPassword = await user.verifyPassword(password);

    if (!isCorrectPassword) {
      return next(createError(401, "Invalid credentials"));
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.json({
        message: "Logged in successfully",
        data: user,
      });
    }
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token", null, { expires: Date.now() });
    res.json("logout successfully!");
  } catch (err) {
    next(err);
  }
});

module.exports = authRouter;

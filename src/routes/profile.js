const express = require("express");
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const {
  verifyProfileInput,
  verifyOldPassword,
} = require("../helpers/validation");
const profileRouter = express.Router();
const createError = require("../helpers/createError")

profileRouter.get("/view", userAuth, async (req, res , next) => {
  try {
    res.send(req.user);
  } catch (err) {
    next(err);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res , next) => {
  try {
    verifyProfileInput(req);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: "Profile updated successfully",
      data: loggedInUser,
    });
  } catch (err) {
    next(err);
  }
});

profileRouter.patch("/reset-password", userAuth, async (req, res , next) => {
  try {
    const loggedInUser = req.user;
    const currentPassword = loggedInUser.password;
    const { oldPassword, newPassword } = req.body;

    await verifyOldPassword(oldPassword, currentPassword);

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashNewPassword;
    await loggedInUser.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
});

profileRouter.patch("/remove/skill", userAuth, async (req, res , next) => {
  try {
    const loggedInUser = req.user;
    const { removeSkill } = req.body;

    if (!removeSkill) {
      new createError(400, "Skill not provided");
    }

    const findRemoveSkill = loggedInUser.skills.includes(removeSkill);
    if (!findRemoveSkill) {
      new createError(404, "Skill doesn't exist");
    }

    const updatedSkills = loggedInUser.skills.filter(
      (skill) => skill.toLowerCase() !== removeSkill.trim().toLowerCase(),
    );
    loggedInUser.skills = updatedSkills;

    await loggedInUser.save();

    res.json({
      message: "Successfully removed skill",
      data: loggedInUser.skills,
    });
  } catch (err) {
    next(err)
  }
});

module.exports = profileRouter;

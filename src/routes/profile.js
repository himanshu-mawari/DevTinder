const express = require("express");
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const { verifyProfileInput, verifyOldPassword } = require("../helpers/validation");
const profileRouter = express.Router();


profileRouter.get("/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).json({
            message: "Error fetching profile :" + err.message
        })
    }
});


profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        verifyProfileInput(req);

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();

        res.json({
            message: "Profile updated successfully",
            data: loggedInUser
        })
    } catch (err) {
        res.status(400).json({
            message: "Error updating profile :" + err.message
        })
    }
});


profileRouter.patch("/reset-password", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const currentPassword = loggedInUser.password;
        const { oldPassword, newPassword } = req.body

        await verifyOldPassword(oldPassword, currentPassword);

        const hashNewPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashNewPassword;
        await loggedInUser.save();

        res.json({
            message: "Password updated successfully",
            data: loggedInUser
        })
    } catch (err) {
        res.status(400).json({

            message: "Error changing password : " + err.message
        });
    }
});


module.exports = profileRouter; 
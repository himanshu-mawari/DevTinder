const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const { verifySignInput } = require("../helpers/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // Validation of user input
        verifySignInput(req);

        const { firstName, lastName, email, password } = req.body;

        // Encrypted the password
        const passwordHash = await bcrypt.hash(password, 10);

        const users = new User({
            username: firstName + Math.random().toString(36).substring(2, 5),
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await users.save();
        res.send("User added successfullly");
    } catch (err) {
        res.status(400).json({
            message: "Error signing up : " + err.message
        })
    }
});

authRouter.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send("Invalid credentials!")
        };

        const isCorrectPassword = await user.verifyPassword(user, password)

        if (!isCorrectPassword) {
            return res.status(400).send("Invalid credentials!")
        } else {
            const token = await user.getJWT();
            await res.cookie("token", token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
            res.send(user);
        }

    } catch (err) {
        res.status(400).json({
            message: "Error logging in  : " + err.message
        }
        );
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        await res.clearCookie("token");
        res.send("logout successfully!");
    } catch (err) {
        res.status(400).json({
            message: "Error logging out : " + err.message
        })
    }
});

module.exports = authRouter;
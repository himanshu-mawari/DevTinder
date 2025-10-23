const express = require("express");
const userAuth = require("../middlewares/auth")
const profileRouter = express.Router();


profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send("Error fetching profile :" + err.message);
    }
});

module.exports = profileRouter;
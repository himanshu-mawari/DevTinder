const express = require("express");
const userAuth = require("../middlewares/auth")
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const { firstName, lastName } = req.user

        res.send(`${firstName} ${lastName} sent you a connection request`)
        console.log(`${firstName} ${lastName} sent you a connection request`)

    } catch (err) {
        res.status(400).send("Error sending connection request :" + err.message);
    }
});

module.exports = requestRouter;

const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const validateSignUpInput = require("./helpers/validation")
const app = express();
const ports = 3000;

app.use(express.json());

// dynamic post api route for signup
app.post("/signup", async (req, res) => {
    
    // Validation of user input
     validateSignUpInput(req);

    try {
        const data = req.body;
        const users = new User(data)
        await users.save();
        res.send("User added successfullly");
    } catch (err) {
        res.status(402).send("Error occur : " + err.message)
    }
});

// API Get/feed - to get all user
app.get("/user", async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) res.status(401).send("No user found");
        else res.send(users);
    } catch (err) {
        console.log("Error occur : " + err.message)
    }
});

// API GET/user - to get user by their id.
app.get("/user/id", async (req, res) => {
    const userId = req.body.userId;
    try {
        const users = await User.findById(userId);
        if (!users) res.status(402).send("No user found");
        else res.send(users);
    } catch (err) {
        res.status(402).send("Error occur : " + err.message);
    }
});

// API GET/user - to get user by their gmail.
app.get("/user/email", async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const user = await User.find({ emailId: emailId });
        if (!user) res.status(401).send("No user found wiht the provided email!");
        else res.send(user);
    } catch (err) {
        res.status(402).send("Error occur :" + err.message);
    }
});

// API DELETE/user - to remove the user by their id
app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(402).send("Error occur :" + err.message);
    }
});

// API PATCH/user - to update the user specific field with some validation for certain thing you can updates.
app.patch("/user/:userId", async (req, res) => {

    try {
        const userId = req.params.userId;
        const data = req.body;

        const ALLOWED_UPDATES = [
            "profilePicture",
            "firstName",
            "lastName",
            "bio",
            "skills",
            "password",
            "age",
        ]

        const isUpdateAllowed = Object.keys(data).every(k =>
            ALLOWED_UPDATES.includes(k)
        )

        if (!isUpdateAllowed) {
           res.status(400).send("Invalid updates! Sorry, you can't update certain fields")
        }
    
        await User.findByIdAndUpdate(userId, data , { runValidation : true});
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Error occur: " + err.message);
    }
});


connectDb().then(() => {
    console.log("Database connection established!!");

    app.listen(ports, () => {
        console.log(`The server is listening on port ${ports} successfully!!!`);
    });

}).catch(err => {
    console.error("Database cannot established!!!" + err.message);
});



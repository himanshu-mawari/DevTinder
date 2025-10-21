const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUpInput } = require("./helpers/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const app = express();
const ports = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())

// POST /signup route
app.post("/signup", async (req, res) => {
    
    try {
        // Validation of user input
        validateSignUpInput(req);

        const { firstName, lastName, email, password } = req.body
        
        // Encrypted the password
        const passwordHash = await bcrypt.hash(password, 10);
        
        const users = new User({
            username: firstName + Math.random().toString(36).substring(2, 5),
            firstName,
            lastName,
            email,
            password: passwordHash
        })
        
        await users.save();
        res.send("User added successfullly");
    } catch (err) {
        res.status(400).send("Error creating user:" + err.message)
    }
});

// POST /login route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email })
        
        if (!user) {
            res.status(400).send("Invalid credentials!")
        };
        
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        
        if (!isCorrectPassword) {
            res.status(400).send("Invalid credentials!")
        } else {
            
            // Create JWT token with user ID and secret key
            const privateKey = "DevTinder@2108#&"
            const token = await jwt.sign({ _id: user._id }, privateKey);
            
            res.cookie("token", token);
            res.send("login Successful!");
        }
        
    } catch (err) {
        res.send("Error logging in:" + err.message);
    }
});

// GET /profile api 
app.post("/profile", async (req, res) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            throw new Error("token not found");
        }
        
        const decodedToken = await jwt.verify(token, 'DevTinder@2108#&');
        
        const { _id } = decodedToken;
        
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        
        res.send(user);
    } catch (err) {
        res.status(400).send("Error loading profile:" + err.message);
    }
    
});

// GET /feed route
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        
        if (users.length === 0) {
            res.status(401).send("No user found");
        }
        else {
            res.send(users);
        }
    } catch (err) {
        console.log("Error accessing feed: " + err.message)
    }
});

// GET /user/id route
app.get("/user/id", async (req, res) => {
    const userId = req.body.userId;
    try {
        const users = await User.findById(userId);
        if (users.length === 0) {
            res.status(402).send("No user found");
        }
        else {
            res.send(users);
        }
    } catch (err) {
        res.status(402).send("Error retrieving user by ID:" + err.message);
    }
});

// GET /user/email route 
app.get("/user/email", async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const users = await User.find({ emailId: emailId });
        if (users.length === 0) {
            res.status(401).send("No user found wiht the provided email!");
        }
        else {
            res.send(users);
        }
    } catch (err) {
        res.status(402).send("Error retrieving user by email:" + err.message);
    }
});

// PATCH /user/:userId route
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
        
        await User.findByIdAndUpdate(userId, data, { runValidation: true });
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Error saving changes:" + err.message);
    }
});

// API DELETE/user - to remove the user by their id
app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        const users = await User.findByIdAndDelete(userId);
        
        if (!users) {
            res.status(400).send("User not found");
        } else {
            res.send("User deleted successfully");
            
        }
    } catch (err) {
        res.status(402).send("Error deleting account: " + err.message);
    }
});

connectDb().then(() => {
    console.log("Database connected successfully");

    app.listen(ports, () => {
        console.log(`The server is listening on port ${ports} successfully!!!`);
    });

})
    .catch(err => {
        console.error("Error:" + err.message);
    });
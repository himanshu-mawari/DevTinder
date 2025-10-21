const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUpInput } = require("./helpers/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")
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
app.get("/profile", userAuth , async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send("Error loading profile:" + err.message);
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
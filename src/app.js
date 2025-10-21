const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const validateSignUpInput = require("./helpers/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/auth");
const app = express();
const ports = 3000;

app.use(express.json());
app.use(cookieParser());


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
        res.status(400).send("Error occur : " + err.message)
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(password);

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).send("Invalid credentials!")
        };

        const isCorrectPassword = await user.verifyPassword(user , password)

        if (!isCorrectPassword) {
            res.status(400).send("Invalid credentials!")
        } else {
            const token = await user.getJWT();

            await res.cookie("token", token, { expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) });
            res.send("login Successful!");
        }

    } catch (err) {
        res.send("Error occur : " + err.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send("Error fetching profile :" + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const { firstName, lastName } = req.user

        res.send(`${firstName} ${lastName} sent you a connection request`)

    } catch (err) {
        res.status(400).send("Error sending connection request :" + err.message);
    }
});


connectDb().then(() => {
    console.log("Database connected successfully");

    app.listen(ports, () => {
        console.log(`The server is listening on port ${ports} successfully!!!`);
    });

}).catch(err => {
    console.error("Error:" + err.message);
});
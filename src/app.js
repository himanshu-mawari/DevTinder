const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const app = express();
const ports = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/" , authRouter);
app.use("/profile" , profileRouter);
app.use("/request" , requestRouter);




connectDb().then(() => {
    console.log("Database connected successfully");

    app.listen(ports, () => {
        console.log(`The server is listening on port ${ports} successfully!!!`);
    });

}).catch(err => {
    console.error("Error:" + err.message);
});
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const cors = require("cors");
const errorMiddleware = require("./middlewares/errorMiddleware");
const { createServer } = require("http");
const initializeServer = require("./helpers/socket");
const connectCloudinary = require("./config/cloudinary");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);
app.use("/chats", chatRouter);
app.use(errorMiddleware);

const httpServer = createServer(app);

initializeServer(httpServer);

const startServer = async () => {
  try {
    await connectDb();
    console.log("Database connected successfully");
    await connectCloudinary();
    console.log("Cloudinary connected successfully");
    httpServer.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Start up failed: " + err.message);
  }
};

startServer();

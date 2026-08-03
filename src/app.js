const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat")
const cors = require("cors");
const errorMiddleware = require("./middlewares/errorMiddleware");
const { createServer } = require("http");
const initializeServer = require("./helpers/socket");



const app = express();
const ports = 3000;

const httpServer = createServer(app);
initializeServer(httpServer)

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
app.use("/chats" , chatRouter )
app.use(errorMiddleware);



connectDb()
  .then(() => {
    console.log("Database connected successfully");

    httpServer.listen(ports, () => {
      console.log(`The server is listening on port ${ports} successfully!!!`);
    });
  })
  .catch((err) => {
    console.error("Error:" + err.message);
  });

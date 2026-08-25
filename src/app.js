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

/**
 * 
1 Install multer
  npm install multer. This is a dependency change, not a commit by itself — fold it into step 2's commit since package.json/lock changes alongside the code that needs them.

2 Configure multer middleware
  Create middleware/multer.js (or similar). Use memoryStorage (not diskStorage) since you're forwarding the buffer straight to Cloudinary — no need to write to disk first. Set fileFilter to reject non-image mimetypes and limits.fileSize to cap upload size (e.g. 5MB). Export the configured multer instance. Commit: 'feat: configure multer middleware for file uploads'

3 Wire multer into the route
  In your route file, add the multer middleware before the controller: router.post('/profile/photo', auth, upload.single('avatar'), updateProfilePhoto). Field name in .single('avatar') must match the frontend FormData key exactly, or req.file will be undefined with no error — this is the #1 silent bug here. Commit alongside step 2, or its own commit if the route already existed: 'feat: attach multer to [route] for avatar upload'

4 Build the Cloudinary upload service (if not already present)
  A function that takes req.file.buffer,
   streams it to Cloudinary (use upload_stream since you have a buffer, 
   not a file path — cloudinary.uploader.upload expects a path/base64, 
   upload_stream expects a buffer), and returns a Promise resolving to the result 
   (you need result.secure_url). Commit: 'feat: add cloudinary buffer upload service'

5 Update the controller to use it
  In the controller: read req.file (set by multer), call your upload service, await the secure_url, save it to the correct field on the user/document, save to DB, respond. Handle the case where req.file is undefined (no file sent) with a 400 — don't let it hit Cloudinary with undefined. Commit: 'feat: update [controller] to upload avatar and persist secure_url'

6 Test the full round trip before committing anything as 'done'
  Send a real multipart request (Postman/frontend) with a file under and over your size limit, and with a non-image file. Confirm: valid upload → secure_url saved to DB and returned in response. Oversized/wrong-type → clean 400, not a stack trace. Missing file → clean 400. Only then are these commits actually correct, not just compiling.

 */
const multer = require("multer");

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    err.statusCode = 400;
    err.message = "File too large. Max size is 5MB.";
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;
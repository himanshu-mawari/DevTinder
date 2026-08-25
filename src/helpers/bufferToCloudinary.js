const { Readable } = require("stream");
const cloudinary = require("cloudinary").v2;

const bufferToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
};

module.exports = bufferToCloudinary;

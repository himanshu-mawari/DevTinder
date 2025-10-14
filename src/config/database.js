const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://himanshudev:btM4GSQA8PsCPCoX@namastenode.zfrrlvt.mongodb.net/"
    )
};

module.exports = connectDB;











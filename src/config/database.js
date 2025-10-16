const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect(
        "mongodb+srv://himanshudev:btM4GSQA8PsCPCoX@namastenode.zfrrlvt.mongodb.net/devTinder"
    )
};


module.exports = connectDb;
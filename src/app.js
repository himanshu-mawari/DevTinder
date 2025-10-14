const express = require("express");
const connectDB = require("./config/database")
const app = express();
const ports = 3000;


connectDB().then(() => {
    console.log("Database connection established!!");
    app.listen(ports, () => {
        console.log(`The server is listening on port ${ports} successfully!!!`);
    });
}).catch(err => {
    console.error("Database connection can't established!!!")
})



const express = require("express");
const connectDb  = require("./config/database");
const User = require("./models/user")
const app = express();
const ports = 3000;


app.use(express.json())

app.post("/signup" , async (req , res) => {

    const user = new User(req.body)

    try{
       await user.save()
       res.send("User successfully Added!!");
    }catch(err){
       res.status(401).send("User not Added" + err.message)
    }
});



connectDb().then(() => {
    console.log("Database are established!!")
    app.listen(ports, () => {
        console.log(`The server is listening on port ${ports} successfully!!!`);
    });
}).catch(err => {
    console.error("Database cannot established!");
});

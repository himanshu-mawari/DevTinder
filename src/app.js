const express = require("express");
const { adminAuth , userAuth } = require("./middlewares/auth")
const app = express();
const ports = 3000;

// Handling routes with next()
// Middleware functions can be used to process requests before they reach the route handler.

app.use("/user" , userAuth)

app.use("/admin" , adminAuth)

app.get("/user/login" , (req , res) => {
    res.send("User login!!")
})

app.get("/user/register" , (req , res) => {
    res.send("User register");
});

app.get("/admin/getAllUser" , (req , res , next) => {
    const user = JSON.stringify(req.query.id)
    res.send(`${user} you dont have access these routes please exit or face the consiquences!!!`);
});

app.get("/admin/addAUser" , (req , res , next) =>{
    res.send("This from the admin add a user with id : 1!!");
})




app.listen(ports , () => {
    console.log(`The server is listening on port ${ports} successfully!!!`);
});
const express = require("express");
const { adminAuth , userAuth } = require("./middlewares/auth.js");
const app = express();
const ports = 3000;

// Handling routes with next()
// Middleware functions can be used to process requests before they reach the route handler.


// Auth middlewares for all /admin requests.
app.use("/admin" , adminAuth);

// Auth middlewares for all /user requests except /user/login.
app.use("/user" , userAuth)

app.get("/user/login" , (req , res) => {
    res.send("User logging!!")
})
app.get("/user/signUp" , (req , res ) => {
    res.send("User signing up!!");
});

app.get("/admin/getAllUser" , (req , res , next) =>{
    console.log("Admin middleware is running!!")
    res.send("Hello from Admin get all user data!!");
});

app.get("/admin/deleteUser" , (req , res , next) =>{
    res.send("Hello from Admin delete user of ID 1!!");
});


app.listen(ports , () => {
    console.log(`The server is listening on port ${ports} successfully!!!`);
});
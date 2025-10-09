const express = require("express");
const app = express();
const ports = 3000;

// Handling routes with next()
// Middleware functions can be used to process requests before they reach the route handler.


app.use("/admin" , (req , res , next) =>{
    let token = "hm5056";  // Simulated auth token for protected routes
    if( token !== "hm5056"){
        res.status(401).send("Permission denied. You are not authorized to access this resource.");
    } else{
        next();
    }
});

app.get("/user" , (req , res , next) =>{
    console.log("User middleware is running");
    res.send("All users data access by admin");
});

// Auth middlewares for all /admin requests
app.get("/admin/getAllUser" , (req , res , next) =>{
    console.log("Admin middleware is running!!")
    res.send("Hello from Admin get all user data!!");
});

app.get("/admin/deleteUser" , (req , res , next) =>{
    res.send("Hello from Admin delete user of ID 1!!");
});

app.listen(ports , () => {
    console.log(`The server is listening on port ${ports} successfully!!!`);
})

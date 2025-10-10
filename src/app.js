const express = require("express");
const { adminAuth , userAuth } = require("./middlewares/auth")
const app = express();
const ports = 3000;

// Error handling.

app.get("/userRegister" , (req , res , next) => {
    // try{
        throw new Error("Error occur")
        res.send("User registered!!");
    // } catch(err) {
       
    // }
});

app.use("/" , (err , req , res , next) =>{
    if(err){
        res.status(501).send("Something wrong!!")
    }
})





app.listen(ports , () => {
    console.log(`The server is listening on port ${ports} successfully!!!`);
});
const express = require("express");
const app = express();
const ports = 3000;

app.get(
    "/user" , 
    (req , res , next) =>{
       console.log("handling user routes");
       next();
    } , 
    (req , res , next) =>{
        console.log("handling the route user 1");
        // res.send("Ist response")
        next()
    } , 
    (req , res , next) =>{
        console.log("handling the route user 2");
        // res.send("IInd response")
        next()
    } , 
    (req , res , next) =>{
        console.log("handling the route user 3");
        // res.send("IIIrd response")
        next()
    } , 
    (req , res , next) =>{
        console.log("handling the route user 4");
        res.send("IVth response")
    }
);

app.listen(ports , () => {
    console.log("The server is listening on port 7777 successfully!!!");
})
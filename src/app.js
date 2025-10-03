const express = require("express");

const app = express();

app.use("/hello" , (req , res) => {
    res.send("Hello!! Hello!! Hello!");
})

app.use("/test" , (req , res) =>{
    res.send("Hello from the server")
})

app.use("/" , (req , res) =>{
    res.send("Namaste Himanshu!")
});


app.listen(7777 , () =>{
    console.log("The server is listening on 7777 ports successfully!!!");
});


const express = require("express");
const app = express();

app.get("/user" , (req , res) =>{
    res.send("Hello Himanshu!!!");
});

app.post("/user" , (req , res) =>{
    res.send("Got a post request !!!")
})
app.put("/user" , (req , res) =>{
    res.send("Got a put request at /user !!!")
})
app.patch("/user" , (req , res) =>{
    res.send("Got a patch request at /user !!!")
})
app.delete("/user" , (req , res) =>{
    res.send("Got a delete request at /user !!!")
})



app.listen(7777, () => {
    console.log("The server is listening on port 7777 successfully!!!");
});
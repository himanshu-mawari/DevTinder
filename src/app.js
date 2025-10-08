const express = require("express");
const app = express();

// Replaced app.use() with app.get() for handling specific routes.
// app.use() applies to all HTTP methods and routes that match the path.
// ? makes the preceding character or group optional.
// * allows the preceding character or group to repeat zero or more times.
// + indicates that the preceding character or group can be repeated one or more times.
// /a/ this route matches any path containing the letter 'a' anywhere in the URL.


app.get( "/ab?cd/", (req , res) => {
    res.send("Hello himanshu!! from /ca+b/ routes by devtinder server")
})

app.get( "/ab*cd/", (req , res) => {
    res.send("Hello himanshu!! from /ca+b/ routes by devtinder server")    
})


app.get( "/ab+cd/", (req , res) => {
    res.send("Hello himanshu!! from /ca+b/ routes by devtinder server")    
})

app.get(/a/ , (req , res) => {
    res.send("Hello himanshu!! from /a/ routes by devtinder server")    
})

app.listen(3000, () => {
    console.log("The server is listening on port 3000 successfully!!!");
});
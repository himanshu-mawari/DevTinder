const adminAuth = (req , res , next) => {
    const token = "hmawari@123";
    const isAuthorised = token === "hmawari@123";

    console.log("Admin Authorization will apply that routes!!")

    if(!isAuthorised) {
        res.status(402).send("Permission denied!!")
    } else {
        next()
        console.log("PASSED You have access these routes feel free to move forward!!")
    }
};
const userAuth = (req , res , next) => {
    const token = "hmawari@123";
    const isAuthorised = token === "hmawari@123";
    
    if( req.path === "/login") {
        return next()
    }

    console.log("User Authorization will apply that routes!!")

    if(!isAuthorised) {
        res.status(402).send("Permission denied!!")
    } else {
        next()
        console.log("PASSED You have access these routes feel free to move forward!!")
    }
};

module.exports = { adminAuth , userAuth }
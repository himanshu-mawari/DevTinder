const adminAuth =  (req , res , next) =>{
    let token = "hm5056";  // Simulated auth token for protected routes
    if( token !== "hm5056"){
        res.status(401).send("Permission denied. You are not authorized to access this resource.");
    } else{
        next();
    }
};

const userAuth = (req , res , next) =>{
    if( req.path === "/login") {
        return next()
    }
    let token = "himanshu@123";
    if( token !== "himanshu@123"){
        res.status(401).send("Permission denied. You are not authorized to acess this resource.")
    } else {
        console.log("User Authentication Apply")
        next()
    }
};


module.exports = { adminAuth , userAuth };
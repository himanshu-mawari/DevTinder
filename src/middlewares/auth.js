const jwt = require("jsonwebtoken");
const User = require("../models/user")



const userAuth = async (req , res , next) => {
  try{

      // Read the token from the req cookies
      
      const cookie = req.cookies;
      const { token } = cookie;
      if(!token){
        throw new Error("Token not found")
      }
      
      // validate the token
      const privateKey = "DevTinder@2108#&"
      
      const decodedToken = await jwt.verify( token , privateKey);
      const { _id } = decodedToken;
            
      // Find the user
      const user =await User.findById(_id);
      if(!user){
        throw new Error("User not found")
      }

      req.user = user;
      next()
    } catch(err){
        res.status(401).send("Error :" + err.message);
    }
}

module.exports = userAuth;
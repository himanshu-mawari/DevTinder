const jwt = require("jsonwebtoken");
const User = require("../models/user");
const createError = require("../helpers/createError");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      return next(createError(401,"Token not found"));
    }

    const privateKey = "DevTinder@2108#&";
    const decodedToken = await jwt.verify(token, privateKey);
    const { _id } = decodedToken;

    const user = await User.findById(_id);
    if (!user) {
      return next(createError(401 , "User not found"));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err)
  }
};

module.exports = userAuth;

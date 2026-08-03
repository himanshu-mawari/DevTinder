const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("error : " + err.message);
    return null;
  }
};

module.exports = verifyJwt;

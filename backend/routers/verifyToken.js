const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    
    const token = authHeader.split(" ")[1];
    
    if(token) {
      
const decode= jwt.verify(token, process.env.JWT_SECRET)
      
        if (decode.id) {
          req.user = await User.findById(decode.id).select('-password')
          next();
        }
    }
  } else {
    console.log('no token');
    res.status(403).json("You are not authorized for access!");
  }
};


module.exports = { verifyToken };

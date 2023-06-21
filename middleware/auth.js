const jwt = require("jsonwebtoken");
const User = require("../models/signup");
const dotenv = require('dotenv')
const mongoDb = require("mongodb");


dotenv.config();


const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("user id is", user);
    // console.log("signupuserId>>>", user.userId);

    const user1 = await User.find(new mongoDb.ObjectId(user.userId));
 console.log('mm user-->',user1)
    req.user = user1;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};

module.exports = { authenticate };

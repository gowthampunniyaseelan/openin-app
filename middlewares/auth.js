// const User = require('../models/User');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
exports.checkUserRegisterOrNot = async (req, res,next) => {
  try {
    const {phone_number} = req.body;
    const users = await User.findOne(
      {phone_number:phone_number}
    );
    if(users && users.length > 0){
      res.status(409).json({code:409,success:false,message:"User Already Exist!"});
    }else{
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.isTokenValid = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token){
      res.status(403).send({code:403,message:"Please register first"})
    }

    const isPresent = jwt.verify(token,process.env.SECRET_KEY_FOR_AUTH);
    if(isPresent){
      req.id = isPresent.id;
      req.phone_number = isPresent.phone_number
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
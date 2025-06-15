const usermodel = require('../models/user.model');

const captainmodel = require('../models/captain.model');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


function getOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
}


module.exports.emailsent = async (req,res,next) => {
    try{
        const {email} = req.body;

        const otp = getOtp(4);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD
            }
          });

          const mailOptions = {
            from: 'peterapps70@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: `The Otp from Uber Project is ${otp}`
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          const token = jwt.sign({email , otp}, process.env.JWT_SECRET, {expiresIn: '10m'});
        
          res.status(200).json({message : 'Email sent successfully' , token : token});
    }catch(err){

    }
    


}

module.exports.validateotp = async (req,res,next) => { 
  try{
    const {otp} = req.body;

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token ){
        return res.status(401).json({message :"Unauthorized"});
    }
    
    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    
    if(!decoded || !decoded.email || !decoded.otp){
        return res.status(400).json({message: "Invalid token"});
    }
    if(decoded.otp !== otp){
      return res.status(400).json({message : "Invalid OTP"});
    }

    return res.status(200).json({message : "OTP validated successfully"});


  }catch(err){
    console.error("Error in validateotp:", err);
    return res.status(500).json({message: "Internal Server Error"});
  }
}

module.exports.captainemailsent = async (req,res,next) => {
}



module.exports.userpasswordchange = async (req,res,next) => {
      const values = req.body;
      console.log("the values are ", values);
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      console.log("the token is ", token);
      if(!token){
          return res.status(401).json({message : 'Unauthorized'});
      }

      if(!values || !values.newPassword || !values.confirmPassword){
          return res.status(400).json({message : "Please provide all fields"});
      }
      if(values.newPassword !== values.confirmPassword){
          return res.status(400).json({message : "Passwords do not match"});
      }

      const decoded = jwt.verify(token , process.env.JWT_SECRET);
      if(!decoded || !decoded.email){
          return res.status(400).json({message: "Invalid token"});
      }

      const user = await usermodel.findOne({email : decoded.email});
      if(!user){
          return res.status(404).json({message : "User not found"});
      }

      const hashedPassword = await bcrypt.hash(values.newPassword , 10);
      const Passwordchange = await usermodel.findByIdAndUpdate(user._id, {password : hashedPassword} , {new : true});
      if(!Passwordchange){
          return res.status(500).json({message : "Error in changing password"}); 
      }

      return res.status(200).json({message : "User password change endpoint hit successfully", values : values});
      
}

module.exports.captainpasswordchange = async (req,res,next) =>  {

}
const usermodel = require('../models/user.model');

const captainmodel = require('../models/captain.model');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


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

module.exports.captainemailsent = async (req,res,next) => {

}

module.exports.userpasswordchange = async (req,res,next) => {

}

module.exports.captainpasswordchange = async (req,res,next) =>  {

}
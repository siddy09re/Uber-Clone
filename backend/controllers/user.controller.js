const usermodel = require('../models/user.model');
const userservice = require('../services/user.service') 
const {validationResult} = require('express-validator');
const blacklistModel = require('../models/blacklisttoken.model');

module.exports.registeruser = async (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
                return res.status(400).json({errors : errors.array()})
        }

        const {fullname , email,password} = req.body;

        const isUserAvailable = await usermodel.findOne({email}); //checking if the user is already registered
        if(isUserAvailable){
            return res.status(400).json({message :"User a;lready exists"});
        }

        const hashedPassword = await usermodel.hashPassword(password);

        const {firstname , lastname} = fullname;

        const user = await userservice.createUser({
            firstname,
            lastname,
            email,
            password : hashedPassword
        })  

        const token = user.generatetoken();

        res.status(201).json({token , user});
}

module.exports.loginuser = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
    }
    const {email , password} = req.body;

    const user = await usermodel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message : 'User not found'})
    }

    const ismatch = await user.comparePassword(password);

    if(!ismatch){
        return res.status(401).json({message : 'Invalid credentials'})
    }

    const token = user.generatetoken();

    res.cookie('token' , token)

    res.status(200).json({token , user})

}

module.exports.getuserprofile = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
    }

    res.status(200).json(req.user);

}

module.exports.logoutuser = async (req,res,next) => {
    res.clearCookie('token');

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistModel.create({token});

    res.status(200).json({message : 'User Logout successful'})
}
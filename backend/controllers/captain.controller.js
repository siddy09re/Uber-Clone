const captainModel = require('../models/captain.model');
const {validationResult} = require('express-validator');
const captainService = require('../services/captain.service');
const BlackListTokenModel = require('../models/blacklisttoken.model');

module.exports.registerCaptain = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({errors : errors.array()})
    }
    const {fullname, email , password , vehicle} = req.body;
    const {firstname , lastname} = fullname;
    const { vehicleType, NumberPlate, capacity } = vehicle;

    const isCaptainAvailable = await captainModel.findOne({email}) //checking if the captain is already registered

    if(isCaptainAvailable){
        return res.status(400).json({message : 'Captain already exists'})
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname,
        lastname,
        email,
        password : hashedPassword,
        vehicleType,
        NumberPlate,
        capacity
    })

    const token = captain.generatetoken();

    res.status(201).json({token,captain});

}

module.exports.loginCaptain = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const {email , password} = req.body;

    const captain = await captainModel.findOne({email}).select('+password');
    if(!captain){
        return res.status(400).json({message :"Invalid captain credentials"});
    }

    const isPasswordMatched = await captain.comparePassword(password);

    if(!isPasswordMatched){
        return res.status(400).json({message : "Invalid captain credentials"});
    }

    const token = captain.generatetoken();
    res.cookie('token' , token);

    res.status(200).json({token , captain});
 
}

module.exports.getCaptainProfile = async(req,res,next) => {
    res.status(201).json(req.captain)
}

module.exports.logoutCaptain = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token ){
        return res.status(401).json({message :"Unauthorized"});
    }
    await BlackListTokenModel.create({token});
    res.clearCookie('token');
    res.status(200).json({message : 'Captain Logout successful'})
}
const usermodel = require('../models/user.model');
const captainmodel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklisted = require('../models/blacklisttoken.model');

module.exports.Userauthorization = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({message : 'Unauthorized'});
    }

    const isBlacklisted = await blacklisted.findOne({token});
    if(isBlacklisted){
        return res.status(401).json({message : 'Unauthorized'});
    }


    try{
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            // {
            //     _id: '64d1ae12c13f89f123456789',  // the user's ID
            //     iat: 1692739023,                 // issued at
            //     exp: 1692817423                  // expires at
            //   }
            //the sample output of this 
            const user = await usermodel.findById(decoded._id);
            
            req.user = user;
            return next();

    }catch(err){
        return res.status(401).json({message :'Unauthorized'})
    }
}

module.exports.Captainauthorization = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    

    if(!token){
        return res.status(401).json({message :"xcvxUnauthorized"});
    }
    const isBlackListed = await blacklisted.findOne({token});
    if(isBlackListed){
        return res.status(401).json({message:"tttUnauthorized"});
    }
    try{
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            const captain = await captainmodel.findById(decoded._id);
            req.captain = captain;
            return next();
    }catch(err){
            return res.status(401).json({message : "uuuUnauthorized"});
    }
}
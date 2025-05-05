const mongoose = require('mongoose');

const blackListtoken = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt :{
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 // 1 day in seconds
    }
   
});

const BlackListTokenModel = mongoose.model('BlackListTokens' , blackListtoken);
module.exports = BlackListTokenModel;

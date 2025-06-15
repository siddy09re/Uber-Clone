const mongoose = require('mongoose');
const usermodel = require('./user.model');
const rideSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    captain : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Captain',
    },
    pickup  :{
        type : String,
        required : true
    },
    destination : {
        type : String,
        required : true
    },
    pickupcoord: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      destinationcoord: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },      
    status : {
        type : String,
        enum : ['pending' , 'accepted','ongoing','completed','cancelled'],
        default : 'pending'
    },
    duration:{
        type : Number,
    },
    distance:{
        type : Number,
    },
    fare:{
        type : Number
    },
    vehicleType:{
        type:String
    },
    paymentId : {
        type  :String
    },
    orderId : {
        type : String
    },
    signature : {
        type : String
    },
    otp:{
        type:String,
        select : false
    }
})

const ridemodel = mongoose.model('rideuser' , rideSchema);
module.exports = ridemodel;
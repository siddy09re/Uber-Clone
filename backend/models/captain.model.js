const mongoose = require('mongoose');
const { loginuser } = require('../controllers/user.controller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const captainSchema = new mongoose.Schema({
    fullname:{
        type : new mongoose.Schema({
            firstname : {
                type: String,
                required : true,
                minlength : [3, 'First nameshould be atleast 3 characters']
            },
            lastname : {
                type:String,
            }
        })
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[6,'Provide your valid email address which is greater than 6']
    },
    password:{
        type:String,
        required:true,
        select : false,
    },
    socket_id:{
        type:String,
    },
    status : {
        type : String,
        enum : ['active' , 'inactive'],
        default : 'inactive'
    },

    vehicle:{
        type : new mongoose.Schema({
            NumberPlate:{
                    type:String,
                    required:true,
                    unique:true,
            },
            capacity:{
                type:String,
                required:true,
                minlength : [1, 'Capacity should be atleast 1 , then how would you carry the persons broooo']
            },
            vehicleType:{
                type:String,
                required:true,
                enum: ['auto' , 'bike' , 'car']
            }
        })
    } ,

    location:{
        type : new mongoose.Schema({
            latitude:{
                type:Number
            },
            longitude:{
                type:Number
            }
        })
    }
})


captainSchema.methods.generatetoken = function (){
    const token = jwt.sign({_id : this.id} , process.env.JWT_SECRET ,{expiresIn:'24h'});
    return token;
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}


const CaptainModel = mongoose.model('Captain',captainSchema);

module.exports = CaptainModel;
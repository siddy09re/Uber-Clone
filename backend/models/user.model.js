const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userschema = new mongoose.Schema({
    fullname: {
        type: new mongoose.Schema({
          firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name should be more than 3 characters']
          },
          lastname: {
            type: String,
          }
        }),
        required: true
      },
    email:{
        type : String,
        required : true,
        unique : true,
        minlength : [6 , 'Provide your email address whch is greater than 6']
    },
    password:{
        type:String,
        required : true,
        select:false,
    },
    socket_id:{
        type:String,
    }

})

userschema.methods.generatetoken = function (){
    const token = jwt.sign({_id : this.id} , process.env.JWT_SECRET , {expiresIn : '24h'})
    return token;
}

userschema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password , this.password);
}

userschema.statics.hashPassword = async function (password) {
        return await bcrypt.hash(password,10);
}

const usermodel = mongoose.model('User' , userschema);

module.exports = usermodel; 
const captainModel = require('../models/captain.model');


module.exports.createCaptain = async ({firstname , lastname , email , password , vehicleType , NumberPlate , capacity})=>{
                if(!firstname || !email || !password || !vehicleType || !NumberPlate || !capacity){
                    throw new Error('These fields which are name , email and password are required')
                }
                const captain = captainModel.create({
                    fullname:{
                        firstname,
                        lastname,
                    },
                    email,
                    password,

                    vehicle:{
                            NumberPlate,
                            capacity,
                            vehicleType
                    },
                })

                return captain;
}
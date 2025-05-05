const usermodel = require('../models/user.model');

module.exports.createUser = async ({firstname , lastname , email , password}) => {
            if(!firstname || !email || !password){
                throw new Error('These fields which are name , email and password are required')
            }

            const user = usermodel.create({
                fullname:{
                    firstname,
                    lastname
                },
                email,
                password
            })

            return user;
}
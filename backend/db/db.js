const mongoose = require('mongoose');

function connecttodb () {
    mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("DB connected")
    }).catch(err => console.log("The error encountered is" , err))
}

module.exports = connecttodb;
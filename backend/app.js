const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const userroutes = require('../backend/routes/user.routes')
const captainroutes = require('../backend/routes/captain.routes');
const express = require('express');
const app = express();
const connecttodb = require('./db/db')
const cookie_parser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookie_parser());

connecttodb();

app.get('/' , (req,res) => {
    res.send("Hello World")
})

app.use('/users' , userroutes);

app.use('/captains',captainroutes);

module.exports = app;
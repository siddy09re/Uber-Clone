const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const userroutes = require('../backend/routes/user.routes')
const captainroutes = require('../backend/routes/captain.routes');
const rideroutes = require('../backend/routes/ride.routes');
const express = require('express');
const app = express();
const connecttodb = require('./db/db')
const cookie_parser = require('cookie-parser');

app.use(cors({
  origin: ['http://localhost:5173', 'https://admin.socket.io','https://p1s34wmb-5173.inc1.devtunnels.ms'], 
   credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookie_parser());

connecttodb();

app.get('/' , (req,res) => {
    res.send("Hello World")
})

app.use('/users' , userroutes);

app.use('/captains',captainroutes);

app.use('/rides' , rideroutes);

module.exports = app;
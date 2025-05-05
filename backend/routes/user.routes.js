const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const usercontroller = require('../controllers/user.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min : 3}).withMessage('First name should be atleast 3 characters bro'),
    body('password').isLength({min : 6}).withMessage('Password should be atleast 6 word char')
],
usercontroller.registeruser
)

router.post('/login' , [
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').notEmpty().withMessage('Please provide a valid password')
],
usercontroller.loginuser
)

router.get('/profile' , authMiddleware.Userauthorization ,usercontroller.getuserprofile)

router.get('/logout' , authMiddleware.Userauthorization , usercontroller.logoutuser )

module.exports = router;
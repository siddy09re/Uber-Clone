const express = require('express');
const router = express.Router();
const passwordcontroller = require('../controllers/password.controller')


router.post('/otp' , passwordcontroller.emailsent)

// router.post('/captain' , passwordcontroller.captainemailsent)

router.post('/validate', passwordcontroller.validateotp)



router.post('/user-password-change' , passwordcontroller.userpasswordchange)

router.post('/captain-password-change' , passwordcontroller.captainpasswordchange)

module.exports = router;
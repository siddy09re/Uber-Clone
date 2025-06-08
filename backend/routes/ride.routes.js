const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const rideController = require('../controllers/ride.controller')
const authMiddleware = require('../middleware/auth.middleware')
const paymentController = require('../controllers/payment.controller');

router.post('/createRide' , [
    authMiddleware.Userauthorization,
    body('pickup').notEmpty().withMessage('Pickup location is required'),
    body('destination').notEmpty().withMessage('Dropoff location is required'),
    body('distance').notEmpty().withMessage('Distance is required'),
    body('duration').notEmpty().withMessage('Enter the duration of jounrey'),
    body('fare').notEmpty().withMessage('Enter fare amount in backend'),
    body('pickupcoord').notEmpty().withMessage('Enter the pickup corrdinates'),
    body('destinationcoord').notEmpty().withMessage('Enter the destinaton Coords'),
    body('vehicleType').notEmpty().withMessage('Give the vehicle Type brooo')

],
rideController.createRide)

router.post('/generateFare',[
    body('distance').notEmpty().withMessage('Distance is required'),
],
    rideController.getTimeandFare
)

router.post('/CheckOTP', [
    body('data')
      .notEmpty().withMessage('OTP is missing')
  ] , rideController.getOTP)


router.post('/payment',paymentController.paymement )

module.exports = router;
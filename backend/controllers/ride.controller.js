const {validationResult} = require('express-validator');
const rideService = require('../services/ride.service')
const ridemodel = require('../models/ride.model');
const usermodel = require('../models/user.model');
const {sendMessageToSocketId } = require('../socket');

module.exports.getTimeandFare = async (req,res,next) => {

    const { distance } = req.body;

    if(!distance){
        return res.status(400).json({message : "Distance is required"});
    }

    // const fare = await rideService.createRide({pickup,destination , distance});
    const ridedetails = await rideService.generateTimeandFare(distance)

    res.status(200).json({distance , ridedetails});
}

module.exports.createRide = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors})
    }
    try{

        const user_id = req.user;

        const journey = {user_id, ...req.body};
   
        const response = await rideService.createRide(journey);
        
        res.status(200).json(response);  

        // the below code send captains of recent user who created ride , but as we dont have a need right now , so ya

      //  const vehicleType = response.vehicleType ;
      //   // const pickupcoord = await rideService.getCaptainsInTheRadius(location)   , dont forget to add this 

      //   const location= {
      //       "lat": 23.022505,
      //       "lng": 72.5713621
      //     } //pickup location

      //     const getcaptains = await rideService.getCaptainsInTheRadius(location.lat , location.lng , 5 , vehicleType);

      //     const UserSocketId = await usermodel.findById(response.user);
      //     console.log("User Socket id is" , UserSocketId.socketId)

      //     const ridedetails = {
      //       "ride" : response,
      //       "socketId" : UserSocketId.socketId,
      //     }

      //     //giving all info to all captains of user
      //     getcaptains.forEach(captain => {
      //       const captainSocketId = captain.socketId;
          
      //       if (captainSocketId) {
      //         sendMessageToSocketId(captainSocketId , {
      //           event: 'ride-request',
      //           data: ridedetails
      //       });
      //       }
      //     });

          
    }catch(err){
        console.log("the error in ride ciontroller ", err)
    }

}

module.exports.fetchNearbyUsers = async (req, res, next) => {
    try {
      const CaptainDetails = req.body;
     
  
      // Step 1: Extract the nested CaptainInfo
      const { CaptainInfo } = CaptainDetails;
  
      // Step 2: Make sure location and vehicle exist before accessing them
      if (
        !CaptainInfo ||
        !CaptainInfo.location ||
        !CaptainInfo.location.coordinates ||
        !CaptainInfo.vehicle
      ) {
        return res.status(400).json({ error: "Invalid captain info provided" });
      }
  
      // Step 3: Extract values safely
      const lng = CaptainInfo.location.coordinates[0];
      const lat = CaptainInfo.location.coordinates[1];
      const vehicleType = CaptainInfo.vehicle.vehicleType;
  
      // Step 4: Fetch nearby users
      const response = await rideService.getUsersInTheRadius(lat, lng, 10, vehicleType);
  
      // Step 5: Send response
      res.status(200).json( response );
  
    } catch (err) {
      console.log("The error is", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  };

module.exports.getOTP = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
      console.log("Error found in otp middleware" , errors);
    }

    const data = req.body;

    const Ridedetails = await ridemodel.findById(data.rideId).select('+otp');

    if(data.OTP == Ridedetails.otp){
      res.status(200).json("Success")
    }else{
      res.status(400).json("Invalid OTP")
    }
  }



  


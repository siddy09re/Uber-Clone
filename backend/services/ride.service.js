const ridemodel = require('../models/ride.model');
const crypto = require("crypto");
const captainModel = require('../models/captain.model');

module.exports.generateTimeandFare = async (distance) => {
    try {
        // Define vehicle types
        const vehicleTypes = {
            Car: { speed: 45, pricePerKm: 20 },
            Bike: { speed: 35, pricePerKm: 10 },
            Auto: { speed: 25, pricePerKm: 15 },
        };

        // Helper function to calculate time (in minutes) and fare
        const calculateDetails = (speed, pricePerKm) => {
            const timeInHours = distance / speed;
            const timeInMinutes = Math.round(timeInHours * 60);
            const fare = Math.round(distance * pricePerKm);
            return { timeInMinutes, fare };
        };

        // Build ride details for each vehicle type
        const rideDetails = {};

        for (const type in vehicleTypes) {
            const { speed, pricePerKm } = vehicleTypes[type];
            rideDetails[type] = calculateDetails(speed, pricePerKm);
        }
        return rideDetails;

    } catch (error) {
        console.error("Error creating ride:", error);
        throw error;
    }
};


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async (journey) => {

    const ride = ridemodel.create({
        user : journey.user_id,
        pickup : journey.pickup,
        destination : journey.destination,
        pickupcoord: {
            type: "Point",
            coordinates: journey.pickupcoord // must already be [lng, lat]
        },
        destinationcoord: {
            type: "Point",
            coordinates: journey.destinationcoord // must already be [lng, lat]
        },
        duration : journey.duration,
        distance : journey.distance,
        fare : journey.fare,
        vehicleType : journey.vehicleType,
        otp : getOtp(4),
    })

    return ride;

}

module.exports.getCaptainsInTheRadius = async (lat, lng, radius , vehicleType) => {

    // radius in km
    const captains = await captainModel.find({
        'vehicle.vehicleType': vehicleType,
        status : 'inactive',
        location: {
            $geoWithin: {
                $centerSphere: [ [ lng, lat ], radius / 6371 ]
            }
        }
    });

    return captains;
}

module.exports.getUsersInTheRadius = async (lat , lng ,radius , vehicleType) => {

    const Users = await ridemodel.find({
        vehicleType : vehicleType,
        status : "pending",
        pickupcoord: {
            $geoWithin: {
                $centerSphere: [ [ lng, lat ], radius / 6371 ]
            }
        }
    })

    return Users;

    
}

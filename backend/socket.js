const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const {instrument} = require('@socket.io/admin-ui');
const ridemodel = require('./models/ride.model');


let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: ['http://localhost:5173', 'https://admin.socket.io','https://p1s34wmb-5173.inc1.devtunnels.ms'], 
            methods: [ 'GET', 'POST' ],
            credentials: true 
        }
    });

    instrument(io , {auth : false , mode: "development"})

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log("data in socket" , data);

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log("User socket id is " , socket.id)
                console.log("socket_id added of user");
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log("socketId has been added in sided")
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.lat || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }
           

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: "Point",
                    coordinates: [location.lng, location.lat] // [longitude, latitude]
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });



        socket.on('CancelRide', async (rideId) => {
            try {
              console.log("The cancelled ride data is", rideId);

          
              const deletedRide = await ridemodel.findByIdAndDelete(rideId);
              
          
              if (deletedRide) {
                console.log("Ride deleted successfully:", deletedRide);
               
              } else {
                console.log("Ride not found.");
              }
          
            } catch (error) {
              console.error("Error deleting ride:", error);          
            }
          });


          socket.on('ride-accepted', async (UserIdAndCapDetails) => {
            try {
              console.log("🟢 Ride accepted details:", UserIdAndCapDetails);
          
              // 1. Fetch user socket
              const UserSocketId = await userModel.findById(UserIdAndCapDetails.userId).select('socketId');
              const socketId = UserSocketId?.socketId;
              console.log("📨 User socket ID:", socketId);
          
              // 2. Fetch captain socket
              const CaptainSocketId = await captainModel.findById(UserIdAndCapDetails.CaptainInfo._id).select('socketId');
              const CapSocketId = CaptainSocketId?.socketId;
              console.log("📨 Captain socket ID:", CapSocketId);
          
              // 3. Emit to user
              if (socketId) {
                sendMessageToSocketId(socketId, {
                  event: "AcceptedDriver",
                  data: {
                    CaptainInfo: UserIdAndCapDetails.CaptainInfo,
                    
                  }
                });
                console.log("✅ AcceptedDriver sent to user");
              } else {
                console.log("❌ No user socket ID");
              }
          
              // 4. Emit to captain (cancel others) after delay
            //   if (CapSocketId) {
            //     setTimeout(() => {
            //       sendMessageToSocketId(CapSocketId, {
            //         event: "CancelComparison",
            //         data: { success: true }
            //       });
            //       console.log("✅ CancelComparison sent to captain after delay");
            //     }, 500);
            //   } else {
            //     console.log("❌ No captain socket ID");
            //   }
          
            //   // 5. Perform DB updates separately (non-blocking)
            ridemodel.findByIdAndUpdate(
                UserIdAndCapDetails.rideId,
                {
                  status: 'accepted',
                  captain: UserIdAndCapDetails.CaptainInfo._id
                },
                { new: true }
              ).then(() => console.log(" Ride updated")).catch(console.error);
              
              captainModel.findByIdAndUpdate(
                UserIdAndCapDetails.CaptainInfo._id,
                { status: 'active' }
              ).then(() => console.log(" Captain updated")).catch(console.error);


          
            } catch (err) {
              console.log("❌ ride-accepted error:", err);
            }
          });
          
          
          socket.on('RideConfirmed' , async(data) => {
          
            const UserSocketId = await userModel.findById(data.userId).select('socketId');
            const socketId = UserSocketId?.socketId;
            sendMessageToSocketId(socketId, {
                        event: "RideConfirmedUser",
                        data: { success: true }
                      });

          })

          socket.on('DriverDistance' , async(value) => {
          
            const UserSocketId = await userModel.findById(value.TravelDetails.user).select('socketId');
            const socketId = UserSocketId?.socketId;
            sendMessageToSocketId(socketId , {
              event: "DistanceSharing",
              data: {
                         DriverDistance : value.DriverDistance,
              }
            })
          })

    }); 
}



const sendMessageToSocketId = (socketId, messageObject) => {


    console.log("Send message%%%%",socketId , messageObject)

    
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };
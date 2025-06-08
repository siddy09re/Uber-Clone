import React, { useEffect , useContext, useState} from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { GiPathDistance } from "react-icons/gi";
import { FaArrowDown } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { SetTravelDetails } from '../../Redux/CaptainDetailsSlice';
import RideCanceledImage from '../../assets/RideCancelled.png'
import { SocketContext } from '../context/SocketContext';




const AvailableRide = ({setavailableRide , setconfirmRide , setpickupcoord , setdestinationcoord  ,setShowDriverMarker }) => {

  const TravelDetails  = useSelector((state) => state.CaptainDetails.TravelDetails)
  const FetchedUserDetails = useSelector((state) => state.CaptainDetails.FetchedUserDetails);
  const CaptainInfo = useSelector((state) => state.CaptainDetails.CaptainDetails);
  const [Comparison , setComparison] = useState(true);

  console.log("The TravelDetails which i got in rides" , TravelDetails);
  console.log("Comparison value in available ride is" , Comparison);


  const dispatch = useDispatch();
  const {socket} = useContext(SocketContext);
  const DriverDistance = useSelector((state) => state.CaptainDetails.Distance);


  const handleAccept = () => {
  
    setavailableRide(false);
    setComparison(false);
    setShowDriverMarker(true);

    socket.emit('ride-accepted' , {userId: TravelDetails.user, rideId : TravelDetails._id ,CaptainInfo });
    setconfirmRide(true);
  }

  const handleIgnore = () => {
    setpickupcoord(null);
    setdestinationcoord(null);
    setavailableRide(false);
    dispatch(SetTravelDetails(null));
}


// useEffect(() => {
//   if (!socket) {
//     console.log("🛑 Socket not available");
//     return;
//   }

//   const handleCancelComparison = async () => {
//     console.log("🚫 Cancel Comparison is called");
//     setComparison(false);
//   };

  
//   socket.on("CancelComparison", handleCancelComparison);

//   // Cleanup to prevent duplicate listeners
//   return () => {
//     console.log("🧹 Cleaning up CancelComparison listener");
//     socket.off("CancelComparison", handleCancelComparison);
//   };
// }, [socket]);






useEffect(() => {
  if (!Comparison) return; // run only when Comparison is true

  if (!TravelDetails || !FetchedUserDetails || FetchedUserDetails.length === 0) return;

  const exists = FetchedUserDetails.some(user => user._id === TravelDetails._id);

  if (!exists) {
    dispatch(SetTravelDetails(null));
  }

}, [Comparison, TravelDetails, FetchedUserDetails, dispatch]);


return (
  
            <div className='z-20'>
              {
                  TravelDetails ?  


                <div className='w-[100%] bg-white  px-5 py-3'> 

                  <div className='w-full flex justify-center '>
                    <IoIosArrowDown className='h-10' onClick={() => setavailableRide(false)}/>
                  </div>
  
                  <h1 className='font-semibold w-full text-2xl'>New Ride Available </h1>

               

                  <div className='flex gap-3 items-center my-2 border-b-2 p-3 justify-center'>
                     
                      <div className='text-[20px] gap-3 flex flex-col items-center'>
                          <h2>{TravelDetails?.pickup}</h2>
                          <FaArrowDown/>
                          <h3>{TravelDetails?.destination}</h3>
                      </div>
                  </div>


                  <div className='flex gap-3 items-center my-2 border-b-2 p-3'>
                     <div className='text-[20px] gap-3 flex  items-center'>
                         <GiPathDistance className='text-[30px] font-bold'/>
                         <h2>{TravelDetails?.distance} KM</h2>  
                     </div>
                 </div>


                  <div className='flex gap-2 items-center my-2 border-b-2 p-3'>
                      <FaRupeeSign className='text-[25px]'/>
                      <div className='text-[20px]'>
                          <h2>{TravelDetails?.fare}</h2>
                      </div>
                  </div>

                  <button className='bg-green-400 w-full px-3 py-2 text-2xl rounded-lg my-4'
                  onClick={() => handleAccept()}>Accept</button>
                  <button className='bg-gray-300 w-full px-3 py-2 text-2xl rounded-lg' 
                  onClick={() => handleIgnore() }>Ignore</button>

                </div> 
      :  
                <div className='min-h-[400px] flex items-center flex-col bg-gray-50  py-6'>

                
                <div className='w-full flex justify-center items-center mb-4'>
                  <IoIosArrowDown className='h-10 w-10 text-gray-500 cursor-pointer hover:text-gray-700 transition' onClick={() => setavailableRide(false)} />
                </div>  
              
               
                <img src={RideCanceledImage} className='w-full  mb-6' alt="Ride Cancelled" />
              
               
                <h1 className='text-xl font-semibold text-gray-700 text-center'>User just cancelled the ride</h1>
              
              </div>
    

              }
                 
    </div>
    
  )
}

export default React.memo(AvailableRide);
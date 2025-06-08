import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { SelectedVehicleDetails } from '../Redux/SelectedVehicleSlice';
import { SocketContext } from "../Pages/context/SocketContext";
import { useContext } from 'react';

const LookingForDriver = ({setLookingForDriverstate}) => {
     const selectedvehicle = useSelector((state) => state.SelectedVehicle.SelectedVehicle);
     const RideDetails = useSelector((state) => state.SelectedVehicle.RideDetails);
     console.log("the ride details are" ,RideDetails);
     const dispatch = useDispatch();
       const {socket} = useContext(SocketContext);


     const handleCancelRide = () => {


        socket.emit('CancelRide' , RideDetails._id);
      
      setLookingForDriverstate(false)
      dispatch(SelectedVehicleDetails(null)); 
       
  }


  return (
    <div>
       
    <div className='w-[100%] bg-white z-20 px-5'>
               
                <div className='w-full flex justify-center '>
                  <IoIosArrowDown className='h-10' onClick={() => setLookingForDriverstate(false)}/>
                </div>

                <h1 className='text-center w-full text-2xl'> Looking for a driver</h1>

                <div className='my-2 border-b-2 ' >
                    <img src={selectedvehicle?.image} className='w-full' />
                </div>
                
                <div className='flex gap-2 items-center my-2 border-b-2 p-3'>
                  <FaLocationDot className='w-8 h-8'/>
                  <p className='text-lg '>{selectedvehicle?.duration} Mins</p>
                </div>

                <div className='flex gap-2 items-center my-2 p-3'>
                  <FaRupeeSign  className='w-8 h-8'/>
                  <p className='text-lg '>{selectedvehicle?.price}</p>
                </div>
    </div>

                     <div className='w-full px-3 py-4'>
                                    <button className='bg-gray-400 w-full px-3 py-2 text-lg rounded-lg' onClick={() => 
                                   handleCancelRide()}> Cancel </button>
                      </div>

    </div>
  )
}

export default React.memo(LookingForDriver);
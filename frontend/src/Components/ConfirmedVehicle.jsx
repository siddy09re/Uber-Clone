import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { BsArrowDownCircleFill } from "react-icons/bs";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {SelectedVehicleDetails } from '../Redux/SelectedVehicleSlice';
import { SetRideDetails } from '../Redux/SelectedVehicleSlice';



const ConfirmedVehicle = ({setselectedvehicle , setLookingForDriverstate , pickup , destination , pickupcoords , destinationcoords , distance }) => {
   const selectedvehicle = useSelector((state) => state.SelectedVehicle.SelectedVehicle);
   const dispatch = useDispatch();
   console.log(selectedvehicle)
   const token = localStorage.getItem('Usertoken');

   const handleConfirm = async () =>{

    const values ={
      pickup : pickup,
      pickupcoord : pickupcoords,
      destination : destination,
      destinationcoord : destinationcoords,
      distance : distance,
      fare : selectedvehicle.price,
      duration : selectedvehicle.duration,
      vehicleType : selectedvehicle.vehicleType
    }
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/createRide`,
        values, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
          if(response.status === 200){
            const data = response.data;
            console.log("the data after confimring is ",data);
            setselectedvehicle(false);    
            setLookingForDriverstate(true);
            dispatch(SetRideDetails(data));
          }
    }catch(err){
      console.log("Errors" , err);
    }
    
      
    
   }
  
  return (
    <div className='w-[100%] bg-white z-20 px-5'>

                <div className='w-full flex justify-center '>
                  <IoIosArrowDown className='h-10' onClick={() => setselectedvehicle(false)}/>
                </div>

                <div className='my-2 border-b-2 ' >
                    <img src={selectedvehicle?.image} className='w-full' />
                </div>

                <h1 className='w-full flex flex-col items-center gap-3 text-[20px]
                py-3 border-b-2 pl-3'>{pickup} <BsArrowDownCircleFill  className='text-[28px]'/> {destination}</h1>
                
                <div className='flex gap-2 items-center my-2 border-b-2 p-3'>
                  <FaLocationDot className='w-8 h-8'/>
                  <p className='text-lg '> Total Duration : {selectedvehicle?.duration} Mins</p>
                </div>

                <div className='flex gap-2 items-center my-2 p-3'>
                  <FaRupeeSign  className='w-8 h-8'/>
                  <p className='text-lg '>{selectedvehicle?.price}</p>
                </div>

                <div className='w-full px-3 py-4'>
                  <button className='bg-green-400 w-full px-3 py-2 text-lg rounded-lg' onClick={() => 
                   handleConfirm()}> Confirm</button>
                </div>

                <div className='w-full px-3 py-4'>
                  <button className='bg-gray-400 w-full px-3 py-2 text-lg rounded-lg' onClick={() => 
                  {setselectedvehicle(false)
                  dispatch(SelectedVehicleDetails(null)); 
                   }}> Cancel </button>
                </div>
    </div>
  )
}

export default React.memo(ConfirmedVehicle);
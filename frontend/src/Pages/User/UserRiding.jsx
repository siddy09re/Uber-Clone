import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';

import { FaRupeeSign } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Link } from 'react-router-dom';

import mapboxgl from 'mapbox-gl';
import MapBoxContainer from './MapBoxContainer';
import { useRef } from 'react';
import { SocketContext  } from '../context/SocketContext';
import axios from 'axios';


// import {loadStripe} from '@stripe/stripe-js';



const UserRiding = () => {
  const selectedvehicle = useSelector(state => state.SelectedVehicle?.SelectedVehicle);
  const state = useSelector(state => state);
  console.log(state);
    const mapRef = useRef(null);
    const UserCapInfo = useSelector((state) => state.SelectedVehicle.UserSideCapDetails)
  
    const RideDetails = useSelector((state) => state.SelectedVehicle?.RideDetails);
      console.log(RideDetails , "the value when user ride load")
      const [latitude,setlatitude] = useState(null);
      const [longtitude , setlongtitude] = useState(null);
      const [finaldistance , setfinaldistance] = useState(0);



 useEffect(() => {

  const updateLocation = async () => {
    try {
      const response = await axios.get('https://ipwho.is/');
      const { latitude, longitude } = response.data;
      setlatitude(latitude);
      setlongtitude(longitude);

      console.log("Location from user side ipwho.is:", latitude, longitude);
    }catch(err){
      console.log("Error from " ,err);
    }
  }

   // Run immediately
   updateLocation();
  
   // Set interval to run every 10 seconds
   const intervalId = setInterval(updateLocation, 7000);
 
   // Clear interval on unmount
   return () => clearInterval(intervalId);

 } , [])

 console.log("latitude" , latitude , "longtitude" , longtitude , "Ridedetails" , RideDetails)

  const details = {
    Pickup : RideDetails?.pickup,
    Destination : RideDetails?.destination,
    Fare : RideDetails?.fare
  }

  console.log("the details which i am sending through front are" , details);

  const MakeAPayment = async () => {
    try {
      // const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/payment`, details, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const sessionUrl = response.data.url;
  
      console.log("the response from payment" , response.data);
      window.location.href = sessionUrl;
  
    } catch (error) {
      console.error("Error starting payment:", error);
    }
  };
  
  return (
       <div>
              
           <div className='w-[100%] bg-white z-20  relative'>

                <div className="h-screen relative overflow-hidden">

                <div className='absolute top-0 right-0 p-3 rounded-full bg-slate-100'>
                       <Link to='/User-screen'><IoHome className='w-8 h-8'/></Link>  
                </div>

                    <h1 className="absolute top-10 left-5 text-[44px] ">Uber</h1>
                   
                    <MapBoxContainer  mapRef={mapRef} mapboxgl={mapboxgl} latitude={latitude} longtitude={longtitude} setdistance={setfinaldistance}
                   destinationcoord={RideDetails?.destinationcoord.coordinates} pickupcoord = {[longtitude,latitude]} />

                </div>

                <div className='w-full bottom-0 px-2 z-10 absolute bg-white'>
       
                       <div className='my-2 border-b-2 flex justify-between items-center px-4' >
                           <div className='flex items-center'>
                               <img src={selectedvehicle?.image} className='w-20  h-20 rounded-full' />
                               <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-zu52lvf7RuyygUgHpXInxtwj
                               mdTWtl8N6w&s' className='w-20  h-20 rounded-full'/>
                           </div>
                           <div className='flex flex-col justify-start'>
                               <p><span>{UserCapInfo?.fullname.firstname}</span> <span>{UserCapInfo?.fullname.lastname}</span></p>
                               <p>{UserCapInfo?.vehicle.NumberPlate}</p>
                             
                               
                           </div>
                         
                       </div>
   
                  
                       
                       <div className='flex gap-2 items-center my-2 border-b-2 p-3'>
                         <FaLocationDot className='w-8 h-8'/>
                         <p className='text-lg '>{finaldistance} Km away</p>
                       </div>
       
                       <div className='flex gap-2 items-center my-2 p-3'>
                         <FaRupeeSign  className='w-8 h-8'/>
                         <p className='text-lg '>{selectedvehicle?.price}</p>
                       </div>

                       <div className='w-full px-3 py-2'>
                                <button className='px-3 py-2 bg-green-400 w-full rounded-lg'
                                onClick={() => MakeAPayment()}> Make a Payment</button>
                       </div>
            </div>
           </div>
       
       
       
           </div>
  )
}

export default UserRiding
import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';

import { FaRupeeSign } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { Link } from 'react-router-dom';

const UserRiding = () => {
    const selectedvehicle = useSelector((state) => state.SelectedVehicle.SelectedVehicle);
  return (
       <div>
              
           <div className='w-[100%] bg-white z-20  relative'>

             

                <div className="h-screen relative overflow-hidden">

                <div className='absolute top-0 right-0 p-3 rounded-full bg-slate-100'>
                       <Link to='/User-screen'><IoHome className='w-8 h-8'/></Link>  
                </div>

                    <h1 className="absolute top-10 left-5 text-[44px] ">Uber</h1>
                    <img
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    className="w-full h-full object-cover max-h-screen"
                    />
                </div>

                <div className='w-full bottom-0 px-2 z-10 absolute bg-white'>
       
                      
       
                       <div className='my-2 border-b-2 flex justify-between ' >
                           <div className='flex items-center'>
                               <img src={selectedvehicle?.image} className='w-20  h-20 rounded-full' />
                               <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-zu52lvf7RuyygUgHpXInxtwj
                               mdTWtl8N6w&s' className='w-20  h-20 rounded-full'/>
                           </div>
                           <div className='flex flex-col justify-start'>
                               <p>Driver name</p>
                               <p>Vehicles NumberPlate</p>
                               <p>Vehicle Description</p>
                               <p>Rating</p>
                           </div>
                         
                       </div>
   
                  
                       
                       <div className='flex gap-2 items-center my-2 border-b-2 p-3'>
                         <FaLocationDot className='w-8 h-8'/>
                         <p className='text-lg '>{selectedvehicle?.distance}</p>
                       </div>
       
                       <div className='flex gap-2 items-center my-2 p-3'>
                         <FaRupeeSign  className='w-8 h-8'/>
                         <p className='text-lg '>{selectedvehicle?.price}</p>
                       </div>

                       <div className='w-full px-3 py-2'>
                                <button className='px-3 py-2 bg-green-400 w-full rounded-lg'> Make a Payment</button>
                       </div>
            </div>
           </div>
       
       
       
           </div>
  )
}

export default UserRiding
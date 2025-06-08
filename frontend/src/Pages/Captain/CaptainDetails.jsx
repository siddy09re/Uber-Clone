import React from 'react'
import { FaClock } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { BsCashCoin } from "react-icons/bs";
import { useSelector } from 'react-redux';

const CaptainDetails = () => {

  const CaptainInfo = useSelector((state) => state.CaptainDetails.CaptainDetails);
  // console.log(CaptainInfo);
  return (
    <div>

                        <div className='my-2  flex gap-3 items-center' >

                           <div className='flex items-center'>
                            
                               <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-zu52lvf7RuyygUgHpXInxtwj
                               mdTWtl8N6w&s' className='w-24  h-24 m-2 rounded-full'/>
                           </div>

                           <div className='flex flex-col justify-start'>
                               <p>{CaptainInfo.fullname.firstname} {CaptainInfo.fullname.lastname}</p>
                               <p>Vehicles NumberPlate :- {CaptainInfo.vehicle.NumberPlate}</p>
                               <p>Vehicle Type :- {CaptainInfo.vehicle.vehicleType}</p>
                           </div>
                         
                        </div>
   
                  
                       <div className='my-5 px-6 py-10 bg-orange-400 flex justify-between rounded-3xl'>

                              <div className='flex flex-col items-center'>
                                <FaClock className='text-4xl' /> {/* or text-5xl, text-6xl */}
                                <h2>14hrs</h2>
                              </div>

                              <div className='flex flex-col items-center'>
                                <GiPathDistance className='text-4xl' />
                                <h2>200km</h2>
                              </div>

                              <div className='flex flex-col items-center'>
                                <BsCashCoin  className='text-4xl' />
                                <h2 >₹ 5000</h2>
                              </div>
                       </div>
    </div>
  )
}

export default CaptainDetails
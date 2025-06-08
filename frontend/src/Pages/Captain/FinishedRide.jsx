import React from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { FaArrowDown } from "react-icons/fa";

const FinishedRide = ({setFinishedrideInfo}) => {

    const TravelDetails  = useSelector((state) => state.CaptainDetails.TravelDetails)
  return (
      <div>
              
                   
                <div className='w-[100%] bg-white z-20 px-5 py-3'>
                           
                            <div className='w-full flex justify-center '>
                              <IoIosArrowDown className='h-10' onClick={() => setFinishedrideInfo(false)}/>
                            </div>
            
                            <h1 className='font-semibold w-full text-2xl'>Proceed the Payment </h1>
    
                        
    
                           
                                 <div className='flex gap-3 items-center my-2 border-b-2 p-3 justify-center'>
                                                    
                                                     <div className='text-[20px] gap-3 flex flex-col items-center'>
                                                         <h2>{TravelDetails?.pickup}</h2>
                                                         <FaArrowDown/>
                                                         <h3>{TravelDetails?.destination}</h3>
                                                     </div>
                                 </div>
    
                            <div className='flex gap-3 items-center my-2 border-b-2 p-3'>
                                <FaRupeeSign className='text-[40px]'/>
                                <div className='text-[20px]'>
                                    <h2>{TravelDetails.fare}</h2>
                                </div>
                            </div>
    
                            <button className='bg-green-400 w-full px-3 py-2 text-2xl rounded-lg my-4'
                            onClick={() =>alert("Payment Successfull")}>Proceed Payment</button>
                           
        
                </div>
        </div>
  )
}

export default React.memo(FinishedRide);
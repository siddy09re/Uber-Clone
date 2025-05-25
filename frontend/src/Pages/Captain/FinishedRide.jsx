import React from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const FinishedRide = ({setFinishedrideInfo}) => {
  return (
      <div>
              
                   
                <div className='w-[100%] bg-white z-20 px-5 py-3'>
                           
                            <div className='w-full flex justify-center '>
                              <IoIosArrowDown className='h-10' onClick={() => setFinishedrideInfo(false)}/>
                            </div>
            
                            <h1 className='font-semibold w-full text-2xl'>Proceed the Payment </h1>
    
                            <div className='px-3 py-4 flex items-center justify-between bg-yellow-200 rounded-3xl my-5'>
                                <div className='flex items-center gap-3'>
                                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa4xjShh4ynJbrgYrW_aB4lhKSxeMzQ3cO_A&s' 
                                    className='w-20 rounded-full h-20'/>
    
                                    <h2>Client name</h2>
                                </div>
                                <div className='text-center'>
                                            <h2>Distance KM</h2>    
                                </div>
                            </div>
    
                            <div className='flex gap-3 items-center my-2 border-b-2 p-3'>
                                <FaLocationDot className='text-[40px]'/>
                                <div className='text-[20px]'>
                                    <h2>User's Location</h2>
                                    <h3>User's Location</h3>
                                </div>
                            </div>
    
                            <div className='flex gap-3 items-center my-2 border-b-2 p-3'>
                                <FaRupeeSign className='text-[40px]'/>
                                <div className='text-[20px]'>
                                    <h2>Fare</h2>
                                </div>
                            </div>
    
                            <button className='bg-green-400 w-full px-3 py-2 text-2xl rounded-lg my-4'
                            onClick={() =>alert("Payment Successfull")}>Proceed Payment</button>
                           
        
                </div>
        </div>
  )
}

export default React.memo(FinishedRide);
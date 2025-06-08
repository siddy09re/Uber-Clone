import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import { SetTravelDetails } from '../../Redux/CaptainDetailsSlice';
import RideCanceledImage from '../../assets/RideCancelled.png'
import { FaArrowDown } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import axios from 'axios';


const OTPInput = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === length - 1 && newOtp.every(val => val)) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className='flex justify-center gap-2 my-4'>
      {otp.map((digit, index) => (
        <input
          key={index}
          type='text'
          maxLength='1'
          className='w-12 h-12 text-center border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-500 text-xl'
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(ref) => (inputRefs.current[index] = ref)}
          inputMode='numeric'
          pattern='[0-9]*'
        />
      ))}
    </div>
  );
};

//this is where actual component are build

const ConfirmationRide = ({ setconfirmRide  }) => {
  const navigate = useNavigate();

  const TravelDetails  = useSelector((state) => state.CaptainDetails.TravelDetails)
  const FetchedUserDetails = useSelector((state) => state.CaptainDetails.FetchedUserDetails);
  const [otpinput , setotpinput] = useState(null);
  const [otpError, setOtpError] = useState('');
  

const {socket} = useContext(SocketContext);

  const handleOtpComplete = (enteredOtp) => {
    console.log("Entered OTP:", enteredOtp);
    setotpinput(enteredOtp);
    // Do any OTP verification or navigation here
  };


  const handleconfirm = async () => {

    if(!otpinput) return ;


    const data = {
      rideId: TravelDetails._id,
      OTP: otpinput,
    };
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/CheckOTP`, data);
  
      if (response.status === 200) {
        console.log("OTP IS VALID");
        setOtpError(''); // clear any previous error

        socket.emit('RideConfirmed' , {userId : TravelDetails.user});

         navigate('/Captain-riding')
      }
    } catch (err) {
      console.log("Error in handle confirm", err);
  
      // Check if the error is a 400 from the backend
      if (err.response && err.response.status === 400) {
        setOtpError('Invalid OTP. Please try again.');
      } else {
        setOtpError('Something went wrong. Please try again later.');
      }
    }
  };
  

  return (
    <div className='z-10'>


    {
      TravelDetails ? 


      <div className='w-full bg-white px-5 py-3'>

      <div className='w-full flex justify-center'>
        <IoIosArrowDown className='h-10' onClick={() => setconfirmRide(false)} />
      </div>

      <h1 className='font-semibold text-2xl'>Confirm the Ride</h1>

     

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

      <div className='flex gap-3 items-center border-b-2 p-3'>
        <FaRupeeSign className='text-[40px]' />
        <div className='text-[20px]'>
          <h2>{TravelDetails.fare}</h2>
        </div>
      </div>

      {/* OTP Input */}
      <OTPInput onComplete={handleOtpComplete} />

      {otpError && (
        <p className="text-red-500 text-lg text-center mt-2">{otpError}</p>
      )}

      <div className='mt-5'>
        <button
          className='bg-green-400 w-full px-3 py-2 text-2xl rounded-lg my-4'
          onClick={() => handleconfirm()}>
          Start The Ride
        </button>
        <button
          className='bg-gray-300 w-full px-3 py-2 text-2xl rounded-lg'
          onClick={() => setconfirmRide(false)}>
          Ignore
        </button>
      </div>

    </div>

      :

         <div className='min-h-[400px] flex items-center flex-col bg-gray-50  py-6'>
        
                        
                      <div className='w-full flex justify-center'>
                      <IoIosArrowDown className='h-10' onClick={() => setconfirmRide(false)} />
                    </div>
                      
                       
                        <img src={RideCanceledImage} className='w-full  mb-6' alt="Ride Cancelled" />
                      
                       
                        <h1 className='text-xl font-semibold text-gray-700 text-center'>User just cancelled the ride</h1>
                      
                      </div>

    }


   
    </div>
  );
};

export default React.memo(ConfirmationRide);

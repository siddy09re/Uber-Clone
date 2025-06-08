import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';


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



const ForgotPassword = () => {
  const [otpinput , setotpinput] = useState(null);

    const handleOtpComplete = (enteredOtp) => {
        console.log("Entered OTP:", enteredOtp);
        setotpinput(enteredOtp);
        // Do any OTP verification or navigation her
      };


      const formik = useFormik({
        initialValues: {
          newPassword: '',
          confirmPassword: ''
        },
        validationSchema: Yup.object({
          newPassword: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('New Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required')
        }),
        onSubmit: async (values) => {
          try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forget/user`, {
              otp: otpInput,
              newPassword: values.newPassword
            });
    
            console.log('Response:', response.data);
          } catch (err) {
            console.log('Error in OTPSubmit', err);
          }
        }
      });



      const OTPSubmit =async() => {
            try{
                    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forget/user`)
            }catch(err){
                    console.log("Error in OTPSubmit", err);
            }
      }



      return (
        <div className='flex items-center justify-center h-screen'>
          <div className='px-4 py-5 border-2 border-gray-300 rounded-lg shadow-lg w-[350px]'>
            <p>Enter The OTP sent to your mail</p>
            <OTPInput onComplete={handleOtpComplete} />
    
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor='newPassword' className='text-[18px] block mb-1'>Enter your new Password</label>
                <input
                  id='newPassword'
                  name='newPassword'
                  type='password'
                  placeholder='New Password'
                  className='px-3 py-2 border-2 w-full rounded mb-1'
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <div className='text-red-500 text-sm'>{formik.errors.newPassword}</div>
                )}
    
                <label htmlFor='confirmPassword' className='text-[18px] block mt-3 mb-1'>Confirm new Password</label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  placeholder='Confirm New Password'
                  className='px-3 py-2 border-2 w-full rounded mb-1'
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className='text-red-500 text-sm'>{formik.errors.confirmPassword}</div>
                )}
              </div>
    
              <div className='w-full flex mt-4'>
                <button type='submit' className='mx-auto bg-green-200 px-4 py-2 rounded-xl text-lg'>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      );
};

export default ForgotPassword
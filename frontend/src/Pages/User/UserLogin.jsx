import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
// import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext'
import ButtonLoader from '../../Components/Loader/ButtonLoader';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";

const UserLogin = () => {
  

    const navigate = useNavigate();
    const [loginError , setloginError] = useState('');
    const[buttonloader,setbuttonloader] = useState(false);
    const [showpassword,setshowpassword] = useState(false);
    // const { user, setuser } = useContext(UserDataContext);



  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Logined User Data', values);
      setbuttonloader(true);

      try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, values);
        if(response.status === 200){
        const data = response.data;
        console.log("User Logined Successfully", data);
        localStorage.setItem('Usertoken' , data.token);
        // setuser(data.user);
        formik.resetForm();
        setbuttonloader(false);
        navigate('/User-screen');
      }
    }catch(err){
        console.log("Login Error", err);
        formik.resetForm();
        setbuttonloader(false);
        if(err.response && err.response.status === 400){
          setloginError('Invalid email or password');
        }else{
          setloginError('Something went wrong, please try again later');
        }
      }
    },
  });

  const handleForgetPassword = async() => {

     if (!formik.values.email) {
    setloginError('Please enter your email before proceeding to reset password.');
    return;
  }

    try{
     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forget/otp`, { email: formik.values.email });
      if(response.status === 200){
        console.log("Forget Password Email Sent Successfully",response.data);
        const token = response.data.token;
        localStorage.setItem('UserForgetToken', token);
        formik.resetForm();
        navigate('/forgot-password' , {
          state: { role : 'user' },
        });
      }
    }catch(err){
        console.log("Error in handleForgetPassword", err);
    }
  }

  return (
    <div className='flex flex-col justify-between h-[100dvh] px-6 py-12 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 '>
      <div>
         <h1 className=" text-[44px] z-10 italic font-bold">Savari</h1>

        <div className='flex flex-col justify-center px-9 mt-5'>
          <h1 className='font-bold underline text-[30px] w-full text-green-400 text-center mb-4'>Login</h1>
          
          <form className='w-full max-w-md' onSubmit={formik.handleSubmit}>
            <label htmlFor='email' className='text-[20px] block mb-2'>Email Address</label>
            <input
              placeholder='name@example.com'
              id='email'
              type='email'
              name='email'
              onChange={formik.handleChange}
              
              value={formik.values.email}
              className='px-3 py-2 border-2 w-full rounded-xl mb-1'
            />
            {formik.touched.email && formik.errors.email && (
              <div className='text-red-500 text-sm mb-3'>{formik.errors.email}</div>
            )}

            <label htmlFor='password' className='text-[20px] block mb-2 mt-5'>Password</label>
            <div className='relative'>
            <input
              placeholder='password'
              id='password'
              type={showpassword ? 'text' : 'password'}
              name='password'
              onChange={formik.handleChange}
            
              value={formik.values.password}
              className='px-3 py-2  border-2 w-full rounded-xl mb-1'
            />

                        <button
                            type="button"
                            onClick={() => setshowpassword(!showpassword)}
                            className=" absolute right-5 top-3 text-[20px]"
                          >
                            {showpassword ? <FaRegEye/> : <FaRegEyeSlash/> }
                          </button>

                           {formik.touched.password && formik.errors.password && (
                            <div className='text-red-500 text-sm mb-3'>{formik.errors.password}</div>
                          )}

                           <div onClick={() => handleForgetPassword ()} className='flex justify-end my-3'>
                          <p className='text-blue-500 underline'>Forget Password?</p>
                        </div>
            </div>
           

            <button className='bg-black text-white w-full px-3 py-2 rounded-xl mb-2 mt-5 flex gap-3 justify-center items-center' type='submit'>
              
              {buttonloader &&  <ButtonLoader/>}
              <p>Login</p></button>


              {loginError && (
                <p className="text-red-500 text-lg text-center mt-2">{loginError}</p>
              )}

            <Link to='/User-register'>
              New to Savari? <span className='text-blue-600'>Create an account</span>
            </Link>

           
          </form>
        </div>
      </div>

      <div>
        <button className='bg-orange-600 px-3 py-2 rounded-lg w-full text-white'
          onClick={() => {navigate('/Captain-login') , console.log("Join as a Captain")}}>
          Join as a Captain
        </button>
      </div>
    </div>
  );
};

export default UserLogin;

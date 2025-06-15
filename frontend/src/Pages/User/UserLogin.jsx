import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
// import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext'

const UserLogin = () => {
  

    const navigate = useNavigate();
    const [loginError , setloginError] = useState('');
  
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
      

      try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, values);
        if(response.status === 200){
        const data = response.data;
        console.log("User Logined Successfully", data);
        localStorage.setItem('Usertoken' , data.token);
        // setuser(data.user);
        formik.resetForm();
        navigate('/User-screen');
      }
    }catch(err){
        console.log("Login Error", err);
        formik.resetForm();
        if(err.response && err.response.status === 400){
          setloginError('Invalid email or password');
        }else{
          setloginError('Something went wrong, please try again later');
        }
      }
    },
  });

  const handleForgetPassword = async() => {
    try{
     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forget/otp`, { email: formik.values.email });
      if(response.status === 200){
        console.log("Forget Password Email Sent Successfully",response.data);
        const token = response.data.token;
        localStorage.setItem('UserForgetToken', token);
        formik.resetForm();
      navigate('/forgot-password');
      }
    }catch(err){
        console.log("Error in handleForgetPassword", err);
    }
  }

  return (
    <div className='flex flex-col justify-between h-screen px-6 py-12'>
      <div>
        <h1 className='text-[42px]'>Uber</h1>

        <div className='flex justify-center px-9 mt-10'>
          <form className='w-full max-w-md' onSubmit={formik.handleSubmit}>
            <label htmlFor='email' className='text-[24px] block mb-2'>What's your email</label>
            <input
              placeholder='name@example.com'
              id='email'
              type='email'
              name='email'
              onChange={formik.handleChange}
              
              value={formik.values.email}
              className='px-3 py-2 border-2 w-full rounded mb-1'
            />
            {formik.touched.email && formik.errors.email && (
              <div className='text-red-500 text-sm mb-3'>{formik.errors.email}</div>
            )}

            <label htmlFor='password' className='text-[24px] block mb-2'>Enter your Password</label>
            <input
              placeholder='password'
              id='password'
              type='password'
              name='password'
              onChange={formik.handleChange}
            
              value={formik.values.password}
              className='px-3 py-2 border-2 w-full rounded mb-1'
            />
            {formik.touched.password && formik.errors.password && (
              <div className='text-red-500 text-sm mb-3'>{formik.errors.password}</div>
            )}

            <button className='bg-black text-white w-full px-3 py-2 rounded-xl mb-2 mt-5' type='submit'>Login</button>


              {loginError && (
                <p className="text-red-500 text-lg text-center mt-2">{loginError}</p>
              )}

            <Link to='/User-register'>
              New Here? <span className='text-blue-600'>Create an account</span>
            </Link>

            <div onClick={() => handleForgetPassword ()}>
              <p className='text-blue-500 underline'>Forget Password?</p>
            </div>
          </form>
        </div>
      </div>

      <div>
        <button className='bg-green-300 px-3 py-2 rounded-lg w-full'
          onClick={() => {navigate('/Captain-login') , console.log("Join as a Captain")}}>
          Join as a Captain
        </button>
      </div>
    </div>
  );
};

export default UserLogin;

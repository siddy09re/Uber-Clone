import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import axios from 'axios';
// import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext'

const UserRegister = () => {

  const navigate = useNavigate();
  const [registerError , setregisterError] = useState(' ');

  // const { user, setuser } = useContext(UserDataContext)


  const validationSchema = Yup.object({
    fullname: Yup.object({
      firstname: Yup.string()
        .min(3, 'First name must be at least 3 characters')
        .required('First name is required'),
      lastname: Yup.string()
       
        .required('Last name is required'),
    }),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
  });


  const formik = useFormik({
    initialValues: {
      fullname:{
        firstname: '',
        lastname: '',
      },
      
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("User Register Data", values);

      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, values);
        if (response.status === 201) {
          const data = response.data;
          console.log("Registered Successfully:", data);
          localStorage.setItem('Usertoken' , data.token);
          // setuser(data.user);
          formik.resetForm();
          navigate('/User-screen');
        }
      } catch (err) {
        console.error("Registration error:", err);
        if(err.response && err.response.status === 400){
          setregisterError('Invalid registration details. Please check your input.');
        }else{
          setregisterError('Something went wrong, please try again later.');
        }
      }
    }
  }  );

  return (
    <div className='flex flex-col justify-between h-screen px-6 py-12'>
      <div>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-[42px]'>Uber</h1>
          <Link to='/Captain-register'><span className='text-blue-400'>Register as a Captain</span></Link>
        </div>

        <div className='flex justify-center px-9 mt-10'>
          <form className='w-full max-w-md' onSubmit={formik.handleSubmit}>
            <label htmlFor='firstname' className='text-[24px] block mb-2'>Enter your name</label>
            <div className='flex gap-2'>
              <div>
                <input
                  name='fullname.firstname'
                  placeholder='First Name'
                  type='text'
                  value={formik.values.fullname.firstname}
                  onChange={formik.handleChange}
                  className='px-3 py-2 border-2 w-full rounded mb-1'
                />
               <div className='text-red-600 text-sm mb-3'>
                  {formik.touched.fullname?.firstname && formik.errors.fullname?.firstname && (
                    <div>{formik.errors.fullname.firstname}</div>
                  )}
                </div>
              </div>

              <div>
                <input
                  name='fullname.lastname'
                  placeholder='Last Name'
                  type='text'
                  value={formik.values.fullname.lastname}
                  onChange={formik.handleChange}
                  className='px-3 py-2 border-2 w-full rounded mb-1'
                />
              <div className='text-red-600 text-sm mb-3'>
                {formik.touched.fullname?.lastname && formik.errors.fullname?.lastname && (
                  <div>{formik.errors.fullname.lastname}</div>
                )}
              </div>
              </div>
            </div>

            <label htmlFor='email' className='text-[24px] block mb-2'>What's your email</label>
            <input
              name='email'
              placeholder='name@example.com'
              type='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              className='px-3 py-2 border-2 w-full rounded mb-1'
            />
            <div className='text-red-600 text-sm mb-3'>
              {formik.errors.email && formik.touched.email && <div>{formik.errors.email}</div>}
            </div>

            <label htmlFor='password' className='text-[24px] block mb-2'>Enter your Password</label>
            <input
              name='password'
              placeholder='password'
              type='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              className='px-3 py-2 border-2 w-full rounded mb-1'
            />
            <div className='text-red-600 text-sm mb-3'>
              {formik.errors.password && formik.touched.password && <div>{formik.errors.password}</div>}
            </div>

            <button className='bg-black text-white w-full px-3 py-2 rounded-xl mb-2' type='submit'>Register</button>

                {registerError && (
                  <p className="text-red-500 text-lg text-center mt-2">{registerError}</p>
                )}


            <Link to='/User-login'>
              Already have an account? <span className='text-blue-600'>Login</span>
            </Link>
          </form>
        </div>
      </div>

      <p className='text-[12px] leading-tight text-justify'>
        By agreeing to this, you are accepting the terms and conditions of the Uber application.
        Uber will be able to access this information, and by registering, you are giving permission to it. Thank you.
      </p>
    </div>
  )
}

export default UserRegister

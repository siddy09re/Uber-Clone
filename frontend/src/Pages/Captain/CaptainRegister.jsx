import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
// import { CaptainDataContext } from '../context/CaptainContext'

const CaptainRegister = () => {

  const navigate = useNavigate();

// const {captain , setcaptain} = React.useContext(CaptainDataContext);

  const validationSchema = Yup.object({
    fullname: Yup.object({
      firstname: Yup.string()
        .min(3, 'First name must be at least 3 characters')
        .required('First name is required'),
      lastname: Yup.string()
        .min(3, 'Last name must be at least 3 characters')
        .required('Last name is required'),
    }),
    
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    vehicle: Yup.object({
      NumberPlate: Yup.string().required('Vehicle Number Plate is required'),
      capacity: Yup.string().required('Vehicle Capacity is required'),
      vehicleType: Yup.string().required('Vehicle Type is required')
    })
  });

  const formik = useFormik({
    initialValues: {
      fullname:{
        firstname: '',
        lastname: '',
      },
      
      email: '',
      password: '',
      vehicle:{
        NumberPlate: '',
        capacity: '',
        vehicleType: ''
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Captain Register Data", values);
      try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, values);

        if(response.status === 201){
          console.log("Captain Registered Successfully", response.data);
          localStorage.setItem('Captaintoken' , response.data.token);
          navigate('/Captain-screen');
        }
      }catch(err){
        console.log("Registration Error", err);
      }
     
     
    }
  });

  return (
    <div className='flex flex-col justify-between h-screen px-6 py-12'>
      <div>

        <div className='w-full flex justify-between items-center '>
          <img src='https://static.vecteezy.com/system/resources/previews/027/127/451/non_2x/uber-logo-uber-icon-transparent-free-png.png' width='200px' height='100%' />
          <Link to='/User-register'><span className='text-blue-400'>Register as a User</span></Link>
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
                      {formik.errors.fullname?.firstname && formik.touched.fullname?.firstname && <div>{formik.errors.fullname.firstname}</div>}
                     
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
                   
                      {formik.errors.fullname?.lastname && formik.touched.fullname?.lastname && <div>{formik.errors.fullname.lastname}</div>}
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

             <div className='flex flex-col gap-4 mb-7 '>
              <input
                name='vehicle.capacity'
                type="number"
                placeholder='Vehicle Capacity'
                value={formik.values.vehicle.capacity}
                onChange={formik.handleChange}
              
                className='bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              />
              <div className='text-red-600 text-sm'>
                {formik.touched.vehicle?.capacity && formik.errors.vehicle?.capacity}
              </div>

              <input
                name='vehicle.NumberPlate'
                type="text"
                placeholder='Vehicle Plate'
                value={formik.values.vehicle.NumberPlate}
                onChange={formik.handleChange}
        
                className='bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              />
              <div className='text-red-600 text-sm'>
                {formik.touched.vehicle?.NumberPlate && formik.errors.vehicle?.NumberPlate}
              </div>

              <select
                name='vehicle.vehicleType'
                value={formik.values.vehicle.vehicleType}
                onChange={formik.handleChange}
               
                className='bg-[#eeeeee] rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              >
                <option value="" disabled>Select Vehicle Type</option>
                <option value="Car">Car</option>
                <option value="Auto">Auto</option>
                <option value="Bike">Bike</option>
              </select>
              <div className='text-red-600 text-sm'>
                {formik.touched.vehicle?.vehicleType && formik.errors.vehicle?.vehicleType}
              </div>
            </div>


            <button className='bg-black text-white w-full px-3 py-2 rounded-xl mb-2' type='submit'>Register</button>
            <Link to='/Captain-login'>
              Already have an account? <span className='text-blue-600'>Login</span>
            </Link>
          </form>
        </div>
      </div>

      <p className='text-[12px] leading-tight text-justify'>By agreeing to this, you are accepting the terms and conditions of the Uber application. Uber will be able to access this information, and by registering, you are giving permission to it. Thank you.</p>
    </div>
  )
}

export default CaptainRegister

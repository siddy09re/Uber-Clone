import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
// import { CaptainDataContext } from '../context/CaptainContext'
import ButtonLoader from '../../Components/Loader/ButtonLoader'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";

const CaptainRegister = () => {

  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState( ' ');
  const[buttonloader,setbuttonloader] = useState(false);
   const [showpassword,setshowpassword] = useState(false);


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
    phonenumber : Yup.number().typeError('Phone number must be a number')
      .required('Phone number is required')
      .min(1000000000, 'Phone number must be at least 10 digits')
      .max(9999999999, 'Phone number must be at most 10 digits'),
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
      phonenumber: '',
      vehicle:{
        NumberPlate: '',
        capacity: '',
        vehicleType: ''
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Captain Register Data", values);
      setbuttonloader(true);
      try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, values);

        if(response.status === 201){
          console.log("Captain Registered Successfully", response.data);
          localStorage.setItem('Captaintoken' , response.data.token);
          setbuttonloader(false);
          navigate('/Captain-screen');
        }
      }catch(err){
        console.log("Registration Error", err);
        setbuttonloader(false);
        if(err.response && err.response.status === 400){
          setRegisterError('Captain already exists')
        }else {
          setRegisterError('Something went wrong, please try again later');
        }
      }
     
     
    }
  });

  return (
    <div className='flex flex-col justify-between h-screen px-6 pt-12 pb-2 overflow-y-auto bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50
'>
      <div>

        <div className='w-full flex justify-between items-center mb-5 '>
           <div className="text-[44px] z-10 italic font-bold text-gray-800 flex items-center">
           <h1> Savari </h1>
            <div className="ml-2 mt-3">
              <img 
                src='https://static.thenounproject.com/png/2688219-200.png'
                className='w-8 transform scale-x-[-1]'
                alt="Savari icon"
              />
            </div>
          </div>
          
        </div>

        <div className='flex flex-col justify-center px-4 mt-0'>
          <h1 className='font-bold underline text-[30px] w-full text-orange-500 text-center mb-4'>Register</h1>
          <form className='w-full max-w-md' onSubmit={formik.handleSubmit}>
            <label htmlFor='firstname' className='text-[20px] block mb-2'>Enter your name</label>
            
            <div className='flex gap-2'>
              <div>
              <input
                name='fullname.firstname'
                placeholder='First Name'
                type='text'
                value={formik.values.fullname.firstname}
                onChange={formik.handleChange}
                className='px-3 py-2 border-2 w-full rounded-xl mb-1'
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
                className='px-3 py-2 border-2 w-full rounded-xl mb-1'
              />
                    <div className='text-red-600 text-sm mb-3'>
                   
                      {formik.errors.fullname?.lastname && formik.touched.fullname?.lastname && <div>{formik.errors.fullname.lastname}</div>}
                    </div>
              </div>

            </div>
        

            <label htmlFor='email' className='text-[20px] block mb-2'>Email</label>
            <input
              name='email'
              placeholder='name@example.com'
              type='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              className='px-3 py-2 border-2 w-full rounded-xl mb-1'
            />
            <div className='text-red-600 text-sm mb-3'>
              {formik.errors.email && formik.touched.email && <div>{formik.errors.email}</div>}
            </div>

            <label htmlFor='password' className='text-[20px] block mb-2'>Password</label>
            <div className='relative'>
            <input
              name='password'
              placeholder='password'
              type={showpassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              className='px-3 py-2 border-2 w-full rounded-xl mb-1'
            />
                              <button
                                  type="button"
                                  onClick={() => setshowpassword(!showpassword)}
                                  className=" absolute right-5 top-3 text-[20px]"
                                >
                                  {showpassword ? <FaRegEye/> : <FaRegEyeSlash/> }
                                </button>

            </div>
            <div className='text-red-600 text-sm mb-3'>
              {formik.errors.password && formik.touched.password && <div>{formik.errors.password}</div>}
            </div>


            <label htmlFor='phonenumber' className='text-[20px] block mb-2'>Phonenumber</label>
            <input
              name='phonenumber'
              placeholder='phonenumber'
              type='number'
              value={formik.values.phonenumber}
              onChange={formik.handleChange}
              className='px-3 py-2 border-2 w-full rounded-xl mb-1'
            />
            <div className='text-red-600 text-sm mb-3'>
              {formik.errors.phonenumber && formik.touched.phonenumber && <div>{formik.errors.phonenumber}</div>}
            </div>



        <div id="the vehicle outer div">
 
          <div id="it contains vehicle capacity and number plate" className='flex gap-2 '>

            <div id="the vehicle capacity div">
            <label className='mb-2 block whitespace-nowrap text-[18px]'>Vehicle Capacity</label>
              <input
                name='vehicle.capacity'
                type="number"
                placeholder='Vehicle Capacity'
                value={formik.values.vehicle.capacity}
                onChange={formik.handleChange}
              
                className=' rounded-xl px-3 py-2 border text-lg placeholder:text-base max-w-[160px] w-full'
              />
              <div className='text-red-600 text-sm'>
                {formik.touched.vehicle?.capacity && formik.errors.vehicle?.capacity}
              </div>
              </div>

            <div id="the vehicle plate div">
            <label className='mb-2 block whitespace-nowrap text-[18px]'>Number Plate</label>
              <input
                name='vehicle.NumberPlate'
                type="text"
                placeholder='Vehicle Plate'
                value={formik.values.vehicle.NumberPlate}
                onChange={formik.handleChange}
        
                className=' rounded-xl px-4 py-2 border text-lg placeholder:text-base max-w-[170px] w-full'
              />
              <div className='text-red-600 text-sm'>
                {formik.touched.vehicle?.NumberPlate && formik.errors.vehicle?.NumberPlate}
              </div>
            </div>
          </div>

            <div className='mt-3 mb-3'>
              <label className='mb-3 block whitespace-nowrap text-[18px]'>Choose the vehicle</label>
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

            </div>


            <button className='bg-black text-white w-full px-3 py-2 rounded-xl mb-2 flex gap-2 justify-center items-center'
             type='submit'>
              {buttonloader && <ButtonLoader/>}
              <p>Register</p>
              </button>

            {registerError && (
              <p className="text-red-500 text-lg text-center mt-2">{registerError}</p>
            )} 
            {/* Register Error handle */}

            <Link to='/Captain-login'>
              Already have an account? <span className='text-blue-600'>Login</span>
            </Link>
           <button className='bg-green-50 text-green-500 px-4 py-2 rounded-2xl mt-3 border border-green-200 hover:bg-green-100 hover:text-green-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md'>
            <Link to='/User-register'>
              <span className='text-[14px]'>Register as a User instead?</span>
            </Link>
          </button>
          </form>
        </div>
      </div>

      <p className='text-[12px] leading-tight text-justify mt-5'>
        By agreeing to this, you are accepting the terms and conditions of the Savari application.
        An Original Application made by Siddharth Nair{" "}
        <Link to='https://github.com/siddy09re' className='text-blue-500 underline'>Github Link</Link>
      </p>
    </div>
  )
}

export default CaptainRegister

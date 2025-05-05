import React from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
  return (
    <div >


    <div className='h-screen flex justify-between bg-cover bg-center flex-col bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]'>
        <div>
                <h1 className='mt-12 text-[44px] ml-9 text-white'>Uber</h1>
        </div>

        <div className=' px-7 py-9 flex flex-col justify-center bg-white gap-5'>
                <h2 className='text-center font-semibold text-[28px]'>Get Started with Uber</h2>
                <button className='bg-black text-white rounded-lg px-3 py-2 text-[20px]'
                onClick={() => navigate('/User-login')}>Continue</button>
        </div>
    </div>
    
    </div>
  )
}

export default Home
import React, { useEffect, useState } from 'react'
// import { useContext } from 'react'
import { CaptainDataContext } from '../Pages/context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { SetCaptainDetails } from '../Redux/CaptainDetailsSlice';

const CaptainProtected = ({children}) => {

      const navigate = useNavigate();
        const token = localStorage.getItem('Captaintoken');
        const [isLoading , setisLoading] = useState(true)
        // const {captain , setcaptain} = useContext(CaptainDataContext);
        const dispatch = useDispatch();



        useEffect(() => {
            if (!token) {
              navigate('/Captain-login');
            } 
            else {
              axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }).then((res) => {
                if (res.status === 201) {
                  setisLoading(false);
                //   setcaptain(res.data.captain);
                dispatch(SetCaptainDetails(res.data))
                }
              }).catch((err) => {
                console.log("Captain Protected Error", err);
                localStorage.removeItem('Captaintoken');
                navigate('/Captain-login');
              });
            }
          }, [token, navigate , dispatch]);
          

      if(isLoading){
        return <div>Loading...</div>
      }

  return (
    <div>
        {children}
    </div>
  )
}

export default CaptainProtected
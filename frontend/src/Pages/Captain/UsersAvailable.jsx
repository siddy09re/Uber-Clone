import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import UsersPopup from './UsersPopup';
import { useDispatch } from 'react-redux';
import { SetFetchUserDetails } from '../../Redux/CaptainDetailsSlice';

const UsersAvailable = ({setavailableRide}) => {

    const CaptainInfo = useSelector((state) => state.CaptainDetails.CaptainDetails);
    const dispatch = useDispatch();
    const [UserDetails,setUserDetails] = useState(null);
    const[ModelStatus , setModelStatus] = useState(false);

  //to showcase all the users nearby area 
  const fetchallCustomers = async () => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/GetNearbyUsers`,{
          CaptainInfo
        });
        if(response.status === 200) {
          const data = response.data;
          console.log("the data of users nearby is " , data);
          setUserDetails(data);
          dispatch(SetFetchUserDetails(data));
        }
    }catch(err){
        console.log("The error is at fetch of users in captain side" , err);
    }
}

useEffect(() => {
    fetchallCustomers();
const intervalId = setInterval(fetchallCustomers, 7000); 

// Cleanup on unmount
return () => clearInterval(intervalId);
}, []);




  return (
    <div>
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: '50%',
        backgroundColor: UserDetails ? '#22c55e' : '#9ca3af', // Tailwind green-500 or gray-400
        boxShadow: UserDetails
          ? '0 0 20px rgba(34, 197, 94, 0.7)'
          : '0 0 8px rgba(156, 163, 175, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
      }}

      onClick={() => 
        setModelStatus(true)
      }
    >
      <p
        style={{
          color: 'white',
          fontWeight: '600',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        {UserDetails ? 'User Found' : 'No Users'}
      </p>

    </div>


    {
        ModelStatus && <UsersPopup UserDetails={UserDetails} setModelStatus={setModelStatus} setavailableRide={setavailableRide}/>
      }
    </div>
  )
}

export default React.memo(UsersAvailable)
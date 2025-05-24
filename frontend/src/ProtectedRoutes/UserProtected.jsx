import React, { useEffect , useState } from 'react'
import { useContext } from 'react'
import { UserDataContext } from '../Pages/context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';


const UserProtected = ({children}) => {
    const { setuser } = useContext(UserDataContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('Usertoken');
    const [isLoading , setisLoading] = useState(true)
  

    useEffect(() => {
      if (!token) {
        navigate('/User-login');
      } 
      else {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then((res) => {
          if (res.status === 200) {
          
            setuser(res.data)
          }
        }).catch((err) => {
          console.log("User Protected Error", err);
          localStorage.removeItem('Usertoken');
          navigate('/User-login');
        }).finally(() => {
          setisLoading(false);
        });
      }
    }, [token, navigate,setuser]);
    

if(isLoading){
  return <div>Loading...</div>
}

  return (
    <div>
        {children}
    </div>
  )
}

export default UserProtected
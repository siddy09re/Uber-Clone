import React, { useContext, useRef, useState , useEffect} from 'react'
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { useSearchParams } from 'react-router-dom';
import { GiPathDistance } from "react-icons/gi";
import FinishedRide from "./FinishedRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useSelector } from 'react-redux';
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { SocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import MapBoxContainer from '../User/MapBoxContainer';


const CaptainRiding = () => {

 const Finishedref = useRef(null);
 const [FinishedrideInfo , setFinishedrideInfo] = useState(false);
 const TravelDetails  = useSelector((state) => state.CaptainDetails.TravelDetails);
const CaptainInfo = useSelector((state) => state.CaptainDetails.CaptainDetails);
 console.log(TravelDetails);
 const mapRef = useRef(null);
const navigate = useNavigate();
const {socket} = useContext(SocketContext);
const [latitude,setlatitude] = useState(null);
const [longtitude , setlongtitude] = useState(null);
const [DriverLocation , setDriverLocation] = useState(null);



 const handleLogout = async () =>{
    try{
      const token = localStorage.getItem('Captaintoken');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Important if using cookies
        }
      );
      if(response.status === 200){
        console.log("Captain Logout Successfully", response.data);
        localStorage.removeItem('Captaintoken');
        navigate('/Captain-screen');
        // setuser(null);
      }
    }catch(err){
      console.log("Logout Error" , err);
    }
  }


 useGSAP(
    function () {
      if (FinishedrideInfo) {
        gsap.to(Finishedref.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(Finishedref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [FinishedrideInfo]
  );





  useEffect(() => {
    if (!socket) return;
  
    socket.emit('join', { userId: CaptainInfo._id, userType: "captain" });
  
    const updateLocation = async () => {
      try {
        const response = await axios.get('https://ipwho.is/');
        const { latitude, longitude } = response.data;
        setlatitude(latitude);
        setlongtitude(longitude);
        setDriverLocation([longtitude,latitude]);
  
        console.log("Location from ipwho.is:", latitude, longitude);
  
        socket.emit('update-location-captain', {
          userId: CaptainInfo._id,
          location: {
            lat: latitude,
            lng: longitude
          }
        });
      } catch (err) {
        console.log("Error getting location:", err);
      }
    };
  
    // Run immediately
    updateLocation();
  
    // Set interval to run every 10 seconds
    const intervalId = setInterval(updateLocation, 7000);
  
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  
  }, [CaptainInfo, socket , latitude ,longtitude]);

  return (
    <div>
           <div className='w-[100%]   relative'>

             

                    <div className="h-screen relative overflow-hidden">

                        <h1 className="absolute top-10 left-5 text-[44px] ">Uber</h1>

                        <MapBoxContainer latitude={latitude} longtitude={longtitude} mapRef={mapRef} mapboxgl={mapboxgl} 
                       pickupcoord={TravelDetails?.destinationcoord.coordinates} drivercoord = {DriverLocation} />


                   
                     <div className="absolute top-12 right-5 p-3 rounded-full bg-slate-100 z-20"
                                    onClick={() => handleLogout()}>
                                    <BiLogOut className="text-2xl cursor-pointer" />
                    </div>
                    </div>


                    <div className="bottom-0 bg-orange-300 px-5 py-9 z-10 absolute w-full flex items-center justify-between">

                        <div className="flex gap-3 items-center text-xl">
                                <GiPathDistance className="text-[40px]"/>
                                <h2>{TravelDetails?.distance}km left</h2>
                        </div>

                        <div>
                            <button className="bg-green-300 px-5 py-3 rounded-xl text-black"
                            onClick={() => setFinishedrideInfo(true)}>Ride Completed </button>
                        </div>

                    </div>


            <div className="translate-y-[100%] bottom-0 fixed z-10 w-full bg-white" ref={Finishedref}>
                <FinishedRide setFinishedrideInfo={setFinishedrideInfo} />
           </div>


            </div>
    </div>
  )
}

export default CaptainRiding
import React, { useRef, useState } from 'react'
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { useSearchParams } from 'react-router-dom';
import { GiPathDistance } from "react-icons/gi";
import FinishedRide from "./FinishedRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';

const CaptainRiding = () => {

 const Finishedref = useRef(null);
 const [FinishedrideInfo , setFinishedrideInfo] = useState(false);
 const navigate = useNavigate();

 
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
        navigate('/Captain-login');
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


  return (
    <div>
           <div className='w-[100%]   relative'>

             

                    <div className="h-screen relative overflow-hidden">

                        <h1 className="absolute top-10 left-5 text-[44px] ">Uber</h1>
                        <img
                        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                        className="w-full h-full object-cover max-h-screen"
                        />


                   
                     <div className="absolute top-12 right-5 p-3 rounded-full bg-slate-100 z-20"
                                    onClick={() => handleLogout()}>
                                    <BiLogOut className="text-2xl cursor-pointer" />
                    </div>
                    </div>


                    <div className="bottom-0 bg-orange-300 px-5 py-9 z-10 absolute w-full flex items-center justify-between">

                        <div className="flex gap-3 items-center text-xl">
                                <GiPathDistance className="text-[40px]"/>
                                <h2>10km left</h2>
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
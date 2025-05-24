import React, { useState, useRef , useEffect } from "react";
import MapBoxContainer from "./MapBoxContainer";
import "mapbox-gl/dist/mapbox-gl.css";
import {AddressAutofill, useConfirmAddress } from '@mapbox/search-js-react';
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";

import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";


import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import LocationSearchPanel from "../../Components/LocationSearchPanel";
import { MdMyLocation } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import VehiclesPanel from "../../Components/VehiclesPanel";
import ConfirmedVehicle from "../../Components/ConfirmedVehicle";
import LookingForDriver from "../../Components/LookingForDriver";
import DriverFoundPage from "../../Components/DriverFoundPage";
import axios from "axios";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";


const UserScreen = () => {
  const navigate = useNavigate();


  const [pickup, setpickup] = useState("");
  const [destination, setdestination] = useState("");
  const [pickupcoord,setpickupcoord] = useState(null);
  const [destinationcoord,setdestinationcoord] = useState(null);
  const [panelopen, setpanelopen] = useState(false);
  const [selectedvehicle, setselectedvehicle] = useState(false);
  const [LookingForDriverstate, setLookingForDriverstate] = useState(false);
  const [DriverFound, setDriverFound] = useState(false);
  const [distance , setdistance] = useState(null);
  const [RideFareandTime , setRideFareandTime] = useState(null);

  const panelref = useRef(null);
  const ConfirmedVehicleref = useRef(null);
  const [vehiclepanel, setvehiclepanel] = useState(false);
  const vehiclepanelref = useRef(null);
  const LookingForDriverref = useRef(null);
  const DriverFoundref = useRef(null);


  const [longtitude , setlongtitude] = useState(null);
  const [latitude , setlatitude] = useState(null);
   const mapRef = useRef(null);

  const {user} = useContext(UserDataContext);
  const {socket} = useContext(SocketContext);
  
  useEffect(() => {

    socket.emit("join" , {userId : user._id, userType : 'user'});


    const handler = () => {
      console.log("ride confirmed user has been called");
      navigate('/User-riding');
    };
  
    socket.on('RideConfirmedUser', handler);
  

    return () => {
      socket.off('RideConfirmedUser', handler);
    };
  

  },[user,socket,navigate])


  const LocationHandler = async (e) => {
    e.preventDefault();

        if(!distance){
          alert("Please select the pickup and destination location")
        }

        const journeyDistance = {
          "distance" : distance
        }

        console.log("journeyDistance", journeyDistance);

        try{
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/generateFare`,journeyDistance);
          if(response.status === 200){
            const data = response.data;
            const ridedetails = data.ridedetails;
            setRideFareandTime(ridedetails);
            console.log(data , "fare and time");
            setvehiclepanel(true)
            setpanelopen(false)
          }
        }catch(err){
          console.log("Error in getting fare and time", err);
        }
  }
 

  const handleLogout = async () => {
    console.log("Logout");

    try {
      const token = localStorage.getItem("Usertoken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Important if using cookies
        }
      );
      if (response.status === 200) {
        console.log("User Logout Successfully", response.data);
        localStorage.removeItem("Usertoken");
        navigate("/User-login");
        // setuser(null);
      }
    } catch (err) {
      console.log("Logout Error", err);
    }
  };

  useGSAP(
    function () {
      if (panelopen) {
        gsap.to(panelref.current, {
          height: "75dvh",
          padding: "20px",
        });
      } else {
        gsap.to(panelref.current, {
          height: "0vh",
          padding: "0px",
        });
      }
    },
    [panelopen]
  );

  useGSAP(
    function () {
      if (vehiclepanel) {
        gsap.to(vehiclepanelref.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclepanelref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclepanel]
  );

  // useGSAP(
  //   function () {
  //     if (selectedvehicle) {
  //       gsap.to(ConfirmedVehicleref.current, {
  //         transform: "translateY(0)",
  //       });
  //     } else {
  //       gsap.to(ConfirmedVehicleref.current, {
  //         transform: "translateY(100%)",
  //       });
  //     }
  //   },
  //   [selectedvehicle]
  // );

  // useGSAP(
  //   function () {
  //     if (LookingForDriverstate) {
  //       gsap.to(LookingForDriverref.current, {
  //         transform: "translateY(0)",
  //       });
  //     } else {
  //       gsap.to(LookingForDriverref.current, {
  //         transform: "translate(0,100%) !important",
  //       });
  //     }
  //   },
  //   [LookingForDriverstate]
  // );

  useGSAP(
    function () {
      if (DriverFound) {
        gsap.to(DriverFoundref.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(DriverFoundref.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [DriverFound]
  );

  const geolocaton = () => {
    console.log("🔥 useEffect is called");

    if ("geolocation" in navigator) {
      console.log("✅ Geolocation is supported");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("📍 successlocation:", position);
          const { latitude, longitude } = position.coords;
          console.log("Latitude:", latitude, "Longitude:", longitude);
          setlatitude(latitude);
          setlongtitude(longitude);
        },
        (error) => {
          console.error("❌ errorlocation:", error);
          // alert("Please enable location");
        }
        // {
        //   enableHighAccuracy: true
        // }
      );
    } else {
      console.warn("🚫 Geolocation not supported");
    }
  };


  const { formRef} = useConfirmAddress({
    footer: 'My custom footer',
  });





  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* //this overflow clip is used because the location guys where showing up , when scrolled down */}

      <h1 className="absolute top-10 left-5 text-[44px] z-10 ">Uber</h1>
      <button
        className="absolute top-[7rem] right-3 text-[44px] z-10"
        onClick={() => geolocaton()}
      >
        
        <MdMyLocation className="text-[24px]"/>
      </button>

      <MapBoxContainer longtitude={longtitude} latitude={latitude} mapRef={mapRef} mapboxgl={mapboxgl} pickupcoord={pickupcoord}
      destinationcoord={destinationcoord} setdistance={setdistance}/>

      {!panelopen && (
        <div
          className="absolute top-[150px] right-1 p-3 rounded-full bg-slate-100 z-20"
          onClick={() => handleLogout()}
        >
          <BiLogOut className="text-2xl cursor-pointer" />
        </div>
      )}

      {/* //added overflow-clip rather than on top */}
      <div className="flex flex-col justify-end absolute bottom-0 w-full z-10 ">
        <div className="bg-white p-5 w-full h-[25dvh] relative ">
          <h2 className="text-3xl font-semibold"> Find a trip </h2>
        

          <div className="absolute top-6 right-10 cursor-pointer z-50">
            {panelopen && (
              <IoIosArrowDown
                size={32}
                className="text-black"
                onClick={() => setpanelopen(false)}
              />
            )}
          </div>

          <form
            className="flex flex-col gap-4 mt-5 relative"
            onSubmit={(e) => LocationHandler(e)}
            ref={formRef}
          >
            <div className="w-1 h-8 bg-black absolute top-7 left-3 z-20"></div>

            <div onClick={() => !panelopen && setpanelopen(true)} className="flex flex-col gap-4">

              <SearchBox
                  accessToken={import.meta.env.VITE_BASE_MAPBOX_TOKEN}
                  
                  mapboxgl={mapboxgl}
                  map={mapRef.current}
                  value={pickup}
                
                  onSuggest={(data) => {
                    console.log("suggested data of pickup", data);
                   
                  }}
                  onRetrieve={(res) => {
                    const feature = res.features[0];
                  
                    if (feature) {
                      const [lng, lat] = feature.geometry.coordinates;

                      console.log('Latitude: of pickup', lat);
                      console.log('Longitude: of Longitude', lng);
                      setpickupcoord([lng, lat]);
                      setpickup(feature.properties.name)
                    }
                  }}
                  marker
                />

                <SearchBox
                  accessToken={import.meta.env.VITE_BASE_MAPBOX_TOKEN}
                  
                  mapboxgl={mapboxgl}
                  map={mapRef.current}
                  value={destination}
               
                  onSuggest={(data) => {
                    console.log("suggested data of destination", data);
                    
                  }}
                  onRetrieve={(res) => {
                    const feature = res.features[0];
                    if (feature) {
                      const [lng, lat] = feature.geometry.coordinates;
                      console.log('Latitude: of destination', lat);
                      console.log('Longitude: of destination', lng);
                      setdestinationcoord([lng, lat]);
                      setdestination(feature.properties.name);
                    }
               }}
                  marker
                />

            </div>


            <button type="submit" className="btn-submit absolute right-[43%] bottom-[-6px] z-10" >
              Submit
            </button>
          </form>
        </div>

        <div className=" bg-white p-0 h-0  " ref={panelref}>
          {/* <LocationSearchPanel
            vehiclepanel={vehiclepanel}
            setvehiclepanel={setvehiclepanel}
            setpanelopen={setpanelopen}
            suggestions={suggestions}
          /> */}
        </div>
      </div>

      <div
        className="flex flex-col gap-2 fixed z-10 translate-y-[100%] bottom-[0px] px-5 py-2 bg-white"
        ref={vehiclepanelref}
      >
        <VehiclesPanel
          setvehiclepanel={setvehiclepanel}
          setselectedvehicle={setselectedvehicle}
          RideFareandTime = {RideFareandTime}
        />
      </div>

      <div
       className={` ${
        selectedvehicle ? "translate-y-0" : " translate-y-full"
      } bottom-[0px] fixed z-10 w-full bg-white transition-all transform duration-500`}
        // ref={ConfirmedVehicleref}
      >
        <ConfirmedVehicle
          setselectedvehicle={setselectedvehicle}
          setLookingForDriverstate={setLookingForDriverstate}
          pickup={pickup}
          destination={destination}
          pickupcoords={pickupcoord}
          destinationcoords={destinationcoord}
          distance={distance}
        />
      </div>

      <div
        className={` ${
          LookingForDriverstate ? "translate-y-0" : " translate-y-full"
        } bottom-[0px] fixed z-10 w-full bg-white transition-all transform duration-500`}
        // ref={LookingForDriverref}
      >
        <LookingForDriver setLookingForDriverstate={setLookingForDriverstate} />
      </div>

      <div
        className="translate-y-[100%] bottom-0 fixed z-10 w-full bg-white"
        ref={DriverFoundref}
      >
        <DriverFoundPage setDriverFound={setDriverFound} setLookingForDriverstate={setLookingForDriverstate}/>
      </div>
    </div>
  );
};

export default UserScreen;

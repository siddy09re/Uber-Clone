// MapBoxContainer.js
import React, { useEffect, useRef } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";



const MapBoxContainer = ({longtitude , latitude,mapboxgl, mapRef , pickupcoord , destinationcoord , setdistance , drivercoord , setDriverDistance}) => {
  const mapContainerRef = useRef(null);
 
  const pickupMarkerRef = useRef(null);
const destinationMarkerRef = useRef(null);
const driverMarkerRef = useRef(null);

const {socket} = useContext(SocketContext);

 
  mapboxgl.accessToken = import.meta.env.VITE_BASE_MAPBOX_TOKEN;



  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_BASE_MAPBOX_TOKEN;

    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longtitude ??  77.2090 , latitude ?? 28.6139 ], // Delhi coords
        zoom: 10,
      });
    

      // mapRef.current.on('load', () => {
      //   // ✅ Now it's safe to add controls
      //   const nav = new mapboxgl.NavigationControl();
      //   mapRef.current.addControl(nav, 'top-right');
      // });
    }
  }, [latitude, longtitude, mapboxgl, mapRef]);


  useEffect(() => {
    // 1. Exit early if coordinates are not available
    if (!pickupcoord || !destinationcoord || !mapRef.current) {
      // Remove route layer if it exists
      if (mapRef.current.getLayer('route')) {
        mapRef.current.removeLayer('route');
      }
      if (mapRef.current.getSource('route')) {
        mapRef.current.removeSource('route');
      }
  
      // Remove pickup marker
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove();
        pickupMarkerRef.current = null;
      }
  
      // Remove destination marker
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }
  
      // Hide instructions
      const instructions = document.getElementById('instructions');
      if (instructions) {
        instructions.style.display = 'none';
        instructions.innerHTML = '';
      }
  
      return; // ✅ Exit early
    }
  
    // 2. Define an async function inside the useEffect
    const getRoute = async () => {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${pickupcoord[0]},${pickupcoord[1]};${destinationcoord[0]},${destinationcoord[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const json = await query.json();
      const data = json.routes[0];
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: data.geometry,
      };
  
      // 3. If the route source exists, update it
      if (mapRef.current.getSource('route')) {
        mapRef.current.getSource('route').setData(geojson);
      } else {
        // 4. Otherwise, add the route as a new layer
        mapRef.current.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      }

      const instructions = document.getElementById('instructions');

      instructions.style.display = 'none';
      
     
      if (data && data.legs && data.legs.length > 0) {
        // const steps = data.legs[0].steps;
      
        // Optionally generate step instructions
        // let tripInstructions = '';
        // for (const step of steps) {
        //   tripInstructions += `<li>${step.maneuver.instruction}</li>`;
        // }
      
        
       
        instructions.innerHTML = `<p><strong>Distance: ${Math.round(data.distance /1000 )}Km</strong></p>`;
        instructions.style.display = 'block'; 

        setdistance(Math.round(data.distance /1000));
      } else {
    
        instructions.style.display = 'hidden';
      }
    }

    console.log("Pick" , pickupcoord , "Dest" , destinationcoord);

  // Place/update pickup marker
if (pickupMarkerRef.current) {
  pickupMarkerRef.current.setLngLat(pickupcoord);
} else {
  pickupMarkerRef.current = new mapboxgl.Marker({ color: 'green' })
    .setLngLat(pickupcoord)
    .addTo(mapRef.current);
}

// Place/update destination marker
if (destinationMarkerRef.current) {
  destinationMarkerRef.current.setLngLat(destinationcoord);
} else {
  destinationMarkerRef.current = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(destinationcoord)
    .addTo(mapRef.current);
}


    getRoute();
  
  }, [pickupcoord, destinationcoord, mapboxgl, mapRef,setdistance]);



  //Driver side Logic
  useEffect(() => {

    if(!drivercoord || !mapRef.current) {
      // Remove route layer if it exists
      if (mapRef.current.getLayer('route-driver-pickup')) {
        mapRef.current.removeLayer('route-driver-pickup');
      }
      if (mapRef.current.getSource('route-driver-pickup')) {
        mapRef.current.removeSource('route-driver-pickup');
      }
  
      // Remove pickup marker
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
        driverMarkerRef.current = null;
      }

      return;
    }


    const getDriverRoute = async() => {

      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${drivercoord[0]},${drivercoord[1]};${pickupcoord[0]},${pickupcoord[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const json = await query.json();
      const data = json.routes[0];
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: data.geometry,
      };

         // 3. If the route source exists, update it
         if (mapRef.current.getSource('route-driver-pickup')) {
          mapRef.current.getSource('route-driver-pickup').setData(geojson);
        } else {
          // 4. Otherwise, add the route as a new layer
          mapRef.current.addLayer({
            id: 'route-driver-pickup',
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson,
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75,
            },
          });
        }

        if (data ) {
         
          console.log("the data which got after finding the distance is " , data);
          
          const DriverDistance = Math.round(data.distance /1000);

          // socket.emit('DriverDistance' , DriverDistance);
          setDriverDistance(DriverDistance)
          console.log("the distance be pickup and driver in mapbox" , DriverDistance);
 
    }
  }



      // Place/update pickup marker
if (driverMarkerRef.current) {
  driverMarkerRef.current.setLngLat(drivercoord);
} else {
  driverMarkerRef.current = new mapboxgl.Marker({ color: 'blue' })
    .setLngLat(drivercoord)
    .addTo(mapRef.current);
}

  getDriverRoute();

  },[drivercoord,mapRef,mapboxgl,pickupcoord ,socket ])
  

  // Update map center when coords change
  useEffect(() => {
    if (mapRef.current && latitude && longtitude) {
      mapRef.current.setCenter([longtitude, latitude]);
    }
  }, [latitude, longtitude, mapRef]);

  return (
    <div>
    <div
    style={{ position: "absolute", top: 0, bottom: 0, width: "100%" , zIndex: 0 }}
      ref={mapContainerRef}
      className="map-container"
    />
    <div id="instructions"></div>
    </div>
  );
};

export default React.memo(MapBoxContainer);

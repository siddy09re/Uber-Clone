import React from 'react';
import { FaRupeeSign } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { SetTravelDetails } from '../../Redux/CaptainDetailsSlice';

const UsersPopup = ({ UserDetails, setModelStatus,setavailableRide }) => {
    const dispatch = useDispatch();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Nearby Ride Requests
        </h2>

        {/* Scrollable User List */}
        <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
          {UserDetails.length === 0 ? (
            <p className="text-center text-gray-500">No nearby users</p>
          ) : (
            UserDetails.map((item, index) => (
              <div
                key={index}
                onClick={() => {setModelStatus(false)
                    setavailableRide(true);
                    dispatch(SetTravelDetails(item))
                }}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition"
              >
               
                <div className='flex flex-col gap-3 items-center'>
                    <p  className='text-center'>{item.pickup}</p><p><FaArrowDown /></p>  <p className='text-center'> {item.destination}</p>
                    </div>
                    <p>Distance : {item.distance} Km</p>
                    <p>Duration : {item.duration} Mins</p>
                    <p className='flex gap-1 items-center'>Fare : {item.fare} <FaRupeeSign /> </p>
              </div>
            ))
          )}
        </div>

        {/* Footer Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => setModelStatus(false)}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersPopup;

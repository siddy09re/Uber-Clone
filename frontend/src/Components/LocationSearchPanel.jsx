import React from 'react'
import { FaLocationDot } from "react-icons/fa6";

const LocationSearchPanel = ({ setvehiclepanel , setpanelopen , suggestions}) => {

  return (
    <div>
        {
            suggestions.suggestions?.map(function(elem , index){
                return <div  key={index} className='flex px-2 py-2 gap-4 items-center border-4 my-2 active:border-black rounded-lg'
                onClick={() => {
                    setvehiclepanel(true)
                    setpanelopen(false)
                }}>
                           <div className='w-8 h-8'> <FaLocationDot className='w-8 h-8 '/></div>
                           <div className='flex flex-col gap-1'> <h1 className='text-semibold text-lg'>{elem.name}</h1>
                            <h2 className='text-gray-600'>{elem.full_address}</h2> 
                            <h2>{elem.coordinates}</h2></div>
                       </div>
            })
        }
    </div>
  )
}

export default React.memo(LocationSearchPanel);
import { configureStore } from '@reduxjs/toolkit'
import SelectedVehicleSlice from './SelectedVehicleSlice';
import CaptainDetailsSlice from './CaptainDetailsSlice';

export const store = configureStore({
    reducer : {
        SelectedVehicle : SelectedVehicleSlice,
        CaptainDetails : CaptainDetailsSlice
    }
    
})
import {createSlice} from '@reduxjs/toolkit';

const initialState = { 
    SelectedVehicle : null,
    RideDetails : null
}

const SelectedVehicleSlice = createSlice({
    name : 'SelectedVehicle',
    initialState,
    reducers : {
        SelectedVehicleDetails : (state, action) => {
            state.SelectedVehicle = action.payload;
        },
        SetRideDetails : (state,action) => {
            state.RideDetails = action.payload;
        }
    }
})

export const {SelectedVehicleDetails , SetRideDetails} = SelectedVehicleSlice.actions;
export default SelectedVehicleSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    CaptainDetails : null,
    TravelDetails : null,
    FetchedUserDetails : null,
   
}

const CaptainDetailsSlice = createSlice({
    name : 'CaptainDetails',
    initialState,
    reducers : {
        SetCaptainDetails : (state, action) => {
            state.CaptainDetails = action.payload;
        },
        SetTravelDetails : (state ,action) => {
            state.TravelDetails = action.payload;
        },
        SetFetchUserDetails : (state,action) => {
            state.FetchedUserDetails = action.payload;
        },
       
    }
})

export const {SetCaptainDetails , SetTravelDetails , SetFetchUserDetails } = CaptainDetailsSlice.actions;
export default CaptainDetailsSlice.reducer;
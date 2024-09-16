
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchUser } from "../../action/instance";

export const initialState = {}

export  const fetchUserDetails = createAsyncThunk(
    'User',
    async () => {
        const {status,result} = await FetchUser()
        return result.result
    },
)

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state = action.payload
            return state
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
            state = action.payload
            return state
        })
    },
})

export const { setUserDetails } = userSlice.actions; 

export default userSlice.reducer;
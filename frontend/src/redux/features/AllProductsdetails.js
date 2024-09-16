

import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getallProducts } from "../../action/instance";

const initialState ={
}

 export const getAllProduct = createAsyncThunk('Products' , async()=>{
    const {result,status}=await getallProducts()

    if(status){
        return result.result
    }
 })

const Pr0ductSlice= createSlice({
    name:"Products",
    initialState , 
    reducers:{
        setAllProducts:(state,action)=>{
            return state= action.payload
        }
    },
    extraReducers :(builder)=>{
        builder.addCase(getAllProduct.fulfilled,(state,action)=>{
            state=action.payload
            return  state
        })
    }
})


export const {setAllProducts}=Pr0ductSlice.actions

export default Pr0ductSlice.reducer




import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  getUserCart } from "../../action/instance";

const initialState ={
}

 export const FetchUserCart = createAsyncThunk('UserCarts' , async()=>{
    const {result,status}=await getUserCart()
    if(status){
        return result.result
    }
 })

const UserCartSlice= createSlice({
    name:"UserCarts",
    initialState , 
    reducers:{
        setAllUserCart:(state,action)=>{
            return state= action.payload
        }
    },
    extraReducers :(builder)=>{
        builder.addCase(FetchUserCart.fulfilled,(state,action)=>{
            state=action.payload
            return  state
        })
    }
})


export const {setAllUserCart}=UserCartSlice.actions

export default UserCartSlice.reducer
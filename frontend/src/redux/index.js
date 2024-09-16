import { combineReducers } from "@reduxjs/toolkit"
import userSlice from "./features/userDeatils"
import Pr0ductSlice from './features/AllProductsdetails'
import UserCartSlice from './features/usercart'

export const rootReducer = combineReducers({
    User: userSlice,
    Products:Pr0ductSlice,
    UserCarts:UserCartSlice
})

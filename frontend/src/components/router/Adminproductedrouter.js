



import { Outlet , Navigate } from "react-router-dom";
import { getCookies } from "../cookies/cookies";
import { isEmpty } from "../helperFun/helperFun";
import { useSelector } from "react-redux";

const isLoginedin  = getCookies()

export const AdminProductedrouter = ()=>{
    const Userdetails = useSelector((state)=> state.User)

   

    return isEmpty(isLoginedin) ?
    <Navigate to='/login' /> : Userdetails.type==0   ?<Outlet /> : <Navigate to='/' />
}

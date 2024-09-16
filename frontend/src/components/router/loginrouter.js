

import { Outlet , Navigate } from "react-router-dom";
import { getCookies } from "../cookies/cookies";
import { isEmpty } from "../helperFun/helperFun";
import { useSelector } from "react-redux";

const isLoginedin  = getCookies()

export const Loginrouter = ()=>{
    const Userdetails = useSelector((state)=> state.User)

    
    return !isEmpty(isLoginedin) ? Userdetails.type==0 ?<Navigate to='/user' /> : <Navigate to='/' />  : <Outlet />
}

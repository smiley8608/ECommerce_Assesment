

// import React from "react";
import { useSelector } from "react-redux";
import NavigationBar from "../../components/navbar/adminnavbar";
const AdminDashboard= ()=>{

    const userdetails=useSelector(state=>state.User)

    console.log(userdetails,'userdetails')
    return (
        <div>
             <NavigationBar />
            AdminDashboard
        </div>
    )
}

export default AdminDashboard
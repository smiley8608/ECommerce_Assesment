
import React from "react";
// import NavigationBar from "../../components/navbar/adminnavbar";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../../components/navbar/adminnavbar";

function AdminManagement(){

    const navigate=useNavigate()
    const NavigateToAdd=async()=>{
        navigate('/Add-Admin')
    }
    return (
        <div>
             <NavigationBar />
            AdminManagement
            <button onClick={NavigateToAdd}>Add Admin</button>
        </div>
    )
}
export default AdminManagement
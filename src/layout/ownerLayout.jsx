import React from "react";
import { Outlet,useLocation } from 'react-router-dom'
import axiosInstance from '../config/axiosinstance'
import OwnerHeader from "../components/owner/ownerHeader";
import OwnerFooter from "../components/owner/ownerFooter";



function OwnerLayout(){
    return(

    <div>
        <OwnerHeader/>
       <Outlet/>
        <OwnerFooter/>
    </div>
    )
}

export default OwnerLayout
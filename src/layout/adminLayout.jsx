import React from "react";
import { Outlet,useLocation } from 'react-router-dom'
import axiosInstance from '../config/axiosinstance'
import AdminNavbar from "../components/admin/adminNavBar";
import AdminFooter from "../components/admin/adminFooter";
import "./adminlayout.css"


function AdminLayout(){
    return(
         <div className="admin-layout-wrapper">
           <AdminNavbar/> 
           <main className="admin-content">
           <Outlet/>
            </main>
           <AdminFooter/>
         </div>
    )
}

export default AdminLayout
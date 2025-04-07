import { Outlet,Navigate } from "react-router-dom";



const ProtectedAdminRoutes = ()=>{
    const token = localStorage.getItem("token");
    return token ? <Outlet/> : <Navigate to="/admin/adminlogin" replace />
}

export default ProtectedAdminRoutes
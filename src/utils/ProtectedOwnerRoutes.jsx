import { Outlet,Navigate } from "react-router-dom";



const ProtectedOwnerRoutes = ()=>{
    const token = localStorage.getItem("token");
    return token ? <Outlet/> : <Navigate to="/owner/ownerlogin" replace />
}

export default ProtectedOwnerRoutes
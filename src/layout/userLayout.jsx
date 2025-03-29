import React from 'react'
import UserHeader from '../components/user/userHeader'
import { Outlet,useLocation } from 'react-router-dom'
import axiosInstance from '../config/axiosinstance'
import Footer from '../components/user/footer'

function Userlayout() {
  return (
    <div>
        <UserHeader/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Userlayout
import { useState } from 'react'
import Login from './pages/owner/Signup.jsx'
import UserSignUP from './pages/owner/Signup.jsx'
import router from './routes/router.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter,RouterProvider,} from "react-router-dom";

function App() {


  return (
    <>
    <RouterProvider router={router} />
      
    </>
  )
}

export default App

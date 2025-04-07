import { createBrowserRouter } from "react-router-dom";
// import Login from "../pages/owner/Login";

import Userlayout from "../layout/userLayout";


import CreateDish from "../pages/owner/createDishes";
import CreateRestaurant from "../pages/owner/createRestaurant";
import Order from "../pages/user/Order";
import DishesPage from "../pages/user/allDishes";
import UpdateDish from "../pages/owner/updateDish";

import DeleteDish from "../pages/owner/deleteDish";
import AdminSignup from "../pages/admin/adminSignup";
import AdminLogin from "../pages/admin/adminLogin";
import AdminLogout from "../pages/admin/adminLogout";
import AdminProfile from "../pages/admin/adminProfile";
import AdminUpdate from "../pages/admin/adminUpdate";
import AdminDelete from "../pages/admin/adminDelete";
import UserSignup from "../pages/user/userSignUp";
import UserLogin from "../pages/user/userLogin";
import UserProfile from "../pages/user/userProfile";
import UpdateProfile from "../pages/user/userUpdate";
import UserDelete from "../pages/user/userDelete";
import Logout from "../pages/user/userLogout";
import AddToCart from "../pages/user/cartAdd";
import GetCart from "../pages/user/getCart";
import DeleteCart from "../pages/user/deleteCart";
import UpdateCart from "../pages/user/updateCart";
import AddReview from "../pages/user/addReview";
import GetDish from "../pages/user/getDish";
import UpdateRestaurant from "../pages/owner/updateRestaurant";
import RestaurantList from "../pages/user/allRestaurant";
import RestaurantDetails from "../pages/owner/getRestaurant";
import DeleteRestaurant from "../pages/owner/deleteRestaurant";
import CouponForm from "../pages/admin/createCoupon";
import CouponPage from "../pages/admin/getCoupon";
import ApplyCoupon from "../pages/user/applyCoupon";
import UserHome from "../pages/user/UserHome";
import OwnerLayout from "../layout/ownerLayout";
import OwnerLogin from "../pages/owner/Login";
import OwnerDashboard from "../pages/owner/ownerDashBoard";
import OwnerDishes from "../pages/owner/ownerDishes";
import OwnerDishDetails from "../pages/owner/ownerViewDish";
import OwnerSignup from "../pages/owner/Signup"
import OwnerLogout from "../pages/owner/ownerlogout";
import AdminLayout from "../layout/adminLayout";
import AdminDashboard from "../pages/admin/adminDashBoard";
import AdminOrder from "../pages/admin/allOrders";
import OrderStatusPage from "../pages/admin/orderStatus";
import AllUsers from "../pages/admin/allUsers";
import DeleteUser from "../pages/admin/userDelete";
import RestaurantUserView from "../pages/user/getUserRestaurant";
import RestaurantListing from "../pages/user/allRestaurant";
import RestaurantMenuView from "../pages/user/restaurantMenu";
import ProtectedRoutes from "../utils/ProtectedRoutes";
import ProtectedOwnerRoutes from "../utils/ProtectedOwnerRoutes";
import ProtectedAdminRoutes from "../utils/ProtectedAdminRoutes";
import UserOrders from "../pages/user/userOrder";
import PaymentSuccess from "../pages/user/paymentSuccess";
import TransactionHistory from "../pages/user/transactionHistory";








const router=createBrowserRouter([

    {
    path:"",
  element:<Userlayout/>,

  children:[
    {
      path:"",
      element:<UserLogin/>
    },
    {
      path:"signup",
      element:<UserSignup/>
    },
    {
      path:"home",
      element:<UserHome/>
  },
    {
       element:<ProtectedRoutes/>,
       children:[

      
      {
        path:"/userrestaurant/:id",
        element:<RestaurantUserView/>
     },
    //  {
    //   path:"getorders",
    //   element:<Order/>
    // },
    {
     path:"userorder",
     element:<UserOrders/>
    },
    {
      path:"alldishes",
      element:<DishesPage/>
    },

    {
      path:"allrestaurants",
      element:<RestaurantListing/>
   },
   {
    path:"/menu/:id",
    element:<RestaurantMenuView/>
    },
    {
      path:"profile",
      element:<UserProfile/>
    },
    {
      path:"profileupdate",
      element:<UpdateProfile/>
    },
    {
      path:"delete",
      element:<UserDelete/>
    },
    {
      path:"logout",
      element:<Logout/>
    },
    {
      path:"addcart",
      element:<AddToCart/>
    },
    {
      path:"getcart",
      element:<GetCart/>
    },
    {
      path:"deletecart",
      element:<DeleteCart/>
    },
    {
      path:"updatecart",
      element:<UpdateCart/>
    },
    {
      path:"addreview/:dishId",
      element:<AddReview/>
    },
    {
      path:"/getdish/:id",
      element:<GetDish/>
     },
     {
      path:"restaurantlist",
      element:<RestaurantList/>
     },
     {
      path:"applycoupon",
      element:<ApplyCoupon/>
     },
     {
      path:"payment",
      element:<h1>Payment</h1>
     },
     {
      path:"payment/success",
      element:<PaymentSuccess/>
     },
     {
      path:"payment/cancel",
      element:<h1>payment failure</h1>
     }, 
     {
      path:"payment/transaction-details",
      element:<TransactionHistory/>
     }

       ]
    },

  ]
},
    
   
  
 //owner
   
    // {
    //   path:"dish/:id",
    //   element:<DishDetails/>
    // },
    //owner
   
  //  {
  //     path:"allrestaurants",
  //     element:<RestaurantListing/>
  //  },
  
  
 
      


  
    {
      path:"/owner",
      element:<OwnerLayout/>,
      children:[
         {
        path:"addowner",
        element:<OwnerSignup/>
     },
     {
      path:"ownerlogin",
      element:<OwnerLogin/>
    },
      {
        element:<ProtectedOwnerRoutes/>,
        children:[
          {
            path:"ownerlogout",
            element:<OwnerLogout/>
          },
          {
            path:"ownerdashboard",
            element:<OwnerDashboard/>
          },
          {
            path:"addrestaurant",
            element:<CreateRestaurant/>
          },
          {
            path:"adddish",
            element:<CreateDish/>
          },
          {
            path:"updatedish/:id",
            element:<UpdateDish/>
          },
          {
            path:"deletedish/:id",
            element:<DeleteDish/>
          },
          {
            path:"updaterestaurant/:id",
            element:<UpdateRestaurant/>
           },
           {
            path:"restaurants/:ownerId",
            element:<RestaurantDetails/>
           },
           {
            path:"deleterestaurant/:id",
            element:<DeleteRestaurant/>
           },
           {
            path:"ownerdish",
            element:<OwnerDishes/>
            
          },
          {
            path:"viewdish/:id",
            element:<OwnerDishDetails/>
    
          },
        ]
      },
      ]
    },
    {
      path:"admin",
      element:<AdminLayout/>,
      children: [
          {
            path:"addadmin",
            element:<AdminSignup/>
          },
          {
            path:"adminlogin",
            element:<AdminLogin/>
          },
          {
            path:"admindashboard",
            element:<AdminDashboard/>
          },
          {
            element:<ProtectedAdminRoutes/>,
            children:[
              {
                path:"allorders",
                element:<AdminOrder/>
              },
              {
                path:"orderstatus",
                element:<OrderStatusPage/>
              },
              {
                path:"allusers",
                element:<AllUsers/>
              },
              {
                path:"deleteuser/:id",
                element:<DeleteUser/>
              },
              {
                path:"adminprofile",
                element:<AdminProfile/>
              },
              {
                path:"updateadmin",
                element:<AdminUpdate/>
              },
              {
                path:"adminlogout",
                element:<AdminLogout/>
              },
              {
                path:"deleteadmin",
                element:<AdminDelete/>
              },
              {
                path:"createcoupon",
                element:<CouponForm/>
               },
               
               {
                path:"getallcoupon",
                element:<CouponPage/>
               },
               {
                path:"getallcoupon",
                element:<CouponPage/>
               },
                
                 {
                  path:"createcoupon",
                  element:<CouponForm/>
                 },
            ]
          },
         
        
         
         
             
         
    
      ]
    },
   
])

export default router
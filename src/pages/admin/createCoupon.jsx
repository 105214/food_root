
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./createcoupon.css";
const backendurl=import.meta.env.VITE_BACKEND_URL





const CouponForm = () => {
  const navigate=useNavigate()
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const token = localStorage.getItem("token"); 
      console.log("Token being sent:", token); // Debugging step
  
      const response = await axios.post(
        `${backendurl}/coupon/createcoupon`,
        { code, discount, expiryDate },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (!token) {
          
        navigate("/admin/adminlogin");
      }
      setMessage(response.data.message);
      setCode("");
      setDiscount("");
      setExpiryDate("");
      localStorage.clear();
    navigate("/getallcoupon")
    } 
    catch (error) {
      console.error("Request Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Status Code:", error.response.status);
        console.error("Headers:", error.response.headers);
        setMessage(error.response.data.message || "An error occurred.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setMessage("No response from server. Please check your connection.");
      } else {
        console.error("Error setting up request:", error.message);
        setMessage("Request setup error: " + error.message);
      }
    }
  };
  
  return (
    <div className="container coupon-form">
      <h2>Create Coupon</h2>
      {message && <p className="alert alert-info">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Coupon Code</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Discount (%)</label>
          <input
            type="number"
            className="form-control"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
            min="0"
            max="100"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Expiry Date</label>
          <input
            type="date"
            className="form-control"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default CouponForm;

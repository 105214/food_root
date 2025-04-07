import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/deleterestaurant.css";
const backendurl=import.meta.env.VITE_BACKEND_URL



const DeleteRestaurant = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    // Debug information when component mounts
    console.log("Component mounted");
    console.log("Current path:", location.pathname);
    console.log("ID from params:", id);
  }, [id, location]);

  const handleDelete = async () => {
    setMessage("");
    setError("");
    
    console.log("Delete button clicked");
    console.log("ID at time of deletion:", id);
    
    if (!id) {
      setError("Restaurant ID is required");
      return;
    }
    
    try {
      const response = await axios.delete(
        `${backendurl}/restaurant/deleterestaurant/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setMessage(response.data.message);
      
      // Show success message briefly before navigating
      setTimeout(() => {
        navigate('/restaurantlist'); // Adjust this path to your restaurant list page
      }, 1500);
    } catch (err) {
      console.error("Delete error details:", err);
      setError(err.response?.data?.message || "Error deleting restaurant");
    }
  };

  return (
    <div className="container delete-restaurant">
      <h2 className="text-center">Delete Restaurant</h2>
      {/* <p>Current URL path: {location.pathname}</p>
      <p>Restaurant ID from URL: {id || "ID not found in URL parameters"}</p> */}
      <button className="btn btn-danger btn-block" onClick={handleDelete}>
        Delete
      </button>
      {message && <p className="alert alert-success mt-3">{message}</p>}
      {error && <p className="alert alert-danger mt-3">{error}</p>}
    </div>
  );
};

export default DeleteRestaurant; 
 
 
 
import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/getrestaurant.css";
const backendurl=import.meta.env.VITE_BACKEND_URL





const RestaurantDetails = () => {
  const { id } = useParams(); // Get restaurant ID from URL
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
const navigate=useNavigate()
  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  const fetchRestaurantDetails = async () => {
    const ownerId = localStorage.getItem("ownerId");
    if (!ownerId) {
      setError("Owner ID not found. Please log in again.");
      return;
    }
  
    try {
      // Log the URL to confirm what you're requesting
      const url = `${backendurl}/api/restaurant/restaurants/${ownerId}`;
      console.log("Requesting URL:", url);
      
      const response = await axios.get(
        url,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      if (response.data.success && response.data.data.length>0) {
        setRestaurant(response.data.data[0]);
      } else {
        setError("No restaurant found for this owner.");
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      // Add more detailed error logging
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
      }
      setError("Failed to load restaurant details. Please try again.");
    }
  };
  

  if (error) return <p className="text-danger">{error}</p>;
  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="restaurant-details-page">
    <div className="get-restaurant-container">
      <h2>{restaurant.name}</h2>
      
      <img 
        src={restaurant.imageUrl || require('../image/bg2.jpg')} 
        alt={restaurant.name} 
        className="restaurant-image" 
      />
      
      <div className="restaurant-details">
        <div className="detail-item">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{restaurant.name}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{restaurant.location}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Address:</span>
          <span className="detail-value">{restaurant.address}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Phone:</span>
          <span className="detail-value">{restaurant.mobile}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Opening Hours:</span>
          <span className="detail-value">{restaurant.openingHours}</span>
        </div>
        
        <div className="description-section">
          <span className="description-label">Description:</span>
          <span className="description-text">{restaurant.description}</span>
        </div>
      </div>
      
      <div className="button-group">
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/owner/updaterestaurant/${restaurant._id}`)}
        >
          Update
        </button>
        
        <button 
          className="btn btn-danger"
          onClick={() => navigate(`/owner/deleterestaurant/${restaurant._id}`)}
        >
          Delete
        </button>
        
        <button 
          className="btn btn-success"
          onClick={() => navigate(`/owner/adddish`, {state:{restaurantId:restaurant._id}})}
        >
          Add Dish
        </button>
        
        <button 
          className="btn btn-info"
          onClick={() => navigate(`/owner/ownerdish`)}
        >
          View Dishes
        </button>
      </div>
    </div>
  </div>
  );
};

export default RestaurantDetails;

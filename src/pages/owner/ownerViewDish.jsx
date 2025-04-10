import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/ownerdishdetails.css'; // Import the CSS file
const backendurl=import.meta.env.VITE_BACKEND_URL









const OwnerDishDetails = () => {
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishDetails = async () => {
      try {
        const response = await axios.get(`${backendurl}/api/dish/viewdish/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming JWT auth
          }
        });
        setDish(response.data.dish);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dish details');
        setLoading(false);
      }
    };

    fetchDishDetails();
  }, [id]);

  const handleUpdate = () => {
    navigate(`/owner/updatedish/${id}`);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required");
        return;
      }
  
      await axios.delete(`${backendurl}/api/dish/deletedish/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        withCredentials: true
      });
      
      navigate('/owner/ownerdashboard'); // Redirect to dishes list
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || 'Failed to delete dish');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!dish) return <div className="not-found">Dish not found</div>;

  return (
    <div className="dish-details-container">
      <h2>{dish.name}</h2>
      
      <div className="dish-image-container">
        <img 
          src={dish.imageUrl} 
          alt={dish.name} 
          className="dish-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
          }}
        />
      </div>
      
      <p className="dish-description">{dish.description}</p>
      
      <div className="dish-info">
        <p className="price">Price: ${dish.price}</p>
        <p className="category">Category: {dish.category}</p>
      </div>
      
      <div className="action-buttons">
        <button 
          className="update-button" 
          onClick={handleUpdate}
        >
          Update
        </button>
        <button 
          className="delete-button" 
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default OwnerDishDetails;


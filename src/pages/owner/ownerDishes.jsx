import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/ownerDishes.css';
const backendurl=import.meta.env.VITE_BACKEND_URL


const OwnerDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation
  
  useEffect(() => {
    fetchDishes();
  }, []);
  
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${backendurl}/api/dish/dishes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('API Response:', response.data);
      
      const dishesData = response.data && response.data.data;
      setDishes(Array.isArray(dishesData) ? dishesData : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dishes:', err);
      setError('Failed to load dishes. Please try again later.');
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading your dishes...</p>
      </Container>
    );
  }
  
  return (
    <Container className="owner-dishes-container">
      <h1 className="owner-dishes-title">My Restaurant Dishes</h1>
      
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      {Array.isArray(dishes) && dishes.length === 0 && !loading && !error && (
        <div className="no-dishes-container text-center">
          <p>You haven't added any dishes yet</p>
        </div>
      )}
      
      {Array.isArray(dishes) && dishes.length > 0 && (
        <div className="dishes-grid">
          {dishes.map(dish => (
            <div className="dish-card mb-4" key={dish._id}>
              {dish.imageUrl ? (
                <img src={dish.imageUrl} alt={dish.name} className="dish-image" />
              ) : (
                <div className="default-image-placeholder">
                  No Image Available
                </div>
              )}
              <div className="dish-content">
                <div>
                  <h3 className="dish-title">{dish?.name || 'Unnamed Dish'}</h3>
                  <p className="dish-price">${((dish?.price || 0)).toFixed(2)}</p>
                  <p className="dish-description">{dish?.description || 'No description available'}</p>
                  {dish?.category && (
                    <div className="dish-category">
                      <span className="category-badge">{dish.category}</span>
                    </div>
                  )}
                </div>
                <button className="btn btn-primary view-button" onClick={() => navigate(`/owner/viewdish/${dish._id}`)}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default OwnerDishes;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaClock, FaUtensils } from 'react-icons/fa';
import './css/allrestaurant.css';
const backendurl=import.meta.env.VITE_BACKEND_URL


const RestaurantListing = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchRestaurants();
  }, []);
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/', { state: { message: 'Please login to continue' } });
        return;
      }
      
      // Add a try-catch specifically for the API call
      try {
        const response = await axios.get(
          `${backendurl}/api/restaurant/allrestaurants`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          setRestaurants(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch restaurants');
        }
      } catch (axiosError) {
        // Handle token expiration specifically
        if (axiosError.response && axiosError.response.status === 401) {
          // Clear the invalid token
          localStorage.removeItem('userToken');
          // Redirect to login
          navigate('/', { 
            state: { 
              message: 'Your session has expired. Please login again.' 
            } 
          });
          return;
        }
        throw axiosError; // Re-throw for the outer catch
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(err.message || 'An error occurred while fetching restaurant data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && restaurants.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading restaurants...</p>
      </Container>
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <Container className="text-center py-5">
        <div className="error-container p-4 border rounded shadow-sm">
          <h3>Unable to Load Restaurants</h3>
          <p>{error}</p>
          {error.includes('Authentication') ? (
          <Button variant="primary" onClick={() => navigate('/')}>LOGIN</Button>
          ):( 
            <Button variant="primary" onClick={() => fetchRestaurants()}>Try Again</Button> 
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="restaurant-listing-container py-4">
      <div className="listing-header mb-4">
        <h1>Explore Restaurants</h1>
        <p>Discover the best dining experiences in your area</p>
      </div>
      
      {restaurants.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {restaurants.map((restaurant) => (
            <Col key={restaurant._id}>
              <Card className="restaurant-card h-100">
                <div className="restaurant-img-container">
                  <Card.Img 
                    variant="top" 
                    src={restaurant.imageUrl || '/restaurant-placeholder.jpg'} 
                    alt={restaurant.name}
                    className="restaurant-img" 
                  />
                </div>
                <Card.Body>
                  <Card.Title>{restaurant.name}</Card.Title>
                  {restaurant.location && (
                    <div className="restaurant-location mb-2">
                      <FaMapMarkerAlt className="me-1 text-secondary" /> {restaurant.location}
                    </div>
                  )}
                  <Card.Text className="restaurant-description">
                    {restaurant.description?.substring(0, 100)}
                    {restaurant.description?.length > 100 ? '...' : ''}
                  </Card.Text>
                  {restaurant.openingHours && (
                    <div className="restaurant-hours mt-2 mb-3">
                      <FaClock className="me-1 text-secondary" /> {restaurant.openingHours}
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button 
                    variant="outline-primary" 
                    className="w-100" 
                    onClick={() => navigate(`/userrestaurant/${restaurant._id}`)}
                  >
                    <FaUtensils className="me-2" /> View Restaurant
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="no-results text-center py-5">
          <div className="no-results-icon mb-3">
            <FaUtensils size={40} />
          </div>
          <h3>No Restaurants Found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </Container>
  );
};

export default RestaurantListing;



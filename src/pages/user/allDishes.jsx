import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from "react-bootstrap";
import "./alldishes.css";
const backendurl=import.meta.env.VITE_BACKEND_URL



const DishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Centralized add to cart handler
  const handleAddToCart = async (dish) => {
    try {
      const token = localStorage.getItem("token");
     
      if (!token) {
        setError("Please log in to add items to the cart.");
        return;
      }
    
      const response = await axios.post(
        `${backendurl}/api/cart/addcart`,
        {
          dishId: dish._id,
          quantity: 1,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
    
      if (response.data.success) {
        navigate("/addcart");
      } else {
        setError(response.data.message || "Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
      setError(error.response?.data?.message || "Error adding item to cart.");
    }
  };

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }
        
        const response = await axios.get(`${backendurl}/api/dish/alldishes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const fetchedDishes = response.data.dishes || [];
        
        const validDishes = fetchedDishes.map(dish => ({
          _id: dish._id || `dish-${Math.random().toString(36).substr(2, 9)}`,
          name: dish.name || 'Unnamed Dish',
          price: dish.price || 0,
          imageUrl: dish.imageUrl || '/placeholder-dish.jpg',
          description: dish.description || 'No description available',
          category: dish.category || 'Uncategorized',
          restaurantName: dish.restaurantName || 'Unknown Restaurant'
        }));

        // Set user info from response
        if (response.data.user) {
          setUserInfo(response.data.user);
        }

        setDishes(validDishes);
        setError(validDishes.length === 0 ? "No dishes found" : "");
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                             error.message || 
                             "Unknown error occurred";
        
        // Handle unauthorized access
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [navigate]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="dishes-container mt-4">
      {userInfo && (
        <div className="text-center mb-3">
          <h3>Welcome, {userInfo.name}</h3>
        </div>
      )}

      <h2 className="text-center mb-4">Our Delicious Dishes 🍽️</h2>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <Col key={dish._id} xl={3} lg={4} md={6} sm={12} className="mb-4">
              <Card className="dish-card h-100 d-flex flex-column">
                <Card.Img 
                  variant="top" 
                  src={dish.imageUrl} 
                  alt={dish.name}
                  className="dish-image" 
                  onError={(e) => { e.target.src = "/placeholder-dish.jpg"; }}
                />
                
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center">{dish.name}</Card.Title>

                  <div className="mb-2 text-center">
                    <Badge bg="secondary" className="me-2">{dish.category}</Badge>
                    <span className="fw-bold">Price: ₹{dish.price.toFixed(2)}</span>
                  </div>

                  <Card.Text className="text-truncate flex-grow-1">
                    {dish.description.length > 100 
                      ? `${dish.description.slice(0, 100)}...` 
                      : dish.description}
                  </Card.Text>

                  <div className="mt-auto d-flex flex-column flex-sm-row">
                    <Button 
                      variant="primary" 
                      className="me-sm-2 mb-2 mb-sm-0" 
                      onClick={() => handleAddToCart(dish)}
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      variant="info" 
                      onClick={() => navigate(`/getdish/${dish._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">
              {error || "No dishes available at the moment."}
            </p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default DishesPage;
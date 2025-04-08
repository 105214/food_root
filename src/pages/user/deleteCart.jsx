import React, { useState, useEffect } from "react";
import { Container, Button, ListGroup, Alert, Badge, Row, Col } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./deleteCart.css";
const backendurl=import.meta.env.VITE_BACKEND_URL



const DeleteCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }
  
      console.log("Sending Request with Token:", token);
  
      const response = await axios.get(`${backendurl}/api/cart/getcart`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log("Full Cart Response:", response.data);
      
      const fetchedCartItems = response.data.cart?.items || [];
      setCartItems(fetchedCartItems);
      setIsLoading(false);
    } catch (err) {
      console.error("Detailed Fetch Error:", {
        response: err.response,
        request: err.request,
        message: err.message
      });
      
      // More detailed error handling
      if (err.response) {
        console.log("Error Response Details:", {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      }
      
      setError("Failed to fetch cart");
      setIsLoading(false);
    }
  };
 

  useEffect(() => {
    fetchCart();
  }, []); // Empty dependency array to run only once on mount

  const handleDelete = async (item) => {
    // Validate token before making delete request
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please log in again");
      return;
    }

    try {
      // More robust dish ID extraction
      const dishId = item.dishId?._id || item.dishId || item._id;
      
      if (!dishId) {
        setError("Invalid Food ID");
        return;
      }

      const response = await axios.delete(
        `${backendurl}/api/cart/deletecart/${dishId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // More flexible response handling
      const updatedCart = response.data.cart || 
                          response.data.updatedCart || 
                          { items: [] };
      
      setMessage(response.data.message || "Item successfully removed");
      setError("");
      setCartItems(updatedCart.items);
      
      console.log("API Response after delete:", response.data);
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err);
      
      // More comprehensive error handling
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Authentication failed. Please log in again.");
            localStorage.removeItem("token");
            break;
          case 404:
            setError("Item not found in cart.");
            break;
          default:
            setError(err.response.data?.message || "Something went wrong");
        }
      } else if (err.request) {
        setError("No response received from server");
      } else {
        setError("Error processing your request");
      }
      
      setMessage("");
    }
  };

  // Calculate subtotal for an item
  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  // Calculate total cart value
  const calculateCartTotal = () => {
    return cartItems
      .reduce((total, item) => total + (item.price * item.quantity), 0)
      .toFixed(2);
  };

  return (
    <Container className="delete-dishes-container">
      <h2>Your Cart Items</h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {isLoading ? (
        <Alert variant="info">Loading cart...</Alert>
      ) : cartItems.length > 0 ? (
        <>
          <ListGroup>
            {cartItems.map((item) => {
              const dishInfo = item.dishId && typeof item.dishId === 'object' ? item.dishId : item;
              return (
                <ListGroup.Item key={item._id} className="cart-item">
                  <Row className="align-items-center">
                    <Col md={7}>
                      <h5>{dishInfo.name}</h5>
                      <div className="item-details">
                        {dishInfo.category && (
                          <Badge bg="secondary" className="me-2">
                            {dishInfo.category}
                          </Badge>
                        )}
                        <span className="text-muted">
                          Price: ₹{dishInfo.price || item.price}
                        </span>
                        <span className="text-muted ms-3">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      {dishInfo.description && (
                        <p className="text-muted small mt-1">{dishInfo.description}</p>
                      )}
                    </Col>
                    <Col md={3} className="text-end">
                      <h5>₹{calculateItemTotal(item)}</h5>
                    </Col>
                    <Col md={2} className="text-end">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          
          <div className="cart-summary mt-4">
            <Row>
              <Col md={8}></Col>
              <Col md={4}>
                <ListGroup>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Subtotal:</strong>
                    <span>₹{calculateCartTotal()}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <Alert variant="info">Your cart is empty.</Alert>
      )}
    </Container>
  );
};

export default DeleteCart;

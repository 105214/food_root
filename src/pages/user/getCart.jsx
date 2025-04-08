import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./getcart.css";
import { useNavigate } from "react-router-dom";
const backendurl=import.meta.env.VITE_BACKEND_URL



const GetCart = () => {
    const navigate=useNavigate()
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${backendurl}/api/cart/getcart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCart(response.data.cart);
      } catch (err) {
        setError("Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);



  if (loading) return <Spinner animation="border" className="loading-spinner" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="cart-container">
      <h2 className="text-center my-4">Your Cart</h2>
      {cart && cart.items.length > 0 ? (
        <Table striped bordered hover responsive className="cart-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.dishId._id}>
                <td>{item.dishId.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => navigate("/deletecart")}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">Your cart is empty.</p>
      )}
      <div className="text-end mt-3">
        <h4>Total Price: ${cart?.totalPrice.toFixed(2)}</h4>
        <Button variant="primary" className="checkout-btn">Checkout</Button>
      </div>
    </Container>
  );
};

export default GetCart;

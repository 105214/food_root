import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./applyCoupon.css";

const ApplyCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [discount, setDiscount] = useState(null);
  const [newTotal, setNewTotal] = useState(null);
  
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setMessage("");
    setDiscount(null);
    setNewTotal(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/api/coupon/applycoupon",
        { couponCode },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
      setDiscount(response.data.discountAmount);
      setNewTotal(response.data.newTotalPrice);
      setCouponCode("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  return (
    <Container className="coupon-container">
      <Card className="shadow coupon-card">
        <Card.Body>
          <h2 className="text-center">Apply Coupon</h2>
          {message && <Alert variant={discount ? "success" : "danger"}>{message}</Alert>}
          <Form onSubmit={handleApplyCoupon}>
            <Form.Group controlId="couponCode">
              <Form.Label>Enter Coupon Code</Form.Label>
              <Form.Control
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                required
                placeholder="Enter code"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Apply Coupon
            </Button>
          </Form>
          {discount !== null && (
            <div className="mt-3 text-center">
              <p><strong>Discount Applied:</strong> ${discount.toFixed(2)}</p>
              <p><strong>New Total Price:</strong> ${newTotal.toFixed(2)}</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ApplyCoupon;

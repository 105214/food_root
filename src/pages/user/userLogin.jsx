import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import loginImage from "./image/login-side.webp";
import "./css/userlogin.css";

const UserLogin = () => {
  const navigate=useNavigate()

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const location = useLocation();
  const message1 = location.state?.message;
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setMessage(null);

  try {
    const response = await axios.put("http://localhost:3001/api/user/login", formData);
    
    // Validate token before storing
    if (response.data.token) {
      try {
        // Changed from userToken to token for consistency
        localStorage.setItem("token", response.data.token);
        setMessage("Login successful!");
        navigate('/home');
      } catch (storageError) {
        setError("Unable to save login session. Please check browser settings.");
        console.error("Token storage error:", storageError);
      }
    } else {
      setError("No authentication token received.");
    }
  } catch (error) {
    setError(error.response?.data?.message || "Login failed. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="background-container">
    <Container className="login-container">
      <div className="shadow-box">
        <Col className="image-container">
          <img src={loginImage} alt="Login" className="img-fluid" />
        </Col>
        <Col>
          <Card className="login-card">
            <Card.Body>
            {message1 && <Alert variant="info">{message1}</Alert>}
              <h2 className="text-center mb-4">Login</h2>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>
              <p className="text-center mt-3">
                Don't have an account? <a href="/signup">Sign Up</a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </div>
    </Container>
  </div>

  );
};

export default UserLogin;

import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./css/login.css"; // Import custom CSS
const backendurl=import.meta.env.VITE_BACKEND_URL



const OwnerLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // Error message
  const navigate = useNavigate(); // For redirection

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    try {
      const response = await axios.put(
        `${backendurl}/api/owner/ownerlogin`,
        credentials
      );
  
      if (response.data.token && response.data.ownerId) {
        localStorage.setItem("token", response.data.token); // Store token
        localStorage.setItem("ownerId", response.data.ownerId); // Store ownerId
        console.log("Token stored:", localStorage.getItem("token"));
        console.log("Owner ID stored:", localStorage.getItem("ownerId"));
  
        navigate("/owner/ownerdashboard"); // Redirect to owner dashboard
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Try again.");
    }
  };
  


  return (
    <div className="login-page">
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Col md={5}>
        <div className="login-box">
          <h2 className="text-center">Owner Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/owner/addowner">Create one</Link>
            </p>
          </Form>
        </div>
      </Col>
    </Container>
  </div>
  );
};

export default OwnerLogin;

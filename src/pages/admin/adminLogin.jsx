import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import "./css/adminlogin.css";
const backendurl=import.meta.env.VITE_BACKEND_URL







const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.put(
        `${backendurl}/api/admin/adminlogin`, 
        formData, 
        { withCredentials: true } // This allows cookies to be set
      );
      
      // Set token in localStorage
      localStorage.setItem("token", response.data.token);
      
      // Show success message
      setMessage(response.data.message || "Login successful");
      setError("");
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/admin/admindashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container className="login-container">
      <Card className="shadow login-card">
        <Card.Body>
          <h2 className="text-center">Admin Login</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="inputs"
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="inputs"
                placeholder="Enter your password"
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="mt-3 w-100"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogin;


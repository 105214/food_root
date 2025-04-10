import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Card, Alert } from "react-bootstrap";
import "./css/adminlogout.css";
const backendurl=import.meta.env.VITE_BACKEND_URL




const AdminLogout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: No token found");
      setTimeout(() => navigate("/admin/adminlogin"), 2000);  // Redirect to login page
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: No token found");
        setTimeout(() => navigate("/admin/adminlogin"), 2000);
        return;
      }

      const response = await fetch(`${backendurl}/api/admin/adminlogout`, {
        method: "PUT", // Change to POST if needed
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      localStorage.removeItem("token"); // Remove token immediately

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Logged out successfully");
      } else {
        setError("Logout failed. Please try again.");
      }
      
      setTimeout(() => navigate("/admin/adminlogin"), 2000);
      
    } catch (err) {
      console.error("Logout error:", err);
      setError("Network error. Try again.");
      setTimeout(() => navigate("/admin/adminlogin"), 2000);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center logout-container">
      <Card className="text-center p-4 logout-card">
        <Card.Header as="h2">Admin Logout</Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Button 
            variant="danger" 
            size="lg" 
            onClick={handleLogout} 
            className="mt-3"
          >
            Logout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogout;

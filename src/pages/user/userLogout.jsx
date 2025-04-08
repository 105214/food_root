import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Container, Card, Alert } from "react-bootstrap";
import "./userlogout.css";
const backendurl=import.meta.env.VITE_BACKEND_URL





const UserLogout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");



  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      if (!token) {
        setError("Unauthorized: No token found");
        return;
      }
  
      console.log("Token:", token); // Log token for debugging
  
      const response = await fetch(`${backendurl}/api/user/logout`, {
        method: "PUT",
        credentials:"include",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error("Logout failed");
      }
  
      localStorage.removeItem("token"); // Remove token on logout
      setMessage("User logged out successfully.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Logout failed");
    }
  };
  
  
  


  return (
    <Container className="logout-container">
      <Card className="shadow logout-card">
        <Card.Body>
          <h2 className="text-center"> Logout</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Button variant="danger" onClick={handleLogout} className="mt-3 w-100">
            Logout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserLogout;
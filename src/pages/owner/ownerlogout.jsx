import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ownerlogout.css";
const backendurl=import.meta.env.VITE_BACKEND_URL




const OwnerLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      await axios.put(
        `${backendurl}/api/owner/ownerlogout`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }, // Attach token
        }
      );
  
      localStorage.removeItem("ownerId");
      localStorage.removeItem("token"); // Remove token after logout
      navigate("/owner/ownerlogin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

  return (
    <Container className="logout-container">
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="logout-card text-center">
            <Card.Body>
              <h2 className="logout-title">Are you sure you want to logout?</h2>
              <p className="logout-text">You will be redirected to the login page.</p>
              <Button variant="danger" className="logout-btn" onClick={handleLogout}>
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OwnerLogout;

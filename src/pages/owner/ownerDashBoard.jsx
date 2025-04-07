import React from "react";
import "./css/ownerdashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  const ownerId = localStorage.getItem("ownerId");
  console.log("ownerid", ownerId);
  
  return (
<div className="dashboard-container">
      <div className="dashboard-background"></div>
      <div className="main-content">
        <Container>
          <div className="welcome-section">
            <h2 className="welcome-title">Welcome, Owner</h2>
            <p className="welcome-subtitle">Manage your restaurant business efficiently</p>
          </div>
          <Row className="dashboard-cards">
            <Col md={6} className="mb-4">
              <Card className="dashboard-card">
                <div className="card-icon">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <Card.Body>
                  <Card.Title>Create Restaurant</Card.Title>
                  <Card.Text>Add a new restaurant to your portfolio</Card.Text>
                  <Link to="/owner/addrestaurant" className="btn btn-primary dashboard-btn">Get Started</Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="dashboard-card">
                <div className="card-icon">
                  <i className="fas fa-list"></i>
                </div>
                <Card.Body>
                  <Card.Title>View Restaurant</Card.Title>
                  <Card.Text>See and manage your existing restaurants</Card.Text>
                  <Link to={`/owner/restaurants/${ownerId}`} className="btn btn-primary dashboard-btn">View Details</Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div> 

  );
};

export default OwnerDashboard;


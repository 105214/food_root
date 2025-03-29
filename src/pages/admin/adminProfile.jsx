import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Image, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./adminprofile.css";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  
    // Modify your axios call to include logging
    useEffect(() => {
        const fetchAdminProfile = async () => {
          
          try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            console.log("Using token:", token); // Check token
      
            if (!token) {
              setError("Unauthorized: No token found");
              setIsLoading(false);
              return; // Ensure function exits if no token
            }
      
            console.log("Making API call with headers:", {
              Authorization: `Bearer ${token}`
            }); // Check headers
      
            const response = await axios.get("http://localhost:3001/api/admin/adminprofile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            console.log("API Response:", response.data); // Check response
            setAdminData(response.data.data);
            setMessage(response.data.message);
          } catch (err) {
            console.error("API Error:", err.response); // Log full error
            setError(
              err.response?.data?.message || "Failed to fetch admin profile"
            );
          } finally {
            setIsLoading(false); // Ensure loading state is updated
          }
        };
        

        fetchAdminProfile();
    }, []);

  
  
    const handleUpdate = () => {
      navigate("/admin/updateadmin");
    };
  
    const handleDelete = () => {
      navigate("/admin/deleteadmin");
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin/adminlogout");
      }; // <- No extra closing brace here
       



  return(
    
    <Container className="py-5">
    <Card className="shadow">
      <Card.Body className="p-4">
        <h2 className="text-center mb-4">Admin Profile</h2>

        {message && <Alert variant="success" dismissible>{message}</Alert>}
        {error && <Alert variant="danger" dismissible>{error}</Alert>}

        {isLoading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p>Loading profile...</p>
          </div>
        ) : adminData ? (
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              {adminData.profilePic ? (
                <Image
                  src={adminData.profilePic}
                  alt="Admin Profile"
                  roundedCircle
                  fluid
                  className="profile-image mb-3"
                  style={{ width: "200px", height: "200px", objectFit: "cover" }}
                />
              ) : (
                <div 
                  className="profile-placeholder rounded-circle mx-auto d-flex align-items-center justify-content-center bg-light"
                  style={{ width: "200px", height: "200px" }}
                >
                  <i className="bi bi-person-circle" style={{ fontSize: "4rem" }}></i>
                </div>
              )}
            </Col>
            <Col md={8}>
              <div className="p-3">
                <Row className="mb-3">
                  <Col sm={4} className="fw-bold">Name:</Col>
                  <Col sm={8}>{adminData.name}</Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4} className="fw-bold">Email:</Col>
                  <Col sm={8}>{adminData.email}</Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4} className="fw-bold">Mobile:</Col>
                  <Col sm={8}>{adminData.mobile}</Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={4} className="fw-bold">Role:</Col>
                  <Col sm={8}>{adminData.role}</Col>
                </Row>
                <Row className="mb-4">
                  <Col sm={4} className="fw-bold">Status:</Col>
                  <Col sm={8}>
                    <span className={`badge ${adminData.isActive ? 'bg-success' : 'bg-danger'}`}>
                      {adminData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Col>
                </Row>
                <div className="mt-4 d-flex gap-2">
                    <Button variant="primary" onClick={handleUpdate}>Update</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                    <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                  </div>
                {/* <div className="mt-4">
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </div> */}
              </div>
            </Col>
          </Row>
        ) : (
          <Alert variant="info">No profile data available. Please try again later.</Alert>
        )}
      </Card.Body>
    </Card>
  </Container>
  );
}

export default AdminProfile;









  
import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./admindelete.css";
const backendurl=import.meta.env.VITE_BACKEND_URL




const AdminDelete = () => {
  const navigate=useNavigate()
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem("token"); // Retrieve token
  
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(`${backendurl}/admin/adminprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Admin Data:", response.data)
        setAdmin(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch admin profile");
        setLoading(false);
      }
    };
  
    fetchAdminProfile();
  }, []);
  

 
  const handleDelete = async () => {
    if (!admin) return;
    setLoading(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }
  
    try {
      await axios.delete(`${backendurl}/admin/deleteadmin`, {
        headers: { Authorization: `Bearer ${token}` }, // Include the token
        data: { _id: admin._id },
      });
  
      setSuccess("Admin profile deleted successfully");
      setAdmin(null);
      navigate("/admin/adminlogin")
    } catch (error) {
      setError("Failed to delete admin profile");
    }
    setLoading(false);
  };
  
  return (
    <Container className="delete-admin-container">
      <Row className="justify-content-center">
        <Col md={6}>
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {admin && (
            <Card className="admin-card">
              <Card.Img variant="top" src={admin?.profilePic||"https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="} className="admin-avatar" />
              <Card.Body>
                <Card.Title>{admin?.name||"No name available"}</Card.Title>
                <Card.Text>Email: {admin?.email||"No email"}</Card.Text>
                <Button variant="danger" onClick={handleDelete} disabled={loading}>
                  {loading ? "Deleting..." : "Delete Admin"}
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDelete;

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./userprofile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("Authentication failed. Please login again.");
      navigate("/");  // Redirect to login if token is missing
      return;
    }
  
    console.log("Token:", token); // Debugging
  
    try {
      const response = await axios.get("http://localhost:3001/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      if (response.data && response.data.data) {
        setUser(response.data.data);
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Failed to fetch profile. Please try again.");
      }
    }
  
    setLoading(false);
  };
  
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = () => navigate("/profileupdate");
  const handleDelete = () => navigate("/delete");

  return (
    <Container className="profile-container">
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading profile...</p>
        </div>
      ) : error ? (
        <div>
          <Alert variant="danger">{error}</Alert>
          <div className="mt-3">
            <Button variant="primary" onClick={fetchProfile}>Retry</Button>
          </div>
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="profile-card">
              <Card.Body className="text-center">
                <Image 
                  src={user?.profilePic || "https://via.placeholder.com/150"} 
                  roundedCircle 
                  className="profile-img" 
                />
                <h2 className="mt-3">{user?.name || "No Name"}</h2>
                <p className="text-muted">{user?.email || "No Email"}</p>
                <p className="text-muted">📞 {user?.mobile || "No Mobile"}</p>

                <div className="mt-4 d-flex justify-content-center gap-3">
                  <Button variant="primary" onClick={handleUpdate}>Update Profile</Button>
                  <Button variant="danger" onClick={handleDelete}>Delete Account</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default UserProfile;

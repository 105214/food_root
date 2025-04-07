import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './userdelete.css'
const backendurl=import.meta.env.VITE_BACKEND_URL



const UserDelete = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
        try {
          const response = await axios.get(`${backendurl}/user/profile`, {
            withCredentials: true, 
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              
            },
          });
          console.log("Stored Token:", localStorage.getItem("token"));
          console.log("User Data:", response.data); // Debugging line
          setUser(response.data.data);
        } catch (err) {
          console.error("Error fetching user:", err.response ? err.response.data : err);
          setError("Failed to fetch user profile");
        } finally {
          setLoading(false);
        }
      };
      
    fetchUser();
  }, []);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get token
  
      if (!token) {
        setError("User is not authenticated.");
        return;
      }
  
      await axios.delete(`${backendurl}/user/delete`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request
        },
        data: { _id: user._id },
        withCredentials: true,
      });
  
      setSuccess("User profile deleted successfully");
      setUser(null);
    } catch (err) {
      console.error("Delete Error:", err.response ? err.response.data : err);
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {loading && <Spinner animation="border" />} 
      {error && <Alert variant="danger">{error}</Alert>} 
      {success && <Alert variant="success">{success}</Alert>} 

      {user && (
        <Card className="p-4 text-center shadow-lg w-50">
          <Card.Img
            variant="top"
            src={user.profilePic || "https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc"}
            className="rounded-circle mx-auto d-block"
            style={{ width: "100px", height: "100px" }}
          />
          <Card.Body>
            <Card.Title>{user.name}</Card.Title>
            <Card.Text>{user.email}</Card.Text>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete Profile"}
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserDelete;

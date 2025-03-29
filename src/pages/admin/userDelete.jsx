import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Container, Card, Button } from "react-bootstrap";

const DeleteUser = () => {
  const { id } = useParams(); // Get user ID from URL
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const deleteUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.delete(`http://localhost:3001/api/admin/deleteuser/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMessage(response.data.message);
        setError("");

        setTimeout(() => navigate("/admin/admindashboard"), 2000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
        setMessage("");
      }
    };

    if (id) {
      deleteUser();
    }
  }, [id, navigate]);

  return (
    <Container className="delete-user-container">
      <Card className="shadow delete-user-card">
        <Card.Body>
          <h2 className="text-center">Deleting User...</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Button variant="secondary" onClick={() => navigate("/admin/admindashboard")} className="mt-3 w-100">
            Back to Dashboard
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DeleteUser;


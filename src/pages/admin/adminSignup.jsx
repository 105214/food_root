import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import "./css/adminsignup.css";
const backendurl=import.meta.env.VITE_BACKEND_URL

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image:null,
    mobile: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("password", formData.password);
  formDataToSend.append("mobile", formData.mobile);
  if(formData.image){ 
  formDataToSend.append("profilePic", formData.image);
  }
    try {
      const response = await axios.post(`${backendurl}/admin/addadmin`, formDataToSend,
        {
            headers: {
            'Content-Type': 'multipart/form-data',
        },
      }
      );
      setMessage(response.data.message);
      setError("");
      setTimeout(() => navigate("/admin/adminlogin"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setMessage("");
    }
  };

  return (
    <Container className="signup-container">
      <Card className="shadow signup-card">
        <Card.Body>
          <h2 className="text-center">Admin Signup</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </Form.Group>
            <Form.Group controlId="mobile">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="profilePic">
              <Form.Label>Profile Picture URL</Form.Label>
              <Form.Control
                type="file"
                name="image"
                // value={formData.image}
                onChange={handleChange}
                accept="image/*"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Signup
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminSignup;

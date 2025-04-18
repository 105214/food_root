import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/usersignup.css";

const backendurl=import.meta.env.VITE_BACKEND_URL



const UserSignup = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("address", formData.address);
    
    if (profilePic) {
      formDataToSend.append("profilePic", profilePic);
    }

    try {
      await axios.post(`${backendurl}/api/user/signup`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Signup successful! Please login.");
      setFormData({ name: "", email: "", password: "", mobile: "", address: "" });
      setPreview("https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg");
      setProfilePic(null);
     navigate('/')
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="signup-page">
      <Container className="signup-container">
        <Row className="g-0 justify-content-center">
          <Col md={8} className="form-col">
            <div className="form-wrapper">
              <h2 className="text-center mb-4">CREATE AN ACCOUNT</h2>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
        
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group className="mb-3 text-center">
                  <div className="avatar-container">
                    <Image src={preview} roundedCircle className="profile-preview mb-2" />
                  </div>
                  <div className="profile-upload">
                    <Button as="label" htmlFor="profile-upload" className="choose-file-btn">
                      Choose File
                      <Form.Control 
                        id="profile-upload"
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="d-none"
                      />
                    </Button>
                  </div>
                </Form.Group>
        
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Enter your name" 
                    required 
                  />
                </Form.Group>
        
                <Form.Group controlId="formMobile" className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleChange} 
                    placeholder="+91 99xxxxxx" 
                    required 
                  />
                </Form.Group>
        
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Enter email" 
                    required 
                  />
                </Form.Group>
        
                <Form.Group controlId="formAddress" className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={2}
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Enter your address" 
                    className="address-input"
                    required 
                  />
                </Form.Group>
        
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Password" 
                    required 
                  />
                </Form.Group>
        
                <Button 
                  variant="warning" 
                  type="submit" 
                  className="w-100 mt-3 submit-btn" 
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Submit"}
                </Button>
              </Form>
        
              <p className="text-center mt-3">
                Already have an account? <a href="/" className="login-link">Login</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserSignup;

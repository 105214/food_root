import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/adminupdate.css";
const backendurl=import.meta.env.VITE_BACKEND_URL

const AdminUpdate = () => {
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", profilePic: null });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found");
          setIsLoading(false);
          return;
        }
        
        const response = await axios.get(`${backendurl}/api/admin/adminprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setFormData({...response.data.data, profilePic: null});
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch admin profile");
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] }); 
    }else{

      setFormData({ ...formData, [name]:value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("_id", formData._id);
      if (formData.profilePic) {
        formDataToSend.append("profilePic", formData.profilePic); // Append file only if selected
      }

      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await axios.put(`${backendurl}/api/admin/updateadmin`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      });
      
      setMessage(response.data.message);
      navigate("/admin/adminprofile")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow p-4">
        <h2 className="text-center mb-4">Update Profile</h2>
        {message && <Alert variant="success" dismissible>{message}</Alert>}
        {error && <Alert variant="danger" dismissible>{error}</Alert>}
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture URL</Form.Label>
              <Form.Control type="file" name="profilePic"  onChange={handleChange} accept="image/*"/>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Update Profile</Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default AdminUpdate;

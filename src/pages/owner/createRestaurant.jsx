import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/createRestaurant.css";
const backendurl=import.meta.env.VITE_BACKEND_URL




function CreateRestaurant() {
  const navigate=useNavigate()
  const [restaurant, setRestaurant] = useState({
    name: "",
    location: "",
    address: "", // Added Address Field
    mobile: "",
    openingHours: "",
    description: "", // Added Description Field
    image: null,
  });

  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      setRestaurant({ ...restaurant, image: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setRestaurant({ ...restaurant, [name]: value });
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Token before request:", token);
  
    if (!token) {
      console.error("No authentication token found");
      alert("You are not authorized. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", restaurant.name);
    formData.append("location", restaurant.location);
    formData.append("address", restaurant.address);
    formData.append("mobile", restaurant.mobile);
    formData.append("openingHours", restaurant.openingHours);
    formData.append("description", restaurant.description);
    if (restaurant.image) {
      formData.append("image", restaurant.image);
    }
  
    try {
      const response = await axios.post(`${backendurl}/api/restaurant/addrestaurant`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
      });
  
      console.log("Response:", response);
      alert("Restaurant Added Successfully");
      setRestaurant({ name: "", location: "", address: "", mobile: "", openingHours: "", description: "", image: null });
      setPreviewImage("");
      navigate('/owner/ownerdashboard')
    } catch (error) {
      console.error("Error adding restaurant:", error.response ? error.response.data : error.message);
      alert("Failed to add restaurant");
    }
  };
  
  
  console.log(localStorage.getItem("token"));
  return (
    // Wrap everything in the new parent div with background
<div className="page-background">
  <div className="content">
    <Container className="restaurant-container">
      <h2 className="text-center">Add New Restaurant</h2>
      <Form onSubmit={handleSubmit} className="restaurant-form">
        <Row>
          <Col md={6}>
            <Form.Group controlId="restaurantName">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={restaurant.name}
                onChange={handleChange}
                required
                placeholder="Enter restaurant name"
              />
            </Form.Group>

            <Form.Group controlId="restaurantLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={restaurant.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
              />
            </Form.Group>

            <Form.Group controlId="restaurantAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={restaurant.address}
                onChange={handleChange}
                required
                placeholder="Enter address"
              />
            </Form.Group>

            <Form.Group controlId="restaurantMobile">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                name="mobile"
                value={restaurant.mobile}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="restaurantOpeningHours">
              <Form.Label>Opening Hours</Form.Label>
              <Form.Control
                type="text"
                name="openingHours"
                value={restaurant.openingHours}
                onChange={handleChange}
                required
                placeholder="e.g., 9:00 AM - 10:00 PM"
              />
            </Form.Group>

            <Form.Group controlId="restaurantDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={restaurant.description}
                onChange={handleChange}
                required
                placeholder="Enter restaurant description"
              />
            </Form.Group>

            <Form.Group controlId="restaurantImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />
            </Form.Group>

            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Restaurant Preview" className="preview-img" />
              </div>
            )}
            <Button variant="success" type="submit" className="submit-btn add-restaurant">
              Add Restaurant
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  </div>
  {/* Footer would go here if needed */}
</div>
  );
}

export default CreateRestaurant;





























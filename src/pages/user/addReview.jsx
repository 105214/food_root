import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from "react-icons/fa";
import './addreview.css';

const AddReview = () => {
  const { dishId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ rating: 0, comment: '' });
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const fetchDishDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view dish details.");
          setLoading(false);
          return;
        }
  
        const response = await axios.get(
          `http://localhost:3001/api/dish/getdish/${dishId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setDish(response.data);
        setFormData(prev => ({ ...prev, dishId }));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dish details:", err);
        setError('Failed to load dish details. Please try again.');
        setLoading(false);
      }
    };
  
    if (dishId) fetchDishDetails();
  }, [dishId]);

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("dishid",dishId)
    if (!dishId) {
      setError("Dish ID is missing.");
      return;
    }
  
    if (formData.rating === 0) {
      setError("Please select a rating.");
      return;
    }
  
    if (formData.comment.length < 5) {
      setError("Comment must be at least 5 characters long.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to submit a review.");
      return;
    }
  console.log("dishId",dishId);
  
    console.log("Submitting Review:", { dishId, ...formData });
  
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3001/api/review/addreview",
        { dishId,rating:formData.rating,comment:formData.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setSuccess("Review added successfully!");
      setError("");
      setTimeout(() => navigate(`/getdish/${dishId}`), 2000);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="review-container my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Add Your Review</h3>
            </Card.Header>
            <Card.Body>
              {dish && (
                <div className="dish-info mb-4">
                  <h4>{dish.name}</h4>
                  {dish.image && <img src={dish.image} alt={dish.name} className="dish-image mb-3" />}
                  <p>{dish.description}</p>
                  <div className="price-tag mb-3">${dish.price?.toFixed(2)}</div>
                </div>
              )}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Rate this dish</Form.Label>
                  <div className="star-rating">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index}>
                          <input type="radio" name="rating" value={ratingValue} onClick={() => handleRatingChange(ratingValue)} className="star-radio" />
                          <FaStar className="star" color={ratingValue <= (hover || formData.rating) ? "#ffc107" : "#e4e5e9"} size={30} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(0)} />
                        </label>
                      );
                    })}
                  </div>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Your Review</Form.Label>
                  <Form.Control as="textarea" rows={4} name="comment" value={formData.comment} onChange={handleInputChange} placeholder="Share your experience with this dish (minimum 5 characters)" className="review-textarea" />
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg">Submit Review</Button>
                  <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mt-2">Cancel</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddReview;

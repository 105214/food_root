import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import "./css/createDishes.css";
const backendurl=import.meta.env.VITE_BACKEND_URL





function CreateDish() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const restaurantIdFromState = location.state?.restaurantId;
  
  // State for restaurants list
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(id || restaurantIdFromState || "");
  
  const [dish, setDish] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: true,
    ingredients: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all restaurants owned by the current user
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }
const ownerId=localStorage.getItem("ownerId")
        const response = await axios.get(
          `${backendurl}/api/restaurant/restaurants/${ownerId}`, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        console.log("Restaurants API response:", response.data);
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setRestaurants(response.data.data);
          
          // If no restaurant is selected yet but we have restaurants, select the first one
          if (!selectedRestaurantId && response.data.data.length > 0) {
            setSelectedRestaurantId(response.data.data[0]._id);
          }
        } else {
          setError("No restaurants found. Please add a restaurant first.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Failed to fetch restaurants. " + (error.response?.data?.message || error.message));
      }
    };

    fetchRestaurants();
  }, []); // Empty dependency array to run once on component mount

  // If we have a specific restaurant ID, fetch its details
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!selectedRestaurantId) return;
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await axios.get(
          `${backendurl}/api/restaurant/restaurantview/${selectedRestaurantId}`, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        console.log("Restaurant details API response:", response.data);
        if (!response.data.data) {
          setError("Restaurant details could not be loaded.");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        // Don't set error here as it might interfere with the main flow
      }
    };

    if (selectedRestaurantId) {
      fetchRestaurantData();
    }
  }, [selectedRestaurantId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDish({ ...dish, [name]: value });
  };

  const handleRestaurantChange = (e) => {
    setSelectedRestaurantId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!selectedRestaurantId) {
      setError("Please select a restaurant.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", dish.name);
    formData.append("description", dish.description);
    formData.append("price", dish.price);
    formData.append("category", dish.category);
    formData.append("availability", dish.availability.toString());
    formData.append("ingredients", dish.ingredients);
    formData.append("restaurantId", selectedRestaurantId);

    if (imageFile) {
      formData.append("imageUrl", imageFile);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${backendurl}/api/dish/adddish`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Dish added successfully:", response.data);
      setSuccess("Dish added successfully!");
      navigate("/owner/ownerdashboard");
      
      // Reset form
      setDish({
        name: "",
        description: "",
        price: "",
        category: "",
        availability: true,
        ingredients: "",
      });
      setImageFile(null);
      setPreviewImage("");
     
    } catch (error) {
      console.error("Error adding dish:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error adding dish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <Container className="dish-container">
        <h2 className="text-center">ADD NEW DISH</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        {restaurants.length === 0 && !error ? (
          <div className="alert alert-warning">
            No restaurants found. 
            <Button 
              variant="link" 
              onClick={() => navigate("/owner/addrestaurant")}
              className="p-0 m-0 ml-2"
            >
              Add a restaurant first
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit} className="dish-form">
            {/* Restaurant Selection Dropdown */}
            <Form.Group controlId="restaurantSelect" className="mb-3">
              <Form.Label>Select Restaurant</Form.Label>
              <Form.Select
                name="restaurantId"
                value={selectedRestaurantId}
                onChange={handleRestaurantChange}
                required
              >
                <option value="">Select Restaurant</option>
                {restaurants.map(restaurant => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group controlId="dishName">
                  <Form.Label>Dish Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={dish.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter dish name"
                  />
                </Form.Group>

                <Form.Group controlId="dishDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={dish.description}
                    onChange={handleChange}
                    placeholder="Enter dish description"
                  />
                </Form.Group>

                <Form.Group controlId="dishPrice">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={dish.price}
                    onChange={handleChange}
                    required
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="dishCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    name="category" 
                    value={dish.category} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="meat">Meat</option>
                    <option value="fish">Fish</option>
                    <option value="Veg">Veg</option>
                    <option value="Rice">Rice</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Non-veg">Non-Veg</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="dishIngredients">
                  <Form.Label>Ingredients (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="ingredients"
                    value={dish.ingredients}
                    onChange={handleChange}
                    placeholder="e.g., Chicken, Spices, Oil"
                  />
                </Form.Group>

                <Form.Group controlId="dishImage">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>

                {previewImage && (
                  <div className="image-preview mt-3">
                    <img 
                      src={previewImage} 
                      alt="Dish Preview" 
                      className="preview-img img-thumbnail" 
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}

                <Form.Group controlId="dishAvailability" className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Available"
                    name="availability"
                    checked={dish.availability}
                    onChange={(e) => setDish({ ...dish, availability: e.target.checked })}
                  />
                </Form.Group>

                <Button 
                  variant="warning" 
                  type="submit" 
                  className="submit-btn mt-3" 
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Dish"}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Container>
    </div>
  );
}

export default CreateDish;


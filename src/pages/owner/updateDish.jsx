import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import './css/updatedish.css';
const backendurl=import.meta.env.VITE_BACKEND_URL





const UpdateDish = () => {
    const { id } = useParams(); // Get dishId from URL
    const navigate = useNavigate();
 
    console.log("Dish ID from useParams:", id);
    // State to store dish details
    const [dish, setDish] = useState({ name: "", description: "", price: "", category: "", imageUrl: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null); // New state for file
    const [imagePreview, setImagePreview] = useState(""); // For image preview

    // 🟢 Fetch dish details from backend when component mounts
    useEffect(() => {
        const fetchDish = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(`${backendurl}/api/dish/getdish/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setDish(response.data.dish);
                // If there's an existing image, set it as preview
                if (response.data.dish.imageUrl) {
                    setImagePreview(response.data.dish.imageUrl);
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to load dish details.");
                setLoading(false);
            }
        };
        
        if (id) {
            fetchDish();
        }
    }, [id]);

    // 🟢 Handle Input Changes for text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDish((prevDish) => ({
            ...prevDish,
            [name]: value,
        }));
    };

    // 🟢 Handle file input separately
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            setImageFile(file);
            
            // Create a preview URL for the selected image
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
        }
    };

    // 🟢 Handle Form Submission (Update Dish)
    // In your UpdateDish.jsx component, modify the handleSubmit function:
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!id) {
          setError("Dish ID is missing.");
          return;
        }
      
        try {
          const token = localStorage.getItem("token");
          
          // Create FormData for file upload
          const formData = new FormData();
          formData.append('name', dish.name);
          formData.append('description', dish.description);
          formData.append('price', dish.price);
          formData.append('category', dish.category);
          
          console.log("Sending form data:", {
            name: dish.name,
            description: dish.description,
            price: dish.price,
            category: dish.category
          });
          
          // Only append file if it exists
          if (imageFile) {
            formData.append('imageUrl', imageFile);
            console.log("Adding image to form data");
          }
          
          // Add timeout and increase it
          const response = await axios.put(
            `${backendurl}/api/dish/updatedish/${id}`,
            formData,
            { 
              headers: { 
                "Authorization": `Bearer ${token}`
              },
              withCredentials: true,
              timeout: 30000 // 30 seconds timeout
            }
          );
      
          setMessage("Dish updated successfully!");
          setError("");
      
          setTimeout(() => {
            navigate("/owner/ownerdashboard");
          }, 2000);
        } catch (error) {
          console.error("Error updating dish:", error);
          // More detailed error message
          if (error.response) {
            setError(`Error (${error.response.status}): ${error.response.data.message || "Unknown error"}`);
          } else if (error.request) {
            setError("No response from server. Check your network connection.");
          } else {
            setError(`Error: ${error.message}`);
          }
          setMessage("");
        }
      };






    useEffect(() => {
        console.log("Current token:", localStorage.getItem("token"));
      }, []);
    return (
        <Container className="update-dish-container mt-4">
            <h2 className="text-center">Update Dish</h2>

            {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto my-3" />}
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={dish.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" value={dish.description} onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="number" name="price" value={dish.price} onChange={handleChange} required />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Control as="select" name="category" value={dish.category} onChange={handleChange}>
                        <option value="Rice">Rice</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-veg">Non-veg</option>
                        <option value="Drinks">Drinks</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" name="imageUrl" onChange={handleFileChange} accept="image/*" />
                </Form.Group>
                
                {/* Image Preview */}
                {imagePreview && (
                    <div className="mt-3 text-center">
                        <img 
                            src={imagePreview} 
                            alt="Dish preview" 
                            style={{ maxWidth: '100%', maxHeight: '200px' }} 
                            className="img-thumbnail"
                        />
                    </div>
                )}

                <Button variant="primary" type="submit" className="mt-3 w-100">Update Dish</Button>
            </Form>
        </Container>
    );
};

export default UpdateDish;



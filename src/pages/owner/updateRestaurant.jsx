import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/updaterestaurant.css";
import { useParams, useNavigate } from "react-router-dom";

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobile: "",
    imageUrl: "",
    location: "",
    openingHours: "",
    description: "",
  });
  const [imageKey, setImageKey] = useState(Date.now());
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  // Check authentication first
  // In your React component, add this debugging console log
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    // Decode the token to see what owner ID it contains
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      console.log("Token payload:", JSON.parse(jsonPayload));
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }
}, []);
useEffect(() => {
  console.log("Current restaurant ID from URL:", id);
  // You could also check localStorage to see if there's a list of the owner's restaurants
  // that you could compare against
}, [id]);

  // Get the image URL (with improved error handling)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    try {
      // Check if it's a Cloudinary URL
      if (imagePath.includes('cloudinary.com')) {
        return `${imagePath}?t=${imageKey}`;
      }
      
      // Check if it's a full URL
      if (imagePath.startsWith('http')) {
        return `${imagePath}?t=${imageKey}`;
      }
      
      // If it's a relative path
      return `http://localhost:3001/uploads/${imagePath}?t=${imageKey}`;
    } catch (error) {
      console.error("Error processing image URL:", error);
      return null;
    }
  };


useEffect(() => {
  const fetchRestaurantDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log(`Fetching restaurant with ID: ${id}`);
      
      // Create controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // Use the new endpoint for single restaurant
      const response = await axios.get(
        `http://localhost:3001/api/restaurant/restaurantview/${id}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (response.data.success) {
        const restaurantData = response.data.data;
        console.log("Restaurant data found:", restaurantData);
        
        setFormData({
          name: restaurantData.name || "",
          address: restaurantData.address || "",
          mobile: restaurantData.mobile || "",
          imageUrl: restaurantData.imageUrl || "",
          location: restaurantData.location || "",
          openingHours: restaurantData.openingHours || "",
          description: restaurantData.description || "",
        });
        
        if (restaurantData.imageUrl) {
          setPreviewImage(getImageUrl(restaurantData.imageUrl));
        }
      } else {
        throw new Error("Restaurant not found");
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      
      if (error.name === 'AbortError') {
        setError("Request timed out. Server may be unavailable.");
      } else if (error.response && error.response.status === 404) {
        setError("Restaurant not found. Please check the ID.");
        setTimeout(() => navigate("/restaurantlist"), 2000);
      } else {
        setError(`Error: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (id) {
    fetchRestaurantDetails();
  } else {
    setError("No restaurant ID provided");
  }
}, [id, navigate, imageKey]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Update form data with the file
      setFormData(prev => ({ ...prev, imageUrl: file }));
      
      // Create and set preview URL
      try {
        const previewUrl = URL.createObjectURL(file);
        console.log("Created preview URL:", previewUrl);
        setPreviewImage(previewUrl);
      } catch (error) {
        console.error("Error creating preview URL:", error);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing");
      }
      
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("mobile", formData.mobile || "");
      formDataToSend.append("location", formData.location || "");
      formDataToSend.append("openingHours", formData.openingHours || "");
      formDataToSend.append("description", formData.description || "");
  
      // Handle image upload properly
      if (formData.imageUrl instanceof File) {
        console.log("Appending file to form data:", formData.imageUrl.name);
        formDataToSend.append("imageUrl", formData.imageUrl);
      } else if (typeof formData.imageUrl === 'string' && formData.imageUrl) {
        console.log("Using existing image URL:", formData.imageUrl);
        formDataToSend.append("existingImageUrl", formData.imageUrl);
      }
      
      // Log form data being sent (for debugging)
      console.log("Sending form data to API:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
      }
  
      // Add a timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await axios.put(
        `http://localhost:3001/api/restaurant/updaterestaurant/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
  
      console.log("Update response:", response.data);
      alert(response.data.message || "Restaurant updated successfully!");
      
      // Update image key to force re-render of image
      setImageKey(Date.now());
      
      // Navigate after a slight delay to ensure state updates are processed
      setTimeout(() => navigate("/owner/ownerdashboard"), 2000);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      
      if (error.name === 'AbortError') {
        setError("Update request timed out. Server may be unavailable.");
      } else {
        setError(`Failed to update: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container update-restaurant-container my-4">
      <h2 className="text-center mb-4">Update Restaurant</h2>
      
      {isLoading && (
        <div className="alert alert-info">
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span>Loading restaurant data...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="update-restaurant-form">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input 
            type="text" 
            className="form-control" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input 
            type="text" 
            className="form-control" 
            name="mobile" 
            value={formData.mobile} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input 
            type="text" 
            className="form-control" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Opening Hours</label>
          <input 
            type="text" 
            className="form-control" 
            name="openingHours" 
            value={formData.openingHours} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea 
            className="form-control" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="4"
            required 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Restaurant Image</label>
          
          {/* Show the current preview (either existing or newly selected image) */}
          {previewImage && (
            <div className="mb-3 preview-container">
              <img 
                src={previewImage} 
                alt="Restaurant" 
                className="img-thumbnail mb-2" 
                style={{ maxWidth: '200px', maxHeight: '150px' }} 
              />
              <p className="text-muted small">
                {formData.imageUrl instanceof File ? 'New image selected' : 'Current image'}
              </p>
            </div>
          )}
          
          {/* New image upload */}
          <input 
            type="file" 
            className="form-control" 
            name="imageFile" 
            onChange={handleFileChange} 
            accept="image/*"
          />
          <div className="form-text">
            Leave empty to keep current image
          </div>
        </div>
        
        <div className="d-grid gap-2">
          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : 'Update Restaurant'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate("/owner/ownerdashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRestaurant;


















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./css/updaterestaurant.css";
// import { useParams, useNavigate } from "react-router-dom";

// const UpdateRestaurant = () => {
//   const { id } = useParams(); // Get restaurant ID from URL
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     mobile: "",
//     imageUrl: "",
//     location: "",
//     openingHours: "",
//     description: "",
//   });
//   const [imageKey, setImageKey] = useState(Date.now()); // For cache busting
//   const [previewImage, setPreviewImage] = useState(null);

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         setIsLoading(true);
//         console.log(`Fetching restaurant with ID: ${id}`);
//         const response = await axios.get(`http://localhost:3001/api/restaurant/restaurants/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
        
//         if (response.data && response.data.restaurant) {
//           const restaurant = response.data.restaurant;
//           console.log("Restaurant data from API:", restaurant);
          
//           setFormData({
//             name: restaurant.name || "",
//             address: restaurant.address || "",
//             mobile: restaurant.mobile || "",
//             imageUrl: restaurant.imageUrl || "",
//             location: restaurant.location || "",
//             openingHours: restaurant.openingHours || "",
//             description: restaurant.description || "",
//           });
          
//           // If there's an existing image, set it as the preview
//           if (restaurant.imageUrl) {
//             setPreviewImage(getImageUrl(restaurant.imageUrl));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching restaurant details:", error);
//         // Check specifically for 404 errors
//         if (error.response && error.response.status === 404) {
//           alert("Restaurant not found. Please check the ID.");
//           navigate("/restaurantlist");
//         } else {
//           alert(`Error fetching restaurant: ${error.response?.data?.message || error.message}`);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (id) {
//       fetchRestaurantDetails();
//     } else {
//       console.error("No restaurant ID provided");
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("You are not authenticated. Please log in again.");
//     navigate("/login");
//     return null; // Return null to prevent rendering
//   }
  
//   // Improved image URL handling with better cache busting
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return "";
    
//     // Check if it's a Cloudinary URL
//     if (imagePath.includes('cloudinary.com')) {
//       return `${imagePath}?t=${imageKey}`;
//     }
    
//     // Check if it's a full URL
//     if (imagePath.startsWith('http')) {
//       return `${imagePath}?t=${imageKey}`;
//     }
    
//     // If it's a relative path
//     return `http://localhost:3001/uploads/${imagePath}?t=${imageKey}`;
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setFormData({ ...formData, imageUrl: file });
      
//       // Create a preview URL for immediate display
//       const previewUrl = URL.createObjectURL(file);
//       setPreviewImage(previewUrl);
//       console.log("Created preview URL:", previewUrl);
//     }
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("name", formData.name || "");
//       formDataToSend.append("address", formData.address || "");
//       formDataToSend.append("mobile", formData.mobile || "");
//       formDataToSend.append("location", formData.location || "");
//       formDataToSend.append("openingHours", formData.openingHours || "");
//       formDataToSend.append("description", formData.description || "");
  
//       // Handle image upload properly
//       if (formData.imageUrl instanceof File) {
//         console.log("Appending file to form data");
//         formDataToSend.append("imageUrl", formData.imageUrl);
//       } else if (typeof formData.imageUrl === 'string' && formData.imageUrl) {
//         console.log("Using existing image URL:", formData.imageUrl);
//         formDataToSend.append("existingImageUrl", formData.imageUrl);
//       }
      
//       // Log form data being sent (for debugging)
//       for (let pair of formDataToSend.entries()) {
//         console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
//       }
  
//       const response = await axios.put(
//         `http://localhost:3001/api/restaurant/updaterestaurant/${id}`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
  
//       console.log("Update response:", response.data);
//       alert(response.data.message || "Restaurant updated successfully!");
      
//       // Update image key to force re-render of image
//       setImageKey(Date.now());
      
//       // Update form data with the response data
//       if (response.data.updatedRestaurant) {
//         const updated = response.data.updatedRestaurant;
//         setFormData({
//           name: updated.name || "",
//           address: updated.address || "",
//           mobile: updated.mobile || "",
//           imageUrl: updated.imageUrl || "",
//           location: updated.location || "",
//           openingHours: updated.openingHours || "",
//           description: updated.description || "",
//         });
        
//         // Update preview image
//         if (updated.imageUrl) {
//           setPreviewImage(getImageUrl(updated.imageUrl));
//         }
//       }
  
//       // Navigate after a slight delay to ensure state updates are processed
//       setTimeout(() => navigate("/owner/ownerdashboard"), 500);
//     } catch (error) {
//       console.error("Error updating restaurant:", error);
//       alert(`Failed to update restaurant: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   console.log("FormData State:", formData);
//   console.log("Current preview image:", previewImage);

//   return (
//     <div className="container update-restaurant-container my-4">
//       <h2 className="text-center mb-4">Update Restaurant</h2>
      
//       {isLoading && <div className="alert alert-info">Loading restaurant data...</div>}
      
//       <form onSubmit={handleSubmit} className="update-restaurant-form">
//         <div className="mb-3">
//           <label className="form-label">Name</label>
//           <input 
//             type="text" 
//             className="form-control" 
//             name="name" 
//             value={formData.name} 
//             onChange={handleChange} 
//             required 
//           />
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label">Address</label>
//           <input 
//             type="text" 
//             className="form-control" 
//             name="address" 
//             value={formData.address} 
//             onChange={handleChange} 
//             required 
//           />
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label">Phone Number</label>
//           <input 
//             type="text" 
//             className="form-control" 
//             name="mobile" 
//             value={formData.mobile} 
//             onChange={handleChange} 
//             required 
//           />
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label">Location</label>
//           <input 
//             type="text" 
//             className="form-control" 
//             name="location" 
//             value={formData.location} 
//             onChange={handleChange} 
//             required 
//           />
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label">Opening Hours</label>
//           <input 
//             type="text" 
//             className="form-control" 
//             name="openingHours" 
//             value={formData.openingHours} 
//             onChange={handleChange} 
//             required 
//           />
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label">Description</label>
//           <textarea 
//             className="form-control" 
//             name="description" 
//             value={formData.description} 
//             onChange={handleChange} 
//             rows="4"
//             required 
//           />
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label">Image</label>
          
//           {/* Show the current preview (either existing or newly selected image) */}
//           {previewImage && (
//             <div className="mb-3">
//               <img 
//                 src={previewImage} 
//                 alt="Restaurant" 
//                 className="img-thumbnail mb-2" 
//                 style={{ maxWidth: '200px', maxHeight: '150px' }} 
//               />
//               <p className="text-muted small">
//                 {formData.imageUrl instanceof File ? 'New image preview' : 'Current image'}
//               </p>
//             </div>
//           )}
          
//           {/* New image upload */}
//           <input 
//             type="file" 
//             className="form-control" 
//             name="imageUrl" 
//             onChange={handleFileChange} 
//             accept="image/*"
//           />
//           <div className="form-text">
//             Leave empty to keep current image
//           </div>
//         </div>
        
//         <button 
//           type="submit" 
//           className="btn btn-primary w-100" 
//           disabled={isLoading}
//         >
//           {isLoading ? 'Updating...' : 'Update Restaurant'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateRestaurant;
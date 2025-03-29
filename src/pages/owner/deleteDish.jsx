import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Deletedish.css";

const DeleteDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3001/api/dish/viewdish/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDish(response.data.dish);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dish details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDish();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Updated URL to match your backend route
      await axios.delete(`http://localhost:3001/api/dish/deletedish/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      setMessage("Dish deleted successfully");
      setTimeout(() => navigate("/owner/ownerdashboard"), 2000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Error deleting dish");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="delete-dish-container container">
      <h2 className="text-center">Delete Dish</h2>
      {dish && (
        <div className="dish-details">
          <img 
            src={dish.imageUrl || "/images/placeholder.png"} 
            alt={dish.name} 
            className="dish-image" 
          />
          <h3>{dish.name}</h3>
          <p><strong>Category:</strong> {dish.category}</p>
          <p><strong>Price:</strong> ${dish.price}</p>
          <p><strong>Description:</strong> {dish.description}</p>
          <div className="confirmation-section mt-4">
            <div className="alert alert-warning">
              Are you sure you want to delete this dish? This action cannot be undone.
            </div>
            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {message && <div className="alert alert-success mt-3">{message}</div>}
    </div>
  );
};

export default DeleteDish;

































// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Deletedish.css";

// const DeleteDish = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [dish, setDish] = useState(null);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDish = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Authentication required");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(`http://localhost:3001/api/dish/getdish/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDish(response.data.dish);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch dish details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchDish();
//     }
//   }, [id]);

//   const handleDelete = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Authentication required");
//         return;
//       }

//       await axios.delete(`http://localhost:3001/api/dish/deletedish/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage("Dish deleted successfully");
//       setTimeout(() => navigate("/alldishes"), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Error deleting dish");
//     }
//   };

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   return (
//     <div className="delete-dish-container container">
//       <h2 className="text-center">Delete Dish</h2>
//       {dish && (
//         <div className="dish-details">
//           <img src={dish.dishPic || "/images/placeholder.png"} alt={dish.name} className="dish-image" />
//           <h3>{dish.name}</h3>
//           <p><strong>Category:</strong> {dish.category}</p>
//           <p><strong>Price:</strong> ${dish.price}</p>
//           <p><strong>Description:</strong> {dish.description}</p>
//           <p><strong>Ingredients:</strong> {dish.ingredients?.join(", ") || "Not specified"}</p>
//           <p><strong>Availability:</strong> {dish.availability ? "✅ Available" : "❌ Not Available"}</p>
//         </div>
//       )}
//       <button className="btn btn-danger" onClick={handleDelete}>
//         Delete Dish
//       </button>
//       {message && <p className="text-success mt-2">{message}</p>}
//       {error && <p className="text-danger mt-2">{error}</p>}
//     </div>
//   );
// };

// export default DeleteDish;

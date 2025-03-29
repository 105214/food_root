// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Card, Button, Spinner, Alert } from "react-bootstrap";
// import "./Dishdetails.css"; // Custom styles

// const DishDetails = () => {
//     const { id } = useParams(); // Get dishId from URL
//     const navigate = useNavigate();
//     const [dish, setDish] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");



//     useEffect(() => {
//         const fetchDish = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     setError("Authentication required");
//                     setLoading(false);
//                     return;
//                 }
    
//                 console.log('Fetching dish with ID:', id); // Debug log
//                 const response = await axios.get(`http://localhost:3001/api/user/dishprofile/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
                
//                 setDish(response.data.dish);
//             } catch (err) {
//                 console.error('Error fetching dish:', err); // Debug log
//                 setError(err.response?.data?.message || "Failed to fetch dish details.");
//             } finally {
//                 setLoading(false);
//             }
//         };
    
//         if (id) {  // Only fetch if we have an ID
//             fetchDish();
//         }
//     }, [id]);
    

//     if (loading) return <Spinner animation="border" className="loading-spinner" />;
//     if (error) return <Alert variant="danger">{error}</Alert>;

//     return (
//         <div className="container dish-details-container">
//             <Card className="shadow dish-card">
//             <Card.Img 
//   variant="top" 
//   src={dish.dishPic || "/images/placeholder.png"} 
//   alt={dish.name} 
// />
//                 {/* <Card.Img variant="top" src={dish.dishPic || "https://via.placeholder.com/400"} alt={dish.name} /> */}
//                 <Card.Body>
//                     <Card.Title>{dish.name}</Card.Title>
//                     <Card.Text>
//                         <strong>Category:</strong> {dish.category} <br />
//                         <strong>Price:</strong> ${dish.price} <br />
//                         <strong>Description:</strong> {dish.description} <br />
//                         <strong>Ingredients:</strong> {dish.ingredients?.join(", ") || "Not specified"} <br />
//                         <strong>Availability:</strong> {dish.availability ? "✅ Available" : "❌ Not Available"} <br />
//                         <strong>Ratings:</strong> {dish.ratings?.length > 0 ? dish.ratings.join(", ") : "No ratings yet"}
//                     </Card.Text>
//                     <div className="d-flex gap-2">
//                         <Button 
//                             variant="primary" 
//                             onClick={() => navigate(`/updatedish/${dish._id}`)}
//                         >
//                             Edit Dish
//                         </Button>
//                         <Button 
//                             variant="danger"
//                             onClick={() => navigate(`/deletedish/${dish._id}`) }
//                         >
//                             Delete Dish
//                         </Button>
//                     </div>
//                     {/* <Button variant="primary" onClick={() => navigate("/dishes")}>
//                         Back to Dishes
//                     </Button> */}
//                 </Card.Body>
//             </Card>
//         </div>
//     );
// };

// export default DishDetails;







// // useEffect(() => {
//     //     const fetchDish = async () => {
//     //         try {
//     //             const token = localStorage.getItem("token"); // Get auth token
//     //             const response = await axios.get(`http://localhost:3001/api/dish/getdish/${id}`, {
//     //                 headers: { Authorization: `Bearer ${token}` },
//     //             });
//     //             setDish(response.data.dish);
//     //         } catch (err) {
//     //             setError("Failed to fetch dish details.");
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };

//     //     fetchDish();
//     // }, [id]);
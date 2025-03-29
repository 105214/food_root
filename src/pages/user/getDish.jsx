import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner, Alert, ListGroup, Modal, Form } from "react-bootstrap";
import "./getdish.css";

const GetDish = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dish, setDish] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // State for edit review modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");

    useEffect(() => {
        const fetchDishAndReviews = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authentication required");
                    setLoading(false);
                    return;
                }
                
                // Fetch Dish Details
                const dishResponse = await axios.get(`http://localhost:3001/api/dish/getdish/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDish(dishResponse.data.dish);

                // Fetch Reviews for this Dish
                const reviewsResponse = await axios.get(`http://localhost:3001/api/review/reviews/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(reviewsResponse.data);

            } catch (err) {
                console.error('Error fetching dish or reviews:', err);
                setError(err.response?.data?.message || "Failed to fetch details.");
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchDishAndReviews();
        }
    }, [id]);
    const handleUpdateReview = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:3001/api/review/updatereview/${currentReview._id}`, 
                {
                    reviewId: currentReview._id,
                    dishId: id,
                    rating: editRating,
                    comment: editComment
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
    
            // Update the reviews list
            const updatedReviews = reviews.map(review => 
                review._id === currentReview._id 
                    ? { ...review, rating: editRating, comment: editComment } 
                    : review
            );
            setReviews(updatedReviews);
    
            // Close modal
            setShowEditModal(false);
            setCurrentReview(null);
          
        } catch (error) {
            console.error("Error updating review:", error);
            alert(error.response?.data?.message || "Failed to update review");
        }
    };
    // const handleUpdateReview = async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const response = await axios.put(
    //             `http://localhost:3001/api/review/updatereview/${currentReview._id}`, 
    //             {
    //                 dishId: id,
    //                 rating: editRating,
    //                 comment: editComment,
    //                 restaurantId: dish.restaurantId // Assuming this is available
    //             },
    //             {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             }
    //         );

    //         // Update the reviews list
    //         const updatedReviews = reviews.map(review => 
    //             review._id === currentReview._id 
    //                 ? { ...review, rating: editRating, comment: editComment } 
    //                 : review
    //         );
    //         setReviews(updatedReviews);

    //         // Close modal
    //         setShowEditModal(false);
    //         setCurrentReview(null);
    //     } catch (error) {
    //         console.error("Error updating review:", error);
    //         alert(error.response?.data?.message || "Failed to update review");
    //     }
    // };


    const handleDeleteReview = async (reviewId) => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:3001/api/review/deletereview/${reviewId}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { 
              dishId: id,  // Pass the dish ID 
              reviewId: reviewId 
            }
          });
      
          // Remove the deleted review from the list
          const updatedReviews = reviews.filter(review => review._id !== reviewId);
          setReviews(updatedReviews);
        } catch (error) {
          console.error("Error deleting review:", error);
          alert(error.response?.data?.message || "Failed to delete review");
        }
      };

    // const handleDeleteReview = async (reviewId) => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         await axios.delete(`http://localhost:3001/api/review/deletereview/${reviewId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //             data: { 
    //                 dishId: id, 
    //                 reviewId: reviewId 
    //             }
    //         });

    //         // Remove the deleted review from the list
    //         const updatedReviews = reviews.filter(review => review._id !== reviewId);
    //         setReviews(updatedReviews);
    //     } catch (error) {
    //         console.error("Error deleting review:", error);
    //         alert(error.response?.data?.message || "Failed to delete review");
    //     }
    // };

    const openEditModal = (review) => {
        setCurrentReview(review);
        setEditRating(review.rating);
        setEditComment(review.comment);
        setShowEditModal(true);
    };

    if (loading) return <Spinner animation="border" className="loading-spinner" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!dish) return <Alert variant="warning">No dish found</Alert>;

    const handleBuy = () => {
        alert(`Buying ${dish.name} for $${dish.price}`);
    };

    return (
        <div className="container dish-details-container">
            <Card className="shadow dish-card">
                {/* Dish Image */}
                {dish.imageUrl && (
                    <Card.Img 
                        variant="top"
                        src={dish.imageUrl.startsWith('http') 
                            ? dish.imageUrl 
                            : `http://localhost:3001/${dish.imageUrl}`}
                        alt={dish.name}
                        className="dish-image"
                        onError={(e) => {
                            console.error("image failed to load", dish.imageUrl)
                            e.target.onerror = null; 
                            e.target.src = "/images/placeholder.png";
                        }}
                    />
                )}
                <Card.Body>
                    <Card.Title>{dish.name}</Card.Title>
                    <Card.Text>
                        <strong>Category:</strong> {dish.category?.name || "Uncategorized"} <br />
                        <strong>Price:</strong> ${dish.price} <br />
                        <strong>Description:</strong> {dish.description} <br />
                        <strong>Ingredients:</strong> {dish.ingredients?.join(", ") || "Not specified"} <br />
                        <strong>Availability:</strong> {dish.availability ? "✅ Available" : "❌ Not Available"} <br />
                        <strong>Average Rating:</strong> {dish.averageRating ? `${dish.averageRating}/5` : "No ratings yet"}
                    </Card.Text>
                    <div className="d-flex gap-2">
                        <Button
                            variant="success"
                            onClick={handleBuy}
                            disabled={!dish.availability}
                        >
                            Buy Now
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/addreview/${dish._id}`)}
                        >
                            Add Review
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Reviews Section */}
            {reviews.length === 0 ? (
                <Card className="mt-4 shadow">
                    <Card.Body>
                        <p>No reviews yet for this dish.</p>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="mt-4 shadow">
                    <Card.Header>
                        <h5>Customer Reviews</h5>
                    </Card.Header>
                    <ListGroup variant="flush">
                        {reviews.map((review) => (
                            <ListGroup.Item key={review._id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="d-flex justify-content-between">
                                        <strong>{review.userId?.name || 'Anonymous'}</strong>
                                        <span>Rating: {review.rating}/5</span>
                                    </div>
                                    <p className="mb-1">{review.comment}</p>
                                    <small className="text-muted">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                                <div>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => openEditModal(review)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDeleteReview(review._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}

            {/* Edit Review Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="reviewRating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control 
                                type="number" 
                                min="1" 
                                max="5" 
                                value={editRating}
                                onChange={(e) => setEditRating(Number(e.target.value))}
                            />
                        </Form.Group>
                        <Form.Group controlId="reviewComment" className="mt-2">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateReview}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GetDish;






























// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Card, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
// import "./getdish.css"; // Custom styles

// const GetDish = () => {
//     const { id } = useParams(); // Get dishId from URL
//     const navigate = useNavigate();
//     const [dish, setDish] = useState(null);
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
    
//     useEffect(() => {
//         const fetchDishAndReviews = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     setError("Authentication required");
//                     setLoading(false);
//                     return;
//                 }
                
//                 // Fetch Dish Details
//                 const dishResponse = await axios.get(`http://localhost:3001/api/dish/getdish/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setDish(dishResponse.data.dish);

//                 // Fetch Reviews for this Dish
//                 const reviewsResponse = await axios.get(`http://localhost:3001/api/review/reviews/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setReviews(reviewsResponse.data);

//             } catch (err) {
//                 console.error('Error fetching dish or reviews:', err);
//                 setError(err.response?.data?.message || "Failed to fetch details.");
//             } finally {
//                 setLoading(false);
//             }
//         };
        
//         if (id) {  // Only fetch if we have an ID
//             fetchDishAndReviews();
//         }
//     }, [id]);
    
//     if (loading) return <Spinner animation="border" className="loading-spinner" />;
//     if (error) return <Alert variant="danger">{error}</Alert>;
//     if (!dish) return <Alert variant="warning">No dish found</Alert>;

//     const handleBuy = () => {
//         alert(`Buying ${dish.name} for $${dish.price}`);
//     };

//     const renderReviews = () => {
//         if (!reviews || reviews.length === 0) {
//             return (
//                 <Card className="mt-4 shadow">
//                     <Card.Body>
//                         <p>No reviews yet for this dish.</p>
//                     </Card.Body>
//                 </Card>
//             );
//         }

//         return (
//             <Card className="mt-4 shadow">
//                 <Card.Header>
//                     <h5>Customer Reviews</h5>
//                 </Card.Header>
//                 <ListGroup variant="flush">
//                     {reviews.map((review, index) => (
//                         <ListGroup.Item key={index}>
//                             <div className="d-flex justify-content-between">
//                                 <strong>{review.userId?.name || 'Anonymous'}</strong>
//                                 <span>Rating: {review.rating}/5</span>
//                             </div>
//                             <p className="mb-1">{review.comment}</p>
//                             <small className="text-muted">
//                                 {new Date(review.createdAt).toLocaleDateString()}
//                             </small>
//                         </ListGroup.Item>
//                     ))}
//                 </ListGroup>
//             </Card>
//         );
//     };

//     return (
//         <div className="container dish-details-container">
//             <Card className="shadow dish-card">
//                 {dish.imageUrl && (
//                     <Card.Img 
//                         variant="top"
//                         src={dish.imageUrl.startsWith('http') 
//                             ? dish.imageUrl 
//                             : `http://localhost:3001/${dish.imageUrl}`}
//                         alt={dish.name}
//                         className="dish-image"
//                         onError={(e) => {
//                             console.error("image failed to load", dish.imageUrl)
//                             e.target.onerror = null; 
//                             e.target.src = "/images/placeholder.png";
//                         }}
//                     />
//                 )}
//                 <Card.Body>
//                     <Card.Title>{dish.name}</Card.Title>
//                     <Card.Text>
//                         <strong>Category:</strong> {dish.category?.name || "Uncategorized"} <br />
//                         <strong>Price:</strong> ${dish.price} <br />
//                         <strong>Description:</strong> {dish.description} <br />
//                         <strong>Ingredients:</strong> {dish.ingredients?.join(", ") || "Not specified"} <br />
//                         <strong>Availability:</strong> {dish.availability ? "✅ Available" : "❌ Not Available"} <br />
//                         <strong>Ratings:</strong> {dish.ratings?.length > 0 ? dish.ratings.join(", ") : "No ratings yet"}
//                     </Card.Text>
//                     <div className="d-flex gap-2 mb-3">
//                         <Button
//                             variant="success"
//                             onClick={handleBuy}
//                             disabled={!dish.availability}
//                         >
//                             Buy Now
//                         </Button>
//                         <Button
//                             variant="primary"
//                             onClick={() => navigate(`/addreview/${dish._id}`)}
//                         >
//                             Add Review
//                         </Button>
//                     </div>
//                 </Card.Body>
//             </Card>

//             {renderReviews()}
//         </div>
//     );
// };

// export default GetDish;

























// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Card, Button, Spinner, Alert } from "react-bootstrap";
// import "./getdish.css"; // Custom styles

// const GetDish = () => {
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
//                 const response = await axios.get(`http://localhost:3001/api/dish/getdish/${id}`, {
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
//                 <Card.Img 
//                     variant="top" 
//                     src={dish.dishPic || "/images/placeholder.png"} 
//                     alt={dish.name} 
//                 />
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
//                     <div className="d-flex gap-2 mb-3">
//                         <Button 
//                             variant="primary" 
//                             onClick={() => navigate(`/updatedish/${dish._id}`)}
//                         >
//                             Edit Dish
//                         </Button>
//                         <Button 
//                             variant="danger"
//                             onClick={() => navigate(`/deletedish/${dish._id}`)}
//                         >
//                             Delete Dish
//                         </Button>
//                         <Button 
//                             variant="success"
//                             onClick={() => navigate(`/addreview/${dish._id}`)}
//                         >
//                             Add Review
//                         </Button>
//                     </div>
//                 </Card.Body>
//             </Card>
//         </div>
//     );
// };

// export default GetDish;






















// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Card, Button, Spinner, Alert } from "react-bootstrap";
// import "./getdish.css"; // Custom styles

// const GetDish = () => {
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
//                 const response = await axios.get(`http://localhost:3001/api/dish/getdish/${id}`, {
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

// export default GetDish;
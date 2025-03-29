import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Spinner, Button, ListGroup, Alert } from 'react-bootstrap';
import { FaClock, FaMapMarkerAlt, FaPhone, FaStar, FaArrowLeft, FaUtensils } from 'react-icons/fa';
import './css/restaurantview.css';

const RestaurantUserView = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        // Get the token from localStorage
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          // Redirect to login if no token found
          setError('Please login to view restaurant details');
          return;
        }
        
        const response = await axios.get(`http://localhost:3001/api/restaurant/userrestaurant/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setRestaurant(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch restaurant');
        }
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        
        // Check if error is due to authentication
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Your session has expired. Please login again.');
          // Clear the invalid token
          localStorage.removeItem('userToken');
        } else {
          setError(err.message || 'An error occurred while fetching restaurant data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
        <p className="ms-3">Loading restaurant details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="error-container d-flex justify-content-center">
        <div className="text-center p-5">
          <Alert variant="danger">
            <h3>Error</h3>
            <p>{error}</p>
          </Alert>
          <div className="mt-3">
            <Link to="/login">
              <Button variant="primary" className="me-2">Login</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary">Go Back Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container className="not-found-container d-flex justify-content-center">
        <div className="text-center p-5">
          <h3>Restaurant Not Found</h3>
          <p>The restaurant you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button variant="primary">Browse Restaurants</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="restaurant-details-page">
      <Container className="restaurant-view-container py-4 d-flex justify-content-center">
        <div className="w-100">
          <div className="d-flex justify-content-center mb-4">
            <Button 
              variant="outline-secondary"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="me-2" /> Back to restaurants
            </Button>
          </div>
          
          <Card className="restaurant-card mx-auto">
            <div className="restaurant-image-wrapper">
              <img 
                src={restaurant.imageUrl || '/restaurant-placeholder.jpg'} 
                alt={restaurant.name} 
                className="restaurant-image"
              />
              {restaurant.rating && (
                <div className="rating-badge">
                  <FaStar className="star-icon" /> {restaurant.rating.toFixed(1)}
                </div>
              )}
            </div>
            
            <Card.Body>
              <div className="restaurant-header text-center">
                <h1 className="restaurant-name">{restaurant.name}</h1>
                {restaurant.location && (
                  <Badge bg="secondary" className="location-badge">{restaurant.location}</Badge>
                )}
              </div>
              
              <Row className="restaurant-info-row">
                <Col lg={8}>
                  <div className="restaurant-description">
                    <h3>About</h3>
                    <p>{restaurant.description}</p>
                  </div>
                  
                  <div className="contact-info">
                    <h3>Contact & Location</h3>
                    <ListGroup variant="flush" className="contact-list">
                      <ListGroup.Item>
                        <FaMapMarkerAlt className="info-icon" /> {restaurant.address || 'Address not available'}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaPhone className="info-icon" /> {restaurant.mobile || 'Phone number not available'}
                      </ListGroup.Item>
                      {restaurant.openingHours && (
                        <ListGroup.Item>
                          <FaClock className="info-icon" /> {restaurant.openingHours}
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </div>
                </Col>
        
                {/* <Col lg={4}>
                  <Card className="action-card">
                    <Card.Body>
                    
                    </Card.Body>
                  </Card>
                </Col> */}
              </Row>
              
              {restaurant.menu && restaurant.menu.length > 0 && (
                <div className="menu-preview">
                  <h3>Popular Menu Items</h3>
                  <Row>
                    {restaurant.menu.slice(0, 3).map((item, index) => (
                      <Col md={4} key={index}>
                        <Card className="menu-item-card">
                          {item.imageUrl && (
                            <Card.Img variant="top" src={item.imageUrl} alt={item.name} />
                          )}
                          <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text className="menu-item-price">${item.price}</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <div className="text-center mt-4">
                    <Link to={`/userrestaurant/${id}/menu`}>
                      <Button variant="outline-primary ">View Full Menu</Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {/* Added the View Menu button at the bottom of the page */}
          <div className="text-center mt-5 mb-4">
            <Link to={`/menu/${id}`} className='view-button'>
              <Button variant="primary" size="lg"  style={{ width: '250px' }}>
                <FaUtensils className="me-2  " /> View Menu
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RestaurantUserView;





























// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Row, Col, Card, Badge, Spinner, Button, ListGroup, Alert } from 'react-bootstrap';
// import { FaClock, FaMapMarkerAlt, FaPhone, FaStar } from 'react-icons/fa';
// import './css/restaurantview.css';

// const RestaurantUserView = () => {
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRestaurant = async () => {
//       try {
//         setLoading(true);
//         // Get the token from localStorage
//         const token = localStorage.getItem('userToken');
        
//         if (!token) {
//           // Redirect to login if no token found
//           setError('Please login to view restaurant details');
        
//           return;
//         }
        
//         const response = await axios.get(`http://localhost:3001/api/restaurant/userrestaurant/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
        
//         if (response.data.success) {
//           setRestaurant(response.data.data);
//         } else {
//           throw new Error(response.data.message || 'Failed to fetch restaurant');
//         }
//       } catch (err) {
//         console.error('Error fetching restaurant:', err);
        
//         // Check if error is due to authentication
//         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
//           setError('Your session has expired. Please login again.');
//           // Clear the invalid token
//           localStorage.removeItem('userToken');
          
//           // Redirect to login after a short delay
          
//         } else {
//           setError(err.message || 'An error occurred while fetching restaurant data');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurant();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Spinner animation="border" variant="primary" />
//         <p>Loading restaurant details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="error-container">
//         <div className="text-center p-5">
//           <Alert variant="danger">
//             <h3>Error</h3>
//             <p>{error}</p>
//           </Alert>
//           <div className="mt-3">
//             <Link to="/login">
//               <Button variant="primary" className="me-2">Login</Button>
//             </Link>
//             <Link to="/">
//               <Button variant="secondary">Go Back Home</Button>
//             </Link>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   if (!restaurant) {
//     return (
//       <Container className="not-found-container">
//         <div className="text-center p-5">
//           <h3>Restaurant Not Found</h3>
//           <p>The restaurant you're looking for doesn't exist or has been removed.</p>
//           <Link to="/">
//             <Button variant="primary">Browse Restaurants</Button>
//           </Link>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="restaurant-view-container py-4">
//       <Card className="restaurant-card">
//         <div className="restaurant-image-wrapper">
//           <img 
//             src={restaurant.imageUrl || '/restaurant-placeholder.jpg'} 
//             alt={restaurant.name} 
//             className="restaurant-image"
//           />
//           {restaurant.rating && (
//             <div className="rating-badge">
//               <FaStar className="star-icon" /> {restaurant.rating.toFixed(1)}
//             </div>
//           )}
//         </div>
        
//         <Card.Body>
//           <div className="restaurant-header">
//             <h1 className="restaurant-name">{restaurant.name}</h1>
//             {restaurant.location && (
//               <Badge bg="secondary" className="location-badge">{restaurant.location}</Badge>
//             )}
//           </div>
          
//           <Row className="restaurant-info-row mt-4">
//             <Col md={8}>
//               <div className="restaurant-description mb-4">
//                 <h3>About</h3>
//                 <p>{restaurant.description}</p>
//               </div>
              
//               <div className="contact-info">
//                 <h3>Contact & Location</h3>
//                 <ListGroup variant="flush" className="contact-list">
//                   <ListGroup.Item>
//                     <FaMapMarkerAlt className="info-icon" /> {restaurant.address}
//                   </ListGroup.Item>
//                   <ListGroup.Item>
//                     <FaPhone className="info-icon" /> {restaurant.mobile}
//                   </ListGroup.Item>
//                   {restaurant.openingHours && (
//                     <ListGroup.Item>
//                       <FaClock className="info-icon" /> {restaurant.openingHours}
//                     </ListGroup.Item>
//                   )}
//                 </ListGroup>
//               </div>
//             </Col>
            
//             <Col md={4}>
//               <Card className="action-card">
//                 <Card.Body>
//                   <h3>Ready to Order?</h3>
//                   <p>Explore our delicious menu and place your order now.</p>
//                   <Link to={`/restaurant/${id}/menu`}>
//                     <Button variant="primary" className="w-100 mb-2">
//                       View Menu
//                     </Button>
//                   </Link>
//                   <Link to={`/restaurant/${id}/book`}>
//                     <Button variant="outline-primary" className="w-100">
//                       Book a Table
//                     </Button>
//                   </Link>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
          
//           {restaurant.menu && restaurant.menu.length > 0 && (
//             <div className="menu-preview mt-4">
//               <h3>Popular Menu Items</h3>
//               <Row>
//                 {restaurant.menu.slice(0, 3).map((item, index) => (
//                   <Col md={4} key={index}>
//                     <Card className="menu-item-card">
//                       {item.imageUrl && (
//                         <Card.Img variant="top" src={item.imageUrl} alt={item.name} />
//                       )}
//                       <Card.Body>
//                         <Card.Title>{item.name}</Card.Title>
//                         <Card.Text className="menu-item-price">${item.price}</Card.Text>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//               <div className="text-center mt-3">
//                 <Link to={`/restaurant/${id}/menu`}>
//                   <Button variant="outline-primary">View Full Menu</Button>
//                 </Link>
//               </div>
//             </div>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default RestaurantUserView;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaClock, FaUtensils } from 'react-icons/fa';
import './css/allrestaurant.css';

const RestaurantListing = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      if (!token) {
       navigate('/');
       return;
      }
      
      const response = await axios.get(
        `http://localhost:3001/api/restaurant/allrestaurants`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setRestaurants(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch restaurants');
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(err.message || 'An error occurred while fetching restaurant data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && restaurants.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading restaurants...</p>
      </Container>
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <Container className="text-center py-5">
        <div className="error-container p-4 border rounded shadow-sm">
          <h3>Unable to Load Restaurants</h3>
          <p>{error}</p>
          {error.includes('Authentication') ? (
          <Button variant="primary" onClick={() => navigate('/')}>LOGIN</Button>
          ):( 
            <Button variant="primary" onClick={() => fetchRestaurants()}>Try Again</Button> 
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="restaurant-listing-container py-4">
      <div className="listing-header mb-4">
        <h1>Explore Restaurants</h1>
        <p>Discover the best dining experiences in your area</p>
      </div>
      
      {restaurants.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {restaurants.map((restaurant) => (
            <Col key={restaurant._id}>
              <Card className="restaurant-card h-100">
                <div className="restaurant-img-container">
                  <Card.Img 
                    variant="top" 
                    src={restaurant.imageUrl || '/restaurant-placeholder.jpg'} 
                    alt={restaurant.name}
                    className="restaurant-img" 
                  />
                </div>
                <Card.Body>
                  <Card.Title>{restaurant.name}</Card.Title>
                  {restaurant.location && (
                    <div className="restaurant-location mb-2">
                      <FaMapMarkerAlt className="me-1 text-secondary" /> {restaurant.location}
                    </div>
                  )}
                  <Card.Text className="restaurant-description">
                    {restaurant.description?.substring(0, 100)}
                    {restaurant.description?.length > 100 ? '...' : ''}
                  </Card.Text>
                  {restaurant.openingHours && (
                    <div className="restaurant-hours mt-2 mb-3">
                      <FaClock className="me-1 text-secondary" /> {restaurant.openingHours}
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button 
                    variant="outline-primary" 
                    className="w-100" 
                    onClick={() => navigate(`/userrestaurant/${restaurant._id}`)}
                  >
                    <FaUtensils className="me-2" /> View Restaurant
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="no-results text-center py-5">
          <div className="no-results-icon mb-3">
            <FaUtensils size={40} />
          </div>
          <h3>No Restaurants Found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </Container>
  );
};

export default RestaurantListing;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, Button, Spinner, Badge, Dropdown } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaStar, FaMapMarkerAlt, FaUtensils, FaFilter, FaClock } from 'react-icons/fa';
// import './css/allrestaurant.css';

// const RestaurantListing = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [location, setLocation] = useState('');
//   const [rating, setRating] = useState('');
//   const [locations, setLocations] = useState([]);
//   const [filteredCount, setFilteredCount] = useState(0);
//   const navigate = useNavigate();
  
//   // Fetch all restaurants when component mounts
//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   const fetchRestaurants = async (filters = {}) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       if (!token) {
//        navigate('/');
//        return;
//       }
      
//       // Build query string from filters
//       const queryParams = new URLSearchParams();
//       if (filters.location) queryParams.append('location', filters.location);
//       if (filters.rating) queryParams.append('rating', filters.rating);
      
//       const response = await axios.get(
//         `http://localhost:3001/api/restaurant/allrestaurants?${queryParams.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         setRestaurants(response.data.data);
//         setFilteredCount(response.data.count);
        
//         // Extract unique locations for filter dropdown
//         const uniqueLocations = [...new Set(response.data.data.map(r => r.location).filter(Boolean))];
//         setLocations(uniqueLocations);
//       } else {
//         throw new Error(response.data.message || 'Failed to fetch restaurants');
//       }
//     } catch (err) {
//       console.error('Error fetching restaurants:', err);
//       setError(err.message || 'An error occurred while fetching restaurant data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterType, value) => {
//     if (filterType === 'location') {
//       setLocation(value);
//     } else if (filterType === 'rating') {
//       setRating(value);
//     }
    
//     // Apply filters immediately
//     fetchRestaurants({ 
//       location: filterType === 'location' ? value : location, 
//       rating: filterType === 'rating' ? value : rating 
//     });
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setLocation('');
//     setRating('');
//     fetchRestaurants();
//   };

//   // Render loading spinner
//   if (loading && restaurants.length === 0) {
//     return (
//       <Container className="text-center py-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading restaurants...</p>
//       </Container>
//     );
//   }

//   // Render error message
//   if (error && restaurants.length === 0) {
//     return (
//       <Container className="text-center py-5">
//         <div className="error-container p-4 border rounded shadow-sm">
//           <h3>Unable to Load Restaurants</h3>
//           <p>{error}</p>
//           {error.includes('Authentication') ? (
//           <Button variant="primary" onClick={() => navigate('/')}>
//            LOGIN
//           </Button>
//           ):( 
//             <Button variant="primary" onClick={() => fetchRestaurants()}>
//             Try Again
//           </Button> 
//           )}
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="restaurant-listing-container py-4">
//       <div className="listing-header mb-4">
//         <h1>Explore Restaurants</h1>
//         <p>Discover the best dining experiences in your area</p>
//       </div>
      
//       {/* Filter Bar */}
//       <Card className="filter-card mb-4">
//         <Card.Body>
//           <Form>
//             <Row className="align-items-end">
//               <Col md={6} className="mb-3 mb-md-0">
//                 <Form.Group>
//                   <Form.Label>Filter by Location</Form.Label>
//                   <Dropdown className="w-100">
//                     <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
//                       <FaMapMarkerAlt className="me-2" />
//                       {location || 'All Locations'}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu className="w-100">
//                       <Dropdown.Item onClick={() => handleFilterChange('location', '')}>
//                         All Locations
//                       </Dropdown.Item>
//                       {locations.map((loc, index) => (
//                         <Dropdown.Item 
//                           key={index} 
//                           onClick={() => handleFilterChange('location', loc)}
//                           active={location === loc}
//                         >
//                           {loc}
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>
//               </Col>
              
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Filter by Rating</Form.Label>
//                   <Dropdown className="w-100">
//                     <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
//                       <FaStar className="me-2 text-warning" />
//                       {rating ? `${rating}+ Stars` : 'Any Rating'}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu className="w-100">
//                       <Dropdown.Item onClick={() => handleFilterChange('rating', '')}>
//                         Any Rating
//                       </Dropdown.Item>
//                       {[5, 4, 3, 2, 1].map((star) => (
//                         <Dropdown.Item 
//                           key={star} 
//                           onClick={() => handleFilterChange('rating', star)}
//                           active={parseInt(rating) === star}
//                         >
//                           {star}+ Stars
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>
//               </Col>
//             </Row>
            
//             {/* Active filters display */}
//             {(location || rating) && (
//               <div className="active-filters mt-3">
//                 <div className="d-flex align-items-center">
//                   <FaFilter className="me-2" />
//                   <span className="me-2">Active Filters:</span>
                  
//                   {location && (
//                     <Badge bg="info" className="filter-badge me-2">
//                       Location: {location}
//                     </Badge>
//                   )}
                  
//                   {rating && (
//                     <Badge bg="warning" className="filter-badge me-2">
//                       Rating: {rating}+ Stars
//                     </Badge>
//                   )}
                  
//                   <Button 
//                     variant="link" 
//                     size="sm" 
//                     className="text-danger p-0 ms-2" 
//                     onClick={clearFilters}
//                   >
//                     Clear All
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Form>
//         </Card.Body>
//       </Card>
      
//       {/* Results count */}
//       {/* <div className="results-count mb-3">
//         <p>
//           {filteredCount} {filteredCount === 1 ? 'restaurant' : 'restaurants'} found
//           {(location || rating) ? ' matching your filters' : ''}
//         </p>
//       </div> */}
      
//       {/* Restaurant cards */}
//       {restaurants.length > 0 ? (
//         <Row xs={1} md={2} lg={3} className="g-4">
//           {restaurants.map((restaurant) => (
//             <Col key={restaurant._id}>
//               <Card className="restaurant-card h-100">
//                 <div className="restaurant-img-container">
//                   <Card.Img 
//                     variant="top" 
//                     src={restaurant.imageUrl || '/restaurant-placeholder.jpg'} 
//                     alt={restaurant.name}
//                     className="restaurant-img" 
//                   />
                 
//                 </div>
                
//                 <Card.Body>
//                   <Card.Title>{restaurant.name}</Card.Title>
                  
//                   {restaurant.location && (
//                     <div className="restaurant-location mb-2">
//                       <FaMapMarkerAlt className="me-1 text-secondary" /> {restaurant.location}
//                     </div>
//                   )}
                  
//                   <Card.Text className="restaurant-description">
//                     {restaurant.description?.substring(0, 100)}
//                     {restaurant.description?.length > 100 ? '...' : ''}
//                   </Card.Text>
                  
//                   {restaurant.openingHours && (
//                     <div className="restaurant-hours mt-2 mb-3">
//                       <FaClock className="me-1 text-secondary" /> {restaurant.openingHours}
//                     </div>
//                   )}
//                 </Card.Body>
                
//                 <Card.Footer className="bg-white border-0">
//                   <Link to={`/restaurant/${restaurant._id}`} className="w-100">
//                     <Button variant="outline-primary" className="w-100">
//                       <FaUtensils className="me-2" /> View Restaurant
//                     </Button>
//                   </Link>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       ) : (
//         <div className="no-results text-center py-5">
//           <div className="no-results-icon mb-3">
//             <FaUtensils size={40} />
//           </div>
//           <h3>No Restaurants Found</h3>
//           <p>Try adjusting your filters or search criteria</p>
//           <Button variant="primary" onClick={clearFilters}>
//             Clear All Filters
//           </Button>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default RestaurantListing;































// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner, Badge, Dropdown } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaSearch, FaStar, FaMapMarkerAlt, FaUtensils, FaFilter, FaClock } from 'react-icons/fa';
// import './css/allrestaurant.css';

// const RestaurantListing = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState('');
//   const [location, setLocation] = useState('');
//   const [rating, setRating] = useState('');
//   const [locations, setLocations] = useState([]);
//   const [filteredCount, setFilteredCount] = useState(0);
//     const navigate=useNavigate()
//   // Fetch all restaurants when component mounts
//   useEffect(() => {
//     fetchRestaurants();
//   }, []);


//   const fetchRestaurants = async (filters = {}) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('userToken');
      
//       if (!token) {
//        navigate('/');
//        return
//       }
      
//       // Build query string from filters
//       const queryParams = new URLSearchParams();
//       if (filters.search) queryParams.append('search', filters.search);
//       if (filters.location) queryParams.append('location', filters.location);
//       if (filters.rating) queryParams.append('rating', filters.rating);
      
//       const response = await axios.get(
//         `http://localhost:3001/api/restaurant/allrestaurants?${queryParams.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         setRestaurants(response.data.data);
//         setFilteredCount(response.data.count);
        
//         // Extract unique locations for filter dropdown
//         const uniqueLocations = [...new Set(response.data.data.map(r => r.location).filter(Boolean))];
//         setLocations(uniqueLocations);
//       } else {
//         throw new Error(response.data.message || 'Failed to fetch restaurants');
//       }
//     } catch (err) {
//       console.error('Error fetching restaurants:', err);
//       setError(err.message || 'An error occurred while fetching restaurant data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search input changes
//   const handleSearchChange = (e) => {
//     setSearch(e.target.value);
//   };

//   // Handle search form submission
//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchRestaurants({ search, location, rating });
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterType, value) => {
//     if (filterType === 'location') {
//       setLocation(value);
//     } else if (filterType === 'rating') {
//       setRating(value);
//     }
    
//     // Apply filters immediately
//     fetchRestaurants({ 
//       search, 
//       location: filterType === 'location' ? value : location, 
//       rating: filterType === 'rating' ? value : rating 
//     });
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSearch('');
//     setLocation('');
//     setRating('');
//     fetchRestaurants();
//   };

//   // Render loading spinner
//   if (loading && restaurants.length === 0) {
//     return (
//       <Container className="text-center py-5">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">Loading restaurants...</p>
//       </Container>
//     );
//   }

//   // Render error message
//   if (error && restaurants.length === 0) {
//     return (
//       <Container className="text-center py-5">
//         <div className="error-container p-4 border rounded shadow-sm">
//           <h3>Unable to Load Restaurants</h3>
//           <p>{error}</p>
//           {error.includes('Authentication') ? (
//           <Button variant="primary" onClick={() => navigate('/')}>
//            LOGIN
//           </Button>
//           ):( 
//             <Button variant="primary" onClick={() => fetchRestaurants()}>
//             Try Again
//           </Button> 
//           )}
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="restaurant-listing-container py-4">
//       <div className="listing-header mb-4">
//         <h1>Explore Restaurants</h1>
//         <p>Discover the best dining experiences in your area</p>
//       </div>
      
//       {/* Search and Filter Bar */}
//       <Card className="filter-card mb-4">
//         <Card.Body>
//           <Form onSubmit={handleSearchSubmit}>
//             <Row className="align-items-end">
//               <Col md={6} className="mb-3 mb-md-0">
//                 <Form.Group>
//                   <Form.Label>Search Restaurants</Form.Label>
//                   <InputGroup>
//                     <Form.Control
//                       placeholder="Search by name or cuisine..."
//                       value={search}
//                       onChange={handleSearchChange}
//                     />
//                     <Button variant="primary" type="submit">
//                       <FaSearch /> Search
//                     </Button>
//                   </InputGroup>
//                 </Form.Group>
//               </Col>
              
//               <Col md={3} className="mb-3 mb-md-0">
//                 <Form.Group>
//                   <Form.Label>Filter by Location</Form.Label>
//                   <Dropdown className="w-100">
//                     <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
//                       <FaMapMarkerAlt className="me-2" />
//                       {location || 'All Locations'}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu className="w-100">
//                       <Dropdown.Item onClick={() => handleFilterChange('location', '')}>
//                         All Locations
//                       </Dropdown.Item>
//                       {locations.map((loc, index) => (
//                         <Dropdown.Item 
//                           key={index} 
//                           onClick={() => handleFilterChange('location', loc)}
//                           active={location === loc}
//                         >
//                           {loc}
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>
//               </Col>
              
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Filter by Rating</Form.Label>
//                   <Dropdown className="w-100">
//                     <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
//                       <FaStar className="me-2 text-warning" />
//                       {rating ? `${rating}+ Stars` : 'Any Rating'}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu className="w-100">
//                       <Dropdown.Item onClick={() => handleFilterChange('rating', '')}>
//                         Any Rating
//                       </Dropdown.Item>
//                       {[5, 4, 3, 2, 1].map((star) => (
//                         <Dropdown.Item 
//                           key={star} 
//                           onClick={() => handleFilterChange('rating', star)}
//                           active={parseInt(rating) === star}
//                         >
//                           {star}+ Stars
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>
//               </Col>
//             </Row>
            
//             {/* Active filters display */}
//             {(search || location || rating) && (
//               <div className="active-filters mt-3">
//                 <div className="d-flex align-items-center">
//                   <FaFilter className="me-2" />
//                   <span className="me-2">Active Filters:</span>
                  
//                   {search && (
//                     <Badge bg="primary" className="filter-badge me-2">
//                       Search: {search}
//                     </Badge>
//                   )}
                  
//                   {location && (
//                     <Badge bg="info" className="filter-badge me-2">
//                       Location: {location}
//                     </Badge>
//                   )}
                  
//                   {rating && (
//                     <Badge bg="warning" className="filter-badge me-2">
//                       Rating: {rating}+ Stars
//                     </Badge>
//                   )}
                  
//                   <Button 
//                     variant="link" 
//                     size="sm" 
//                     className="text-danger p-0 ms-2" 
//                     onClick={clearFilters}
//                   >
//                     Clear All
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Form>
//         </Card.Body>
//       </Card>
      
//       {/* Results count */}
//       <div className="results-count mb-3">
//         <p>
//           {filteredCount} {filteredCount === 1 ? 'restaurant' : 'restaurants'} found
//           {(search || location || rating) ? ' matching your filters' : ''}
//         </p>
//       </div>
      
//       {/* Restaurant cards */}
//       {restaurants.length > 0 ? (
//         <Row xs={1} md={2} lg={3} className="g-4">
//           {restaurants.map((restaurant) => (
//             <Col key={restaurant._id}>
//               <Card className="restaurant-card h-100">
//                 <div className="restaurant-img-container">
//                   <Card.Img 
//                     variant="top" 
//                     src={restaurant.imageUrl || '/restaurant-placeholder.jpg'} 
//                     alt={restaurant.name}
//                     className="restaurant-img" 
//                   />
//                   {restaurant.rating && (
//                     <div className="restaurant-rating">
//                       <FaStar className="star-icon" /> {restaurant.rating.toFixed(1)}
//                     </div>
//                   )}
//                 </div>
                
//                 <Card.Body>
//                   <Card.Title>{restaurant.name}</Card.Title>
                  
//                   {restaurant.location && (
//                     <div className="restaurant-location mb-2">
//                       <FaMapMarkerAlt className="me-1 text-secondary" /> {restaurant.location}
//                     </div>
//                   )}
                  
//                   <Card.Text className="restaurant-description">
//                     {restaurant.description?.substring(0, 100)}
//                     {restaurant.description?.length > 100 ? '...' : ''}
//                   </Card.Text>
                  
//                   {restaurant.openingHours && (
//                     <div className="restaurant-hours mt-2 mb-3">
//                       <FaClock className="me-1 text-secondary" /> {restaurant.openingHours}
//                     </div>
//                   )}
//                 </Card.Body>
                
//                 <Card.Footer className="bg-white border-0">
//                   <Link to={`/restaurant/${restaurant._id}`} className="w-100">
//                     <Button variant="outline-primary" className="w-100">
//                       <FaUtensils className="me-2" /> View Restaurant
//                     </Button>
//                   </Link>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       ) : (
//         <div className="no-results text-center py-5">
//           <div className="no-results-icon mb-3">
//             <FaUtensils size={40} />
//           </div>
//           <h3>No Restaurants Found</h3>
//           <p>Try adjusting your filters or search criteria</p>
//           <Button variant="primary" onClick={clearFilters}>
//             Clear All Filters
//           </Button>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default RestaurantListing;

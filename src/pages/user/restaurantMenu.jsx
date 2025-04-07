import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Spinner, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import { FaArrowLeft, FaSearch, FaUtensils, FaSortAmountDown, FaSortAmountUp, FaShoppingCart } from 'react-icons/fa';
import './css/restaurantmenu.css';
const backendurl=import.meta.env.VITE_BACKEND_URL



const RestaurantMenuView = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please login to view menu');
          return;
        }
        
        // Updated API endpoint for dishes that reference this restaurant
        const response = await axios.get(`${backendurl}/restaurant/menu/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          console.log('Menu data:', response.data.data);
          
          if (response.data.data.menu && response.data.data.menu.length > 0) {
            setMenuItems(response.data.data.menu);
            
            // Extract unique categories
            const uniqueCategories = ['all', ...new Set(response.data.data.menu
              .filter(item => item.category)
              .map(item => item.category))];
            setCategories(uniqueCategories);
          } else {
            console.log('No menu items found in response');
          }
          
          setRestaurantName(response.data.data.restaurantName);
        
        } else {
          throw new Error(response.data.message || 'Failed to fetch menu');
        }
      } catch (err) {
        console.error('Error fetching restaurant menu:', err);
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('userToken');
        } else {
          setError(err.message || 'An error occurred while fetching menu data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  // Add to cart handler
  const handleAddToCart = (item) => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add item to cart with quantity 1
    const cartItem = {
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: id,
      restaurantName: restaurantName
    };
    
    // Check if item already exists in cart
    const itemIndex = existingCart.findIndex(i => i.id === item._id);
    
    if (itemIndex > -1) {
      // If item exists, increase quantity
      existingCart[itemIndex].quantity += 1;
    } else {
      // Otherwise add new item
      existingCart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Navigate directly to cart page instead of showing alert
    navigate('/addcart');
  };

  // Filter and sort menu items
  const filteredAndSortedItems = menuItems
    .filter(item => 
      // Filter by search term
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(item => 
      // Filter by category
      activeCategory === 'all' || item.category === activeCategory
    )
    .sort((a, b) => {
      // Sort by the selected field and order
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        // Sort by name (if name exists)
        return sortOrder === 'asc' 
          ? (a.name || '').localeCompare(b.name || '') 
          : (b.name || '').localeCompare(a.name || '');
      }
    });

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if same field is clicked
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
        <p className="ms-3">Loading menu items...</p>
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

  return (
    <div className="restaurant-menu-page">
      <Container className="menu-view-container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button 
            variant="outline-secondary"
            onClick={() => navigate(`/userrestaurant/${id}`)}
          >
            <FaArrowLeft className="me-2" /> Back to restaurant
          </Button>
          <h1 className="restaurant-name text-center flex-grow-1">{restaurantName} Menu</h1>
          <Button 
            variant="outline-primary"
            onClick={() => navigate('/cart')}
          >
            <FaShoppingCart className="me-2" /> View Cart
          </Button>
        </div>
        
        {/* Menu items */}
        {filteredAndSortedItems.length > 0 ? (
          <Row>
            {filteredAndSortedItems.map((item, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="menu-item-card h-100 d-flex flex-column">
                  {item.imageUrl && (
                    <div className="menu-image-container" style={{ height: '300px', overflow: 'hidden' }}>
                      <Card.Img 
                        variant="top" 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="menu-item-image" 
                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start">
                      <Card.Title>{item.name || 'Unnamed Item'}</Card.Title>
                      <div className="menu-price">${(item.price || 0).toFixed(2)}</div>
                    </div>
                    {item.category && (
                      <Badge bg="secondary" className="category-badge mb-2">
                        {item.category}
                      </Badge>
                    )}
                    {item.description && (
                      <Card.Text className="menu-description">
                        {item.description}
                      </Card.Text>
                    )}
                    <div className="mt-auto pt-3">
                      <Button 
                        variant="success" 
                        className="w-100"
                        onClick={() => handleAddToCart(item)}
                      >
                        <FaShoppingCart className="me-2" /> Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center p-5">
            <FaUtensils size={50} className="text-muted mb-3" />
            <h3 className="text-muted">No menu items found</h3>
            {searchTerm && (
              <p>Try adjusting your search or filters</p>
            )}
            {!searchTerm && (
              <p>There are no menu items available for this restaurant</p>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default RestaurantMenuView;


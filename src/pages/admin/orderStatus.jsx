import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/orderstatus.css"; // You'll need to create this CSS file

const OrderStatusPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get orderId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  
  // Available status options
  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  
  // Fetch order details when component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/api/admin/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrder(response.data.order);
        setSelectedStatus(response.data.order.status);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details. " + (error.response?.data?.message || error.message));
      }
      
      setLoading(false);
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Handle status update
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateSuccess(false);
    setUpdateError(null);
    
    try {
      const token = localStorage.getItem("token");
      await axios.get(
        `http://localhost:3001/api/admin/orderstatus`, 
        { orderId, status: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUpdateSuccess(true);
      // Update local state
      setOrder(prev => ({ ...prev, status: selectedStatus }));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateError("Failed to update status. " + (error.response?.data?.message || error.message));
    }
    
    setUpdating(false);
  };
  
  // Function to get badge variant based on status
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Processing": return "primary";
      case "Shipped": return "info";
      case "Delivered": return "success";
      case "Cancelled": return "danger";
      default: return "secondary";
    }
  };
  
  const handleGoBack = () => {
    navigate("/admin/allorders");
  };
  
  if (loading) {
    return (
      <Container className="order-status-container py-4">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Loading order details...</p>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="order-status-container py-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={handleGoBack}>
          Back to All Orders
        </Button>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container className="order-status-container py-4">
        <Alert variant="warning">Order not found</Alert>
        <Button variant="secondary" onClick={handleGoBack}>
          Back to All Orders
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="order-status-container py-4">
      <Card className="order-status-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Order Status Management</h2>
          <Badge bg={getStatusBadgeVariant(order.status)} className="status-badge">
            {order.status}
          </Badge>
        </Card.Header>
        
        <Card.Body>
          <div className="order-info mb-4">
            <h4>Order Information</h4>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Customer:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            
            <h5 className="mt-3">Order Items</h5>
            <ul className="order-items-list">
              {order.items.map((item, index) => (
                <li key={index} className="order-item">
                  <span className="item-name">{item.dishItem.name}</span>
                  <span className="item-price">${item.dishItem.price}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="status-update-form">
            <h4>Update Status</h4>
            
            {updateSuccess && (
              <Alert variant="success">
                Order status updated successfully!
              </Alert>
            )}
            
            {updateError && (
              <Alert variant="danger">
                {updateError}
              </Alert>
            )}
            
            <Form onSubmit={handleStatusUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={updating}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <div className="d-flex mt-4 justify-content-between">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={updating || selectedStatus === order.status}
                >
                  {updating ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Updating...</span>
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
                
                <Button 
                  variant="secondary" 
                  onClick={handleGoBack}
                  disabled={updating}
                >
                  Back to All Orders
                </Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderStatusPage;
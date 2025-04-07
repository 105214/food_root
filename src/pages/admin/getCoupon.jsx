import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Spinner, Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import './getcoupon.css';
const backendurl=import.meta.env.VITE_BACKEND_URL










const CouponPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Retrieved Token:', token);
      
      if (!token) {
        navigate("/adminlogin");
        return;
      }
     
      const response = await axios.get(`${backendurl}/coupon/getallcoupon`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Coupons Response:', response.data);
      setCoupons(response.data.coupons || []);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToCreate = () => {
    navigate("/createcoupon");
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !couponToDelete) {
        return;
      }

      await axios.delete(`${backendurl}/coupon/deletecoupon/${couponToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Remove the deleted coupon from state
      setCoupons(coupons.filter(coupon => coupon._id !== couponToDelete._id));
      
      // Close the modal
      setShowDeleteModal(false);
      setCouponToDelete(null);
    } catch (err) {
      console.error('Delete Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete coupon');
    }
  };



  const renderCouponTable = () => {
    return (
      <Table striped bordered hover responsive className="coupon-table">
        <thead>
          <tr>
            <th>Coupon Code</th>
            <th>Discount (%)</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.code}</td>
              <td>{coupon.discount}%</td>
              <td>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'N/A'}</td>
              <td>
                <span className={`badge ${coupon.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
               
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteClick(coupon)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  // Detailed loading and error states
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Attempting to fetch coupons...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <strong>Error:</strong> {error}
          <p>Please check your connection and authentication.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="coupon-management-page">
      <Card className="mt-4 coupon-box">
        <Card.Header>
          <h2 className="text-center">Coupon Management</h2>
        </Card.Header>
        <Card.Body>
          <Button 
            variant="success" 
            className="mb-3"
            onClick={handleNavigateToCreate}
          >
            Create New Coupon
          </Button>
          {coupons.length === 0 ? (
            <Alert variant="info">No coupons found</Alert>
          ) : (
            renderCouponTable()
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the coupon <strong>{couponToDelete?.code}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CouponPage;


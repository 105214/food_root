import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import './css/paymentfailure.css';

const CancelPayment = () => {
  const navigate = useNavigate();

  const handleReturnToCart = () => {
    navigate('/cart'); // Navigate back to the cart page
  };

  const handleReturnToHome = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <Container className="cancel-payment-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="cancel-payment-card">
            <Card.Body className="text-center">
              <div className="cancel-icon">
                <FaTimesCircle />
              </div>
              
              <Card.Title className="cancel-title">Payment Cancelled</Card.Title>
              
              <Card.Text className="cancel-message">
                Your payment was not processed successfully.
                The transaction has been cancelled and no money has been deducted from your account.
              </Card.Text>
              
              <div className="error-details">
                <p>You may have cancelled the payment or there might have been an issue with the payment process.</p>
              </div>
              
              <div className="action-buttons">
                <Button 
                  variant="primary" 
                  className="return-cart-btn"
                  onClick={handleReturnToCart}
                >
                  Return to Cart
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="return-home-btn"
                  onClick={handleReturnToHome}
                >
                  Return to Homepage
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CancelPayment;
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/paymentsuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  // Effect for auto-navigation
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/home');
    }, 10000);
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);
  
  return (
    <Container className="payment-success-container">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <div className="success-card">
            <div className="success-animation">
              <div className="checkmark-circle">
                <div className="checkmark draw"></div>
              </div>
            </div>
            
            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-message">
              Thank you for your order. Your payment has been processed successfully.
            </p>
            
            <div className="order-info">
              <p>Your order will be prepared shortly.</p>
              <p>A confirmation email has been sent to your registered email address.</p>
            </div>
            
            <div className="redirect-info">
              <p>Redirecting to home page in <span className="countdown">{countdown}</span> seconds</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${(countdown / 10) * 100}%` }}></div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              className="home-button"
              onClick={() => navigate('/home')}
            >
              Return to Home Now
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;
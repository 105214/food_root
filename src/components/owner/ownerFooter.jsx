// Footer component (OwnerFooter.jsx)
import React from 'react';
import { Container } from 'react-bootstrap';
import "./footer.css";

const OwnerFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <Container>
        <p>© {currentYear} Copyright</p>
        <div className="social-icons">
          <a href="#facebook"><i className="fa fa-facebook"></i></a>
          <a href="#instagram"><i className="fa fa-instagram"></i></a>
          <a href="#twitter"><i className="fa fa-twitter"></i></a>
        </div>
      </Container>
    </footer>
  );
};

export default OwnerFooter;




















{/* <footer className="bg-success text-light py-4 mt-0">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Restaurant Manager</h5>
            <p className="text-muted">
              Streamlined restaurant management solution for menu control and restaurant administration.
            </p>
          </Col>
          
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-decoration-none text-light">Home</a></li>
              <li><a href="#dish/create" className="text-decoration-none text-light">Manage Dishes</a></li>
              <li><a href="#restaurant/add" className="text-decoration-none text-light">Manage Restaurants</a></li>
              <li><a href="#help" className="text-decoration-none text-light">Help & Support</a></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5>Contact</h5>
            <ul className="list-unstyled text-muted">
              <li>Email: support@restaurantmanager.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Hours: Mon-Fri, 9am-5pm</li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-3 bg-secondary" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted">
              &copy; {currentYear} Restaurant Manager. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer> */}
// Footer component (OwnerFooter.jsx)
import React from 'react';
import { Container } from 'react-bootstrap';
import "./footer.css";

const AdminFooter = () => {
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

export default AdminFooter;
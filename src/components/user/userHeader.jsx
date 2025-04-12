import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './userHeader.css';

function UserHeader() {
  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand href="/" className="brand-logo">Food Root</Navbar.Brand>
        <div className="d-flex align-items-center">
          <Link to="/cart" className="d-lg-none me-3">
            <ShoppingCart size={24} color="black" />
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        </div>
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto flex-column flex-lg-row">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/allrestaurants">Restaurants</Nav.Link>
            <Nav.Link as={Link} to="/alldishes">Dishes</Nav.Link>
            <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/admin/adminlogin">Admin</Nav.Link>
          </Nav>
          
          <Link to="/addcart" className="d-none d-lg-block ms-3">
            <ShoppingCart size={24} color="black" />
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserHeader;





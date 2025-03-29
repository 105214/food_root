import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link,useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';





const OwnerHeader= () => {
  return (
    <Navbar bg="success" variant="success" expand="lg" className="mb-0">
      <Container>
        <Navbar.Brand href="#home">Restaurant Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav >
            <Nav.Link as={Link} to="/owner/ownerdashboard">Home</Nav.Link>
            
            {/* Dish Dropdown Menu */}

            
            {/* Restaurant Dropdown Menu */}
            
          </Nav>
          
          {/* Logout Button on the right */}
          <Nav>
            <Nav.Link as={Link} to="/owner/ownerlogout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default OwnerHeader;
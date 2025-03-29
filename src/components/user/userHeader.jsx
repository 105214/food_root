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
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/restaurants">Restaurants</Nav.Link>
            <Nav.Link as={Link} to="/dishes">Dishes</Nav.Link>
            <Nav.Link as={Link} to="/">Login</Nav.Link>
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




// import React from 'react'
// import { Link,useNavigate} from 'react-router-dom'
// import { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import axios from 'axios';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import './userHeader.css'



// function UserHeader(){ 


//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSearch = async (e) => {
//     e.preventDefault();
    
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:3001/api/search`, {
//         params: { query: searchQuery }
//       });

//       setSearchResults(response.data.foodItems || []);
//       setError('');
//     } catch (error) {
//       console.error("Search error:", error);
//       setError("No results found");
//       setSearchResults([]);
//     }
//   };

//   const handleResultClick = (id) => {
//     navigate(`/dish/${id}`);
//   };
//   return (
//     <>
//       <Navbar expand="lg" className="bg-body-tertiary" id="nav-box">
//       <Container fluid id='nav-box'>
//         <Navbar.Brand href="#">food root</Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbarScroll" />
//         <Navbar.Collapse id="navbarScroll">
//           <Nav
//             className="me-auto my-2 my-lg-0"
//             style={{ maxHeight: '100px' }}
//             navbarScroll
//           >
//             <Nav.Link href="#action1">Home</Nav.Link>
//             <Nav.Link href="#action2">Restaurant</Nav.Link>
//             <Nav.Link href="#">Dishes</Nav.Link>
//             <Nav.Link href="#">Login</Nav.Link>
//           </Nav>
//           <Form className="d-flex" id="search-box" onsubmit={handleSearch}>
//             <Form.Control
//               type="search"
//               placeholder="Search"
//               className="me-2"
//               value={searchQuery(e.target.value)}
//               aria-label="Search"
//             />
//             <Button variant="outline-success">Search</Button>
//           </Form>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//     {searchResults.length > 0 && (
//         <div className="search-results">
//           {searchResults.map((item) => (
//             <div 
//               key={item._id} 
//               className="search-result-item" 
//               onClick={() => handleResultClick(item._id)}
//             >
//               {item.name} - {item.restaurant?.name || "No Restaurant"}
//             </div>
//           ))}
//         </div>
//       )}

//       {error && <div className="search-error">{error}</div>}
    
//     </>
//   )
// }

// export default UserHeader
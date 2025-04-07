import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  // Check if token exists when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please login again.');
      setTimeout(() => navigate('/adminlogin'), 2000);
    }
  }, [navigate]);

  const handleNavigation = (path) => {
    // Use React Router navigation instead of window.location
    navigate(path);
  };

  return (
    <Container fluid className="admin-dashboard d-flex flex-column align-items-center justify-content-center">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
        </div>
      </div>
      
      {error && <Alert variant="danger" className="w-75 mb-4">{error}</Alert>}
      
      <Row className="stats-cards g-4 mb-4 justify-content-center w-100">
        <Col md={6} xl={3}>
          <Card 
            className="stat-card clickable" 
            onClick={() => handleNavigation('/admin/getallcoupon')}
          >
            <Card.Body>
              <div className="stat-icon users">
              </div>
              <h2>All Coupons</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card 
            className="stat-card clickable" 
            onClick={() => handleNavigation('/admin/allorders')}
          >
            <Card.Body>
              <div className="stat-icon orders">
              </div>
              <h2>Total Orders</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card 
            className="stat-card clickable" 
            onClick={() => handleNavigation('/admin/adminprofile')}
          >
            <Card.Body>
              <div className="stat-icon revenue">
              </div>
              <h2>Profile</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={3}>
          <Card 
            className="stat-card clickable" 
            onClick={() => handleNavigation('/admin/adminlogout')}
          >
            <Card.Body>
              <div className="stat-icon logout">
              </div>
              <h2>Logout</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;



























// import React from 'react';
// import { Container, Row, Col, Card } from 'react-bootstrap';
// import './css/admindashboard.css';

// const AdminDashboard = () => {
//   const handleNavigation = (path) => {
//     window.location.href = path;
//   };

//   return (
//     <Container fluid className="admin-dashboard d-flex flex-column align-items-center justify-content-center">
//       <div className="dashboard-header">
//         <div>
//           <h1>Admin Dashboard</h1>
//         </div>
//       </div>
      
//       <Row className="stats-cards g-4 mb-4 justify-content-center w-100">
//         <Col md={6} xl={3}>
//           <Card 
//             className="stat-card clickable" 
//             onClick={() => handleNavigation('/admin/allusers')}
//           >
//             <Card.Body>
//               <div className="stat-icon users">
//               </div>
//               <h2>Total Users</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6} xl={3}>
//           <Card 
//             className="stat-card clickable" 
//             onClick={() => handleNavigation('/admin/allorders')}
//           >
//             <Card.Body>
//               <div className="stat-icon orders">
//               </div>
//               <h2>Total Orders</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={6} xl={3}>
//           <Card 
//             className="stat-card clickable" 
//             onClick={() => handleNavigation('/admin/adminprofile')}
//           >
//             <Card.Body>
//               <div className="stat-icon revenue">
//               </div>
//               <h2>Profile</h2>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AdminDashboard;
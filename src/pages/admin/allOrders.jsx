import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert, Container, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./allorders.css";
const backendurl=import.meta.env.VITE_BACKEND_URL

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendurl}/admin/allorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. " + (error.response?.data?.message || error.message));
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const navigateToOrderStatus = (orderId) => {
    navigate(`/admin/orderstatus?orderId=${orderId}`);
  };

  return (
    <Container className="admin-orders-container">
      <h2 className="title">User Orders</h2>
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {orders.map((order) => (
          <Col md={6} lg={4} key={order._id} className="mb-4">
            <Card className="order-card">
              <Card.Body>
                <Card.Title>Order ID: {order._id}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  User: {order.user.name} ({order.user.email})
                </Card.Subtitle>

                <ul className="order-items">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <strong>{item.dishItem.name}</strong> - ${item.dishItem.price}
                    </li>
                  ))}
                </ul>

                <div className="order-status">
                  <span>Status: <Badge bg={getStatusBadgeVariant(order.status)}>{order.status}</Badge></span>
                  
                  <div className="mt-3">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigateToOrderStatus(order._id)}
                    >
                      Order Status
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        
        {!loading && orders.length === 0 && (
          <Col xs={12}>
            <Alert variant="info">No orders found.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

// Helper function to get appropriate badge color for order status
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Processing":
      return "primary";
    case "Shipped":
      return "info";
    case "Delivered":
      return "success";
    case "Cancelled":
      return "danger";
    default:
      return "secondary";
  }
};

export default AdminOrder;






























// import React, { useState, useEffect } from "react";
// import { Card, Button, Spinner, Alert, Container, Row, Col, Dropdown } from "react-bootstrap";
// import axios from "axios";
// import "./allorders.css";

// const AdminOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token"); // Ensure authentication
//         const response = await axios.get("http://localhost:3001/api/admin/allorders", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setOrders(response.data.orders);
//       } catch (error) {
//         setError("Failed to fetch orders");
//       }
//       setLoading(false);
//     };

//     fetchOrders();
//   }, []);

//   const handleStatusUpdate = async (orderId, newStatus) => {
//     try {
//       await axios.put(
//         `http://localhost:3001/api/admin/orderstatus/${orderId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );

//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (error) {
//       setError("Failed to update status");
//     }
//   };

//   return (
//     <Container className="admin-orders-container">
//       <h2 className="title">User Orders</h2>
//       {loading && <Spinner animation="border" />}
//       {error && <Alert variant="danger">{error}</Alert>}

//       <Row>
//         {orders.map((order) => (
//           <Col md={6} lg={4} key={order._id} className="mb-4">
//             <Card className="order-card">
//               <Card.Body>
//                 <Card.Title>Order ID: {order._id}</Card.Title>
//                 <Card.Subtitle className="mb-2 text-muted">
//                   User: {order.user.name} ({order.user.email})
//                 </Card.Subtitle>

//                 <ul className="order-items">
//                   {order.items.map((item, index) => (
//                     <li key={index}>
//                       <strong>{item.dishItem.name}</strong> - ${item.dishItem.price}
//                     </li>
//                   ))}
//                 </ul>

//                 <div className="order-status">
//                   <span>Status: {order.status}</span>
//                   <Dropdown>
//                     <Dropdown.Toggle variant="primary" size="sm">
//                       Update Status
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       <Dropdown.Item onClick={() => handleStatusUpdate(order._id, "Pending")}>
//                         Pending
//                       </Dropdown.Item>
//                       <Dropdown.Item onClick={() => handleStatusUpdate(order._id, "Shipped")}>
//                         Shipped
//                       </Dropdown.Item>
//                       <Dropdown.Item onClick={() => handleStatusUpdate(order._id, "Delivered")}>
//                         Delivered
//                       </Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default AdminOrder;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Card, Alert } from "react-bootstrap";
import "./css/adminlogout.css";

const AdminLogout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: No token found");
      setTimeout(() => navigate("/admin/adminlogin"), 2000);  // Redirect to login page
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: No token found");
        setTimeout(() => navigate("/admin/adminlogin"), 2000);
        return;
      }

      const response = await fetch("http://localhost:3001/api/admin/adminlogout", {
        method: "PUT", // Change to POST if needed
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      localStorage.removeItem("token"); // Remove token immediately

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Logged out successfully");
      } else {
        setError("Logout failed. Please try again.");
      }
      
      setTimeout(() => navigate("/admin/adminlogin"), 2000);
      
    } catch (err) {
      console.error("Logout error:", err);
      setError("Network error. Try again.");
      setTimeout(() => navigate("/admin/adminlogin"), 2000);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center logout-container">
      <Card className="text-center p-4 logout-card">
        <Card.Header as="h2">Admin Logout</Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Button 
            variant="danger" 
            size="lg" 
            onClick={handleLogout} 
            className="mt-3"
          >
            Logout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogout;


















// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Container, Card, Alert } from "react-bootstrap";
// import "./css/adminlogout.css";

// const AdminLogout = () => {
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
  
//   useEffect(() => {
    
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("Unauthorized: No token found");
//     }
//   }, []);
//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Unauthorized: No token found");
//         return;
//       }
      
//       // Make the logout request
//       const response = await fetch("http://localhost:3001/api/admin/adminlogout", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         }
//       });
      
//       // Clear token regardless of response
//       localStorage.removeItem("token");
      
//       if (response.ok) {
//         const data = await response.json();
//         setMessage(data.message || "Logged out successfully");
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Logout failed");
//       }
      
//       // Redirect after short delay
//       setTimeout(() => navigate("/admin/adminlogin"), 2000);
//     } catch (err) {
//       console.error("Logout error:", err);
//       setError(err.message || "Logout failed");
//       localStorage.removeItem("token"); // Clear token even on error
//       setTimeout(() => navigate("/admin/adminlogin"), 2000);
//     }
//   };
//   // const handleLogout = async () => {
//   //   try {
//   //     const token = localStorage.getItem("token");
//   //     if (!token) {
//   //       setError("Unauthorized: No token found");
//   //       return;
//   //     }
      
//   //     const response = await fetch("http://localhost:3001/api/admin/adminlogout", {
//   //       method: "PUT",
//   //       credentials: "include", // Include cookies
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         "Authorization": `Bearer ${token}`
//   //       }
//   //     });
      
//   //     // Handle the response
//   //     if (!response.ok) {
//   //       const errorData = await response.json();
//   //       throw new Error(errorData.message || "Logout failed");
//   //     }
      
//   //     const data = await response.json();
      
    
//   //     localStorage.removeItem("token");
      
   
//   //     setMessage(data.message || "Logged out successfully");
//   //     setError("");
      
    
//   //     setTimeout(() => navigate("/admin/adminlogin"), 2000);
//   //   } catch (err) {
//   //     setError(err.message || "Logout failed");
//   //   }
//   // };
  
//   return (
//     <Container className="d-flex justify-content-center align-items-center logout-container">
//       <Card className="text-center p-4 logout-card">
//         <Card.Header as="h2">Admin Logout</Card.Header>
//         <Card.Body>
//           {message && <Alert variant="success">{message}</Alert>}
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Button 
//             variant="danger" 
//             size="lg" 
//             onClick={handleLogout} 
//             className="mt-3"
//           >
//             Logout
//           </Button>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default AdminLogout;


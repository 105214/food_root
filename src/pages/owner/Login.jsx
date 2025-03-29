import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import sideImage from "./image/bg.jpg"
import { Link, useNavigate } from "react-router-dom";
import "./css/login.css"; // Import custom CSS

const OwnerLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // Error message
  const navigate = useNavigate(); // For redirection

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    try {
      const response = await axios.put(
        "http://localhost:3001/api/owner/ownerlogin",
        credentials
      );
  
      if (response.data.token && response.data.ownerId) {
        localStorage.setItem("token", response.data.token); // Store token
        localStorage.setItem("ownerId", response.data.ownerId); // Store ownerId
        console.log("Token stored:", localStorage.getItem("token"));
        console.log("Owner ID stored:", localStorage.getItem("ownerId"));
  
        navigate("/owner/ownerdashboard"); // Redirect to owner dashboard
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Try again.");
    }
  };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(""); // Clear previous errors

  //   try {
  //     const response = await axios.put(
  //       "http://localhost:3001/api/owner/ownerlogin",
  //       credentials
  //     );
  //     if (response.data.token) {
  //       localStorage.setItem("token", response.data.token); // Store token
  //       console.log("Token stored:", localStorage.getItem("token"));
  //       navigate("/owner/ownerdashboard"); // Redirect to owner dashboard
  //     } else {
  //       setError("Login failed. Please check your credentials.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setError("Invalid email or password. Try again.");
  //   }
  // };

  return (
    <div className="login-page">
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Col md={5}>
        <div className="login-box">
          <h2 className="text-center">Owner Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/owner/addowner">Create one</Link>
            </p>
          </Form>
        </div>
      </Col>
    </Container>
  </div>
  );
};

export default OwnerLogin;










{/* <Container className="login-container mt-5">
<Row className="justify-content-center">
  <Col md={5} lg={9}>
    <div className="login-form-container p-4 shadow">
      <h2 className="text-center mb-4">Owner Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
        <p>
          don't have an account <Link to="/signup">create one</Link>
          </p>
      </Form>
    </div>
  </Col>
</Row>
</Container> */}




















// import React, { useState } from "react";
// import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./login.css"; // Import custom CSS

// const OwnerLogin = () => {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [error, setError] = useState(""); // Error message
//   const navigate = useNavigate(); // For redirection

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // Clear previous errors

//     try {
//       const response = await axios.put("http://localhost:3001/api/owner/ownerlogin", credentials);
//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token); // Store token
//         console.log("Token stored:", localStorage.getItem("token"));
//         navigate("/dashboard"); // Redirect to owner dashboard
//       } else {
//         setError("Login failed. Please check your credentials.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Invalid email or password. Try again.");
//     }
//   };

//   return (
//     <Container className="login-container">
//       <Row className="justify-content-md-center">
//         <Col md={6} className="login-box">
//           <h2 className="text-center">Owner Login</h2>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="email">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 placeholder="Enter email"
//                 value={credentials.email}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

//             <Form.Group controlId="password" className="mt-3">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 placeholder="Enter password"
//                 value={credentials.password}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

//             <Button variant="primary" type="submit" className="mt-3 w-100">
//               Login
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default OwnerLogin;











// import React from 'react'
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import './login.css'

// function Login() {
//   return (
// <div className='container-fluid parent-box'>
//   <div className="login-main-image-box">
//     </div>
//     <div className="d-flex p-0 form-box">
//         <div className="input-image-box">

//         </div>
//         <div className="input-box-text">
//           <Form>
//             <h2 className="text-center">Login</h2>
//               <div className="login-input-box pt-5 pb-5 ps-5 ms-5">
//               <Form.Group className="mb-3 email-box" controlId="formBasicEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control type="email" placeholder="Enter email" />
//               </Form.Group>
//               <Form.Group className="mb-3 password-box" controlId="formBasicPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control type="password" placeholder="Password" />
//               </Form.Group>
//               <Form.Group className="mb-3" controlId="formBasicCheckbox">
//               </Form.Group>
//                <Button variant="warning" className="login-button ms-4" type="submit">Login</Button>
//                   <div className="forgot-password mt-3">
//                     <p>forgot password?</p>
//                   </div>
//                     <p>don't have an account create one</p>
//                   </div>
//           </Form>
//         </div>
//     </div>
  
// </div>

  




    
//   )
// }

// export default Login

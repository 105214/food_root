import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './css/Signup.css'
const backendurl=import.meta.env.VITE_BACKEND_URL

function OwnerSignup() {
  const navigate=useNavigate()
  const [owner, setOwner] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!owner.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!owner.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(owner.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!owner.password) {
      newErrors.password = "Password is required";
    } else if (owner.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!owner.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(owner.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setErrors(prev => ({...prev, image: "File size should be less than 5MB"}));
          return;
        }
        setOwner(prev => ({ ...prev, image: file }));
        setPreviewImage(URL.createObjectURL(file));
        setErrors(prev => ({...prev, image: null}));
      }
    } else {
      setOwner(prev => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      setErrors(prev => ({...prev, [name]: null}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    Object.keys(owner).forEach(key => {
      if (owner[key] !== null) {
        formData.append(key, owner[key]);
      }
    });

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendurl}/owner/addowner`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data) {
        alert("Signup Successful");
        setOwner({ name: "", email: "", password: "", mobile: "", image: null });
        setPreviewImage("");
        navigate("/owner/ownerlogin")
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Signup Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-background">
    <Container className="signup-container">
      <Row className="justify-content-center">
        <Col md={12} className="signup-box">
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={owner.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={owner.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={owner.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMobile">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                name="mobile"
                value={owner.mobile}
                onChange={handleChange}
                isInvalid={!!errors.mobile}
              />
              <Form.Control.Feedback type="invalid">
                {errors.mobile}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control 
                type="file" 
                name="image" 
                onChange={handleChange} 
                accept="image/*"
                isInvalid={!!errors.image}
              />
              <Form.Control.Feedback type="invalid">
                {errors.image}
              </Form.Control.Feedback>
            </Form.Group>

            {previewImage && (
              <div className="mb-3">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="preview-img" 
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              </div>
            )}

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default OwnerSignup;

























// import React, { useState } from "react";
// import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import "./Signup.css";

// function Signup() {
//   const [owner, setOwner] = useState({
//     name: "",
//     email: "",
//     password: "",
//     mobile: "",  // New Mobile Field
//     // role: "owner", 
//     image: null,
//   });

//   console.log("owner", owner);

//   const [loading, setLoading] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     if (type === "file") {
//       const file = e.target.files[0];
//       setOwner((prev) => ({ ...prev, image: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     } else {
//       setOwner((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     console.log("owner hitted");
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", owner.name);
//     formData.append("email", owner.email);
//     formData.append("password", owner.password);
//     formData.append("mobile", owner.mobile); // New Mobile Field
//     // formData.append("role", owner.role);
//     if (owner.image) {
//       formData.append("image", owner.image);
//     }

//     try {
//       setLoading(true);
//       await axios.post("http://localhost:3001/api/owner/addowner", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("owner hitted");
//       alert("Signup Successful");
//       setOwner({ name: "", email: "", password: "", mobile: "",  image: null });
//       setPreviewImage("");
//     } catch (error) {
//       console.error("Signup Error:", error);
//       alert("Signup Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="signup-container">
//       <Row className="justify-content-center">
//         <Col md={6} className="signup-box">
//           <h2 className="text-center">Sign Up</h2>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="formName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={owner.name}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formEmail">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={owner.email}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={owner.password}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formMobile">
//               <Form.Label>Mobile Number</Form.Label>
//               <Form.Control
//                 type="tel"
//                 name="mobile"
//                 value={owner.mobile}
//                 onChange={handleChange}
//                 pattern="[0-9]{10}" // Ensures 10-digit number
//                 required
//               />
//             </Form.Group>
//             {/* <Form.Group controlId="formRole">
//               <Form.Label>Role</Form.Label>
//               <Form.Control as="select" name="role" value={owner.role} onChange={handleChange}>
//                 <option value="user">User</option>
//                 <option value="owner">Owner</option>
//                 <option value="admin">Admin</option>
//               </Form.Control>
//             </Form.Group> */}
//             <Form.Group controlId="formImage">
//               <Form.Label>Upload Image</Form.Label>
//               <Form.Control type="file" name="image" onChange={handleChange} accept="image/*" />
//             </Form.Group>
//             {previewImage && <img src={previewImage} alt="Preview" className="preview-img" />}
//             <Button variant="primary" type="submit" className="signup-button" disabled={loading}>
//               {loading ? "Signing Up..." : "Sign Up"}
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Signup;

























// import React, { useState } from "react";
// import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import "./Signup.css";

// function Signup() {
//   const [owner, setOwner] = useState({
   
//     name: "",
//     email: "",
//     password: "",
//     role: "owner", // Default role
//     image: null,
  
//   }
//   );
//   console.log("owner",owner)
//   const [loading, setLoading] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     if (type === "file") {
//       const file = e.target.files[0];
//       setOwner({ ...owner, image: file });
//       setPreviewImage(URL.createObjectURL(file));
//     } else {
//       setOwner({ ...owner, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     console.log("owner hitted")
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", owner.name);
//     formData.append("email", owner.email);
//     formData.append("password", owner.password);
//     formData.append("role", owner.role);
//     if (owner.image) {
//       formData.append("image", owner.image);
//     }

//     try {
//       setLoading(true);
//       await axios.post("http://localhost:3001/api/owner/addowner", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
        
//       }
      
//     );
//     console.log("owner hitted")
//       alert("Signup Successful");
//       setOwner({ name: "", email: "", password: "", role: "owner", image: null });
//       setPreviewImage("");
//     } catch (error) {
//       console.error("Signup Error:", error);
//       alert("Signup is Failed",error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container className="signup-container">
//       <Row className="justify-content-center">
//         <Col md={6} className="signup-box">
//           <h2 className="text-center">Sign Up</h2>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="formName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={owner.name}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formEmail">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={owner.email}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={owner.password}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group controlId="formRole">
//               <Form.Label>Role</Form.Label>
//               <Form.Control as="select" name="role" value={owner.role} onChange={handleChange}>
//                 <option value="user">User</option>
//                 <option value="owner">Owner</option>
//                 <option value="admin">Admin</option>
//               </Form.Control>
//             </Form.Group>
//             <Form.Group controlId="formImage">
//               <Form.Label>Upload Image</Form.Label>
//               <Form.Control type="file" name="image" onChange={handleChange} accept="image/*" />
//             </Form.Group>
//             {previewImage && <img src={previewImage} alt="Preview" className="preview-img" />}
//             <Button variant="primary" type="submit" className="signup-button" disabled={loading}>
//               {loading ? "Signing Up..." : "Sign Up"}
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Signup;

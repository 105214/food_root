import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userUpdate.css';

const UpdateProfile = () => {
  const [user, setUser] = useState({ 
    name: '', 
    email: '',
    mobile: '', 
    address: '', 
    profilePic: null
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.error("No token found");
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      console.log("Using token:", token.substring(0, 15) + "...");
    
      try {
        const response = await axios.get("http://localhost:3001/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("API Response:", response.data);
        
        // Handle different response structures
        const userData = response.data.data;
        
        if (userData) {
          setUser(prev => ({...prev, ...userData}));
          console.log("User data loaded:", userData);
        } else {
          setError("User data structure unexpected");
          console.error("Unexpected data structure:", response.data);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        
        // Detailed error reporting
        if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          setError("No response received from server. Please check your connection.");
        } else {
          setError(`Request error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setUser({ ...user, profilePic: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage('No authentication token found');
        return;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('_id', user._id);
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('mobile', user.mobile);
      formData.append('address', user.address);
      
      // Only append if a new file was selected
      if (user.profilePic instanceof File) {
        formData.append('profilePic', user.profilePic);
      }
      
      const response = await axios.put(
        'http://localhost:3001/api/user/profileupdate', 
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Change content type
          }
        }
      );
      
      console.log("Update response:", response.data);
      setMessage(response.data.message || 'Profile updated successfully');
      
      if (response.data.user) {
        setUser(prev => ({...prev, ...response.data.user}));
      }
    } catch (error) {
      // Error handling remains the same
      console.error('Update error:', error);
      // ...rest of your error handling code
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage('');
    
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setMessage('No authentication token found');
  //       return;
  //     }
      
  //     console.log("Submitting data:", user);
      
  //     // Create request data
  //     const userData = {
  //       _id: user._id,  // Make sure you're sending the user ID
  //       name: user.name,
  //       email: user.email,
  //       mobile: user.mobile,
  //       address: user.address,
  //       profilePic:user.profilePic,
  //     };
      
  //     const response = await axios.put(
  //       'http://localhost:3001/api/user/profileupdate', 
  //       userData,
  //       {
  //         headers: { 
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );
      
  //     console.log("Update response:", response.data);
  //     setMessage(response.data.message || 'Profile updated successfully');
      
  //     // Update local user state with returned data if available
  //     if (response.data.user) {
  //       setUser(prev => ({...prev, ...response.data.user}));
  //     }
  //   } catch (error) {
  //     console.error('Update error:', error);
      
  //     if (error.response) {
  //       setMessage(`Error: ${error.response.status} - ${error.response.data.message || 'Update failed'}`);
  //     } else if (error.request) {
  //       setMessage('Error: No response from server');
  //     } else {
  //       setMessage(`Error updating profile: ${error.message}`);
  //     }
  //   }
  // };

  return (
    <Container className="profile-container">
      <h2 className="text-center">Update Profile</h2>
      
      {/* Status messages */}
      {loading && <Alert variant="info">Loading profile data...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="info">{message}</Alert>}
      
      {/* Main form */}
      {!loading && !error && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={user.name || ""} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              value={user.email || ""} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control 
              type="text" 
              name="mobile" 
              value={user.mobile || ""} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control 
              type="text" 
              name="address" 
              value={user.address || ""} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control 
              type="file" 
              onChange={handleFileChange} 
            />
          </Form.Group>
          
          <Button variant="primary" type="submit" className="mt-3">
            Update Profile
          </Button>
        </Form>
      )}
      
      {/* Debug information */}
      
    </Container>
  );
};

export default UpdateProfile;
























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Form, Button, Container, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './userUpdate.css';

// const UpdateProfile = () => {
//   const [user, setUser] = useState({ 
//     name: '', 
//     email: '',
//      mobile: '', 
//      address: '', 
//      profilePic: null
//      });
//   const [message, setMessage] = useState('');

//   // useEffect(() => {
//   //   axios.get('http://localhost:3001/api/user/profile')
//   //     .then(response => setUser(response.data))
//   //     .catch(error => console.error('Error fetching user data:', error));
//   // }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       console.error("No token found");
//       return;
//     }
  
//     axios
//       .get("http://localhost:3001/api/user/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => setUser(response.data))
//       .catch((error) => console.error("Error fetching user data:", error));
//   }, []);
  
  


//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setUser({ ...user, profilePic: e.target.files[0] });
//   };



//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setMessage('No authentication token found');
//         return;
//       }
      
//       // Create request data
//       const userData = {
//         _id: user._id,  // Make sure you're sending the user ID
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         address: user.address
//       };
      
//       // For profile pic, you would need a separate endpoint or multipart handling
      
//       const response = await axios.put(
//         'http://localhost:3001/api/user/profileupdate', 
//         userData,
//         {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error('Update error:', error);
//       setMessage('Error updating profile: ' + (error.response?.data?.message || error.message));
//     }
//   };
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const formData = new FormData();
//   //   formData.append('name', user.name);
//   //   formData.append('email', user.email);
//   //   formData.append('mobile', user.mobile);
//   //   formData.append('address', user.address);
//   //   if (user.profilePic) formData.append('profilePic', user.profilePic);

//   //   try {
//   //     const response = await axios.put('http://localhost:3001/api/user/profileupdate', formData, {
//   //       headers: { 'Content-Type': 'multipart/form-data' },
//   //     });
//   //     setMessage(response.data.message);
//   //   } catch (error) {
//   //     setMessage('Error updating profile');
//   //   }
//   // };

//   return (
//     <Container className="profile-container">
//       <h2 className="text-center">Update Profile</h2>
//       {message && <Alert variant="info">{message}</Alert>}
//       <Form onSubmit={handleSubmit}>
//         <Form.Group>
//           <Form.Label>Name</Form.Label>
//           <Form.Control type="text" name="name" value={user.name??"No Name"} onChange={handleChange} required />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Email</Form.Label>
//           <Form.Control type="email" name="email" value={user.email??"No Email"} onChange={handleChange} required />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Mobile</Form.Label>
//           <Form.Control type="text" name="mobile" value={user.mobile??"No Mobile"} onChange={handleChange} required />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Address</Form.Label>
//           <Form.Control type="text" name="address" value={user.address??"No Address"} onChange={handleChange} required />
//         </Form.Group>

//         <Form.Group>
//           <Form.Label>Profile Picture</Form.Label>
//           <Form.Control type="file" onChange={handleFileChange} />
//         </Form.Group>

//         <Button variant="primary" type="submit" className="mt-3">Update Profile</Button>
//       </Form>
//     </Container>
//   );
// };

// export default UpdateProfile;

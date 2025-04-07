import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./cartadd.css";

const AddToCart = () => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/api"
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        setError("Authentication failed. Please log in again.");
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("http://localhost:3001/api/cart/getcart");
      if (response.data?.cart?.items) {
        const processedCart = response.data.cart.items.map(item => ({
          ...item,
          dishId: item.dishId || null,
          quantity: item.quantity || 0,
          uniqueKey: item.dishId?._id || Math.random().toString()
        }));
        setCart(processedCart);
        if (processedCart.length === 0) {
          setMessage("Your cart is empty");
        }
      } else {
        setError("Invalid cart data structure");
        setMessage("No items in cart");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCart = async (dishId) => {
    try {
      const response = await axiosInstance.delete(`http://localhost:3001/api/cart/deletecart/${dishId}`);
      if (response.data.success) {
        setCart(prevCart => prevCart.filter(item => item.dishId._id !== dishId));
        setMessage("Item removed from cart successfully");
        fetchCart();
      } else {
        setError("Failed to remove item from cart");
      }
    } catch (error) {
      setError("Failed to remove item from cart");
    }
  };

  const handleUpdateQuantity = async (dishId, newQuantity) => {
    if (!dishId) {
      setError("Invalid dish ID, cannot update quantity.");
      return;
    }
    try {
      const updatedCart = cart.map(item =>
        item.dishId === dishId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      const response = await axiosInstance.put(`http://localhost:3001/api/cart/updatecart/${dishId}`, {
        quantity: newQuantity
      });
      if (!response.data.success) {
        setCart(cart);
        setError("Failed to update cart quantity");
      }
    } catch (error) {
      setCart(cart);
      setError("Failed to update cart quantity");
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleBuyAllItems = () => {
    axiosInstance.post('http://localhost:3001/api/order/placeorder', {
      paymentMethod: 'Cash on Delivery',
      deliveryAddress: 'User Address'
    })
    .then(response => {
      setMessage("Order placed successfully");
      navigate('/userorder');
    })
    .catch(error => {
      setError(error.response?.data?.message || "Failed to place order");
    });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="cart-container py-4">
      <h2 className="text-center mb-4">Your Cart</h2>
      {message && <Alert variant="success" dismissible onClose={() => setMessage("")}>{message}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      {cart.length === 0 ? (
        <Alert variant="info">Your cart is empty.</Alert>
      ) : (
        <>
          <div className="cart-items-grid">
            {cart.map((item) => (
              <Card key={item.uniqueKey} className="cart-item-card shadow mb-3">
                <Card.Body>
                  <Card.Title>{item.name || 'Unnamed Item'}</Card.Title>
                  <Card.Text>Price: ₹{item.price}</Card.Text>
                  <div className="quantity-control d-flex align-items-center justify-content-between mb-3">
                    <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.dishId, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}>-</Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.dishId, item.quantity + 1)}>+</Button>
                  </div>
                  <Card.Text>Total: ₹{(item.price * item.quantity).toFixed(2)}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="danger" onClick={() => handleRemoveCart(item.dishId)}>Remove</Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
          <div className="cart-summary mt-4 text-center">
            <h3>Total Price: ₹{calculateTotalPrice().toFixed(2)}</h3>
            <Button variant="primary" size="lg" onClick={handleBuyAllItems} className="mt-3">Buy All Items</Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default AddToCart;











// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import "./cartadd.css";

// const AddToCart = () => {
//   const [cart, setCart] = useState([]);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Create a centralized axios instance with interceptors
//   const axiosInstance = axios.create({
//     baseURL:'http://localhost:3001/api'
//   });

//   // Add a request interceptor to include the token
//   axiosInstance.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // Add a response interceptor to handle unauthorized errors
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response && error.response.status === 401) {
//         localStorage.removeItem("token");
//         setError("Authentication failed. Please log in again.");
//         navigate("/login");
//       }
//       return Promise.reject(error);
//     }
//   );

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get("http://localhost:3001/api/cart/getcart");
      
//       console.log("Full cart response:", response.data);
      
//       if (response.data?.cart?.items) {
//         const processedCart = response.data.cart.items.map(item => {
//           console.log("Processing cart item:", item);
//           return {
//             ...item,
//             dishId: item.dishId || null, // Ensure it's either a valid ID or null
//             quantity: item.quantity || 0,
//             uniqueKey: item.dishId?._id || Math.random().toString()
            
//           };
      
//         });
       
//         setCart(processedCart);
//         console.log("Processed cart:", processedCart);
  
//         if (processedCart.length === 0) {
//           setMessage("Your cart is empty");
//         }
//       } else {
//         setError("Invalid cart data structure");
//         setMessage("No items in cart");
//       }
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//       setError(err.response?.data?.message || "Failed to load cart");
//     } finally {
//       setLoading(false);
//     }
//   };
  
  

//   const handleRemoveCart = async (dishId) => {
//     try {
//       const response = await axiosInstance.delete(`http://localhost:3001/api/cart/deletecart/${dishId}`);
      
//       if (response.data.success) {
//         // Remove item from local state
//         setCart(prevCart => prevCart.filter(item => item.dishId._id !== dishId));
//         setMessage("Item removed from cart successfully");
//         fetchCart()
//       } else {
//         setError("Failed to remove item from cart");
//       }
//     } catch (error) {
//       console.error("Error removing item:", error);
//       setError("Failed to remove item from cart");
//     }
//   };

//   const handleUpdateQuantity = async (dishId, newQuantity) => {
//     if (!dishId) {
//       console.error("Invalid dishId detected:", dishId);
//       setError("Invalid dish ID, cannot update quantity.");
//       return;
//     }
  
//     try {
//       console.log("Updating quantity for dishId:", dishId, "New Quantity:", newQuantity);
  
//       // Optimistically update UI before sending request
//       const updatedCart = cart.map(item => 
//         item.dishId === dishId ? { ...item, quantity: newQuantity } : item
//       );
//       setCart(updatedCart);
  
//       // Send request to update backend
//       const response = await axiosInstance.put(`http://localhost:3001/api/cart/updatecart/${dishId}`, {
//         quantity: newQuantity
//       });
  
//       if (!response.data.success) {
//         setCart(cart); // Revert local state if backend update fails
//         setError("Failed to update cart quantity");
//       }
//     } catch (error) {
//       console.error("Error updating quantity:", error.response?.data || error.message);
//       setCart(cart); // Revert state on failure
//       setError("Failed to update cart quantity");
//     }
//   };
  





//   const handleBuyNow = (dish) => {
//     navigate('/userorder', { state: { dish } });
//   };

//   // Calculate total price of all items in the cart
//   const calculateTotalPrice = () => {
//     return cart.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   };

//   // Handle buying all items in the cart
//  // Modify this function in your AddToCart.js
// const handleBuyAllItems = () => {
//   // Instead of just passing cart data, make an API call to place the order
//   axiosInstance.post('http://localhost:3001/api/order/placeorder', {
//     paymentMethod: 'Cash on Delivery', // Default or let user select
//     deliveryAddress: 'User Address' // Get from user profile or form
//   })
//   .then(response => {
//     setMessage("Order placed successfully");
//     navigate('/userorder'); // Navigate to order page after successful placement
//   })
//   .catch(error => {
//     console.error("Error placing order:", error);
//     setError(error.response?.data?.message || "Failed to place order");
//   });
// };

//   if (loading) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//       </Container>
//     );
//   }

//   return (
//     <Container className="cart-container py-4">
//       <h2 className="text-center mb-4">Your Cart</h2>
      
//       {message && (
//         <Alert variant="success" dismissible onClose={() => setMessage("")}>
//           {message}
//         </Alert>
//       )}
      
//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}

//       {cart.length === 0 ? (
//         <Alert variant="info">Your cart is empty.</Alert>
//       ) : (
//         <>
//           <div className="cart-items-grid">
//             {cart.map((item) => (
//               <Card key={item.uniqueKey} className="cart-item-card shadow mb-3">
//                 <Card.Body>
//                   <Card.Title>{item.name || 'Unnamed Item'}</Card.Title>
//                   <Card.Text>Price: ₹{item.price}</Card.Text>
//                   <div className="quantity-control d-flex align-items-center justify-content-between mb-3">
//                     <Button 
//                       variant="outline-secondary" 
//                       onClick={() => handleUpdateQuantity(item.dishId, Math.max(1, item.quantity - 1))}
//                       disabled={item.quantity <= 1}
//                     >
//                       -
//                     </Button>
//                     <span className="mx-2">{item.quantity}</span>
//                     <Button 
//                       variant="outline-secondary" 
//                       onClick={() => handleUpdateQuantity(item.dishId, item.quantity + 1)}
//                     >
//                       +
//                     </Button>
//                   </div>
//                   <Card.Text>Total: ₹{(item.price * item.quantity).toFixed(2)}</Card.Text>
//                   <div className="d-flex justify-content-between">
//                     <Button 
//                       variant="danger" 
//                       onClick={() => handleRemoveCart(item.dishId)}
//                     >
//                       Remove
//                     </Button>
//                     <Button 
//                       variant="success" 
//                       onClick={() => handleBuyNow(item.dishId)}
//                     >
//                       Buy Now
//                     </Button>
//                   </div>
//                 </Card.Body>
//               </Card>
//             ))}
//           </div>

//           {/* Total Price and Buy All Button Section */}
//           <div className="cart-summary mt-4 text-center">
//             <h3>Total Price: ₹{calculateTotalPrice().toFixed(2)}</h3>
//             <Button 
//               variant="primary" 
//               size="lg" 
//               onClick={handleBuyAllItems}
//               className="mt-3"
//             >
//               Buy All Items
//             </Button>
//           </div>
//         </>
//       )}
//     </Container>
//   );
// };

// export default AddToCart;
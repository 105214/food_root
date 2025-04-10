import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./cartadd.css";
const backendurl=import.meta.env.VITE_BACKEND_URL



const AddToCart = () => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL:backendurl
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
        navigate("/");
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
      const response = await axiosInstance.get(`${backendurl}/api/cart/getcart`);
      if (response.data?.cart?.items) {
        const processedCart = response.data.cart.items.map(item => ({
          ...item,
          name: item.name || 'Unnamed Item', // extract name
          uniqueKey: item.dishId?._id || Math.random().toString()
          // Don't modify the dishId structure here
        }));
        console.log(response,"response")
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
        



  //       setCart(processedCart);
  //       if (processedCart.length === 0) {
  //         setMessage("Your cart is empty");
  //       }
  //     } else {
  //       setError("Invalid cart data structure");
  //       setMessage("No items in cart");
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to load cart");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRemoveCart = async (dishId) => {
    try {
      const response = await axiosInstance.delete(`${backendurl}/api/cart/deletecart/${dishId}`);
      if (response.data.success) {
       // This assumes dishId is an object with an _id property
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
      // This assumes dishId is a string
const updatedCart = cart.map(item =>
  item.dishId === dishId ? { ...item, quantity: newQuantity } : item
);
      
      
      setCart(updatedCart);
      const response = await axiosInstance.put(`${backendurl}/api/cart/updatecart/${dishId}`, {
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
    axiosInstance.post(`${backendurl}/api/order/placeorder`, {
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
























// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Button, Alert, Spinner, Table, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./cartadd.css";

// const backendurl = import.meta.env.VITE_BACKEND_URL;

// const AddToCart = () => {
//   const [cart, setCart] = useState({ items: [], totalPrice: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch cart data on component mount
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Please log in to view your cart.");
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get(`${backendurl}/api/cart/getcart`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
// console.log(backendurl,"backend url")
//       if (response.data.success) {
//         setCart(response.data.cart || { items: [], totalPrice: 0 });
//       } else {
//         setError(response.data.message || "Failed to fetch cart items.");
//       }
//     } catch (error) {
//       console.error("Error fetching cart:", error.response?.data || error);
//       setError(error.response?.data?.message || "Error loading your cart.");
      
//       // Handle unauthorized access
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQuantityChange = async (dishId, newQuantity, price) => {
//     try {
//       setUpdateLoading(true);
//       const token = localStorage.getItem("token");
  
//       if (!token) {
//         setError("Please log in to update your cart.");
//         return;
//       }
  
//       // Validate quantity
//       newQuantity = parseInt(newQuantity);
//       if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 99) {
//         setError("Quantity must be between 1 and 99");
//         setUpdateLoading(false);
//         return;
//       }
  
//       // Make sure price is a valid number
//       const validPrice = Number(price);
//       if (isNaN(validPrice)) {
//         setError("Invalid price value");
//         setUpdateLoading(false);
//         return;
//       }
  
//       // Fix: Ensure URL is correct by using the full backend URL
//       const response = await axios.put(
//         console.log('Request URL:', `${backendurl}/api/cart/updatecart`),
//         console.log('Request Payload:', { dishId, quantity: newQuantity, price: validPrice }),
//         `${backendurl}/cart/updatecart`, // Make sure backendurl is correctly defined and doesn't have trailing slashes
//         {
//           dishId,
//           quantity: newQuantity,
//           price: validPrice
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       if (response.data.success) {
//         // Update cart state with the updated cart from the response
//         setCart(response.data.cart);
//         setError(""); // Clear any previous errors
//       } else {
//         setError(response.data.message || "Failed to update cart.");
//       }
//     } catch (error) {
//       console.error("Error updating cart:", error);
      
//       // More detailed error handling
//       if (error.response) {
//         // Log specific error details from the response
//         console.error("Response status:", error.response.status);
//         console.error("Response data:", error.response.data);
        
//         // Handle specific error cases
//         if (error.response.status === 404) {
//           setError("Cart update endpoint not found. Please check API configuration.");
//         } else {
//           setError(error.response.data?.message || "Error updating cart quantity.");
//         }
//       } else if (error.request) {
//         // Request was made but no response received
//         setError("Network error. Please check your connection.");
//       } else {
//         // Error during request setup
//         setError("Error preparing cart update request.");
//       }
//     } finally {
//       setUpdateLoading(false);
//     }
//   };








//   const handleRemoveItem = async (dishId) => {
//     try {
//       setUpdateLoading(true);
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Please log in to remove items from your cart.");
//         return;
//       }

//       const response = await axios.delete(
//         `${backendurl}/api/cart/removeitem/${dishId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         // Update cart state with the updated cart from the response
//         setCart(response.data.cart);
//         setError(""); // Clear any previous errors
//       } else {
//         setError(response.data.message || "Failed to remove item from cart.");
//       }
//     } catch (error) {
//       console.error("Error removing item:", error.response?.data || error);
//       setError(error.response?.data?.message || "Error removing item from cart.");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleCheckout = () => {
//     navigate("/checkout");
//   };

//   const continueShopping = () => {
//     navigate("/dishes");
//   };

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
//     <Container className="cart-container mt-4 mb-5">
//       <h2 className="text-center mb-4">Your Shopping Cart 🛒</h2>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}

//       {cart.items && cart.items.length > 0 ? (
//         <>
//           <Card className="mb-4 cart-card">
//             <Card.Body>
//               <Table responsive className="cart-table">
//                 <thead>
//                   <tr>
//                     <th>Item</th>
//                     <th>Price</th>
//                     <th>Quantity</th>
//                     <th>Subtotal</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cart.items.map((item) => (
//                     <tr key={item.dishId}>
//                       <td className="item-details">
//                         {item.dish ? (
//                           <>
//                             <div className="d-flex align-items-center">
//                               {item.dish.imageUrl && (
//                                 <img 
//                                   src={item.dish.imageUrl} 
//                                   alt={item.dish.name}
//                                   className="cart-item-image me-3"
//                                   onError={(e) => { e.target.src = "/placeholder-dish.jpg"; }}
//                                 />
//                               )}
//                               <div>
//                                 <h5>{item.dish.name}</h5>
//                                 {item.dish.restaurantName && (
//                                   <p className="text-muted mb-0">From: {item.dish.restaurantName}</p>
//                                 )}
//                               </div>
//                             </div>
//                           </>
//                         ) : (
//                           <span>Unknown Item</span>
//                         )}
//                       </td>
//                       <td>₹{item.price.toFixed(2)}</td>
//                       <td>
//                         <div className="quantity-control">
//                           <Button 
//                             variant="outline-secondary" 
//                             size="sm"
//                             onClick={() => handleQuantityChange(item.dishId, Math.max(1, item.quantity - 1), item.price)}
//                             disabled={updateLoading}
//                           >
//                             -
//                           </Button>
//                           <Form.Control
//                             type="number"
//                             min="1"
//                             max="99"
//                             value={item.quantity}
//                             onChange={(e) => handleQuantityChange(item.dishId, e.target.value, item.price)}
//                             className="quantity-input"
//                             disabled={updateLoading}
//                           />
//                           <Button 
//                             variant="outline-secondary" 
//                             size="sm"
//                             onClick={() => handleQuantityChange(item.dishId, Math.min(99, item.quantity + 1), item.price)}
//                             disabled={updateLoading}
//                           >
//                             +
//                           </Button>
//                         </div>
//                       </td>
//                       <td>₹{(item.price * item.quantity).toFixed(2)}</td>
//                       <td>
//                         <Button 
//                           variant="danger" 
//                           size="sm"
//                           onClick={() => handleRemoveItem(item.dishId)}
//                           disabled={updateLoading}
//                         >
//                           Remove
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>

//           <Row className="justify-content-end">
//             <Col md={5} lg={4}>
//               <Card className="cart-summary">
//                 <Card.Body>
//                   <h4 className="mb-3">Order Summary</h4>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Subtotal:</span>
//                     <span>₹{cart.totalPrice.toFixed(2)}</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Tax:</span>
//                     <span>₹{(cart.totalPrice * 0.05).toFixed(2)}</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Delivery Fee:</span>
//                     <span>₹49.00</span>
//                   </div>
//                   <hr />
//                   <div className="d-flex justify-content-between fw-bold">
//                     <span>Total:</span>
//                     <span>₹{(cart.totalPrice + (cart.totalPrice * 0.05) + 49).toFixed(2)}</span>
//                   </div>
//                   <Button 
//                     variant="success" 
//                     className="w-100 mt-3"
//                     onClick={handleCheckout}
//                     disabled={updateLoading}
//                   >
//                     Proceed to Checkout
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
          
//           <div className="text-center mt-4">
//             <Button variant="outline-primary" onClick={continueShopping}>
//               Continue Shopping
//             </Button>
//           </div>
//         </>
//       ) : (
//         <div className="empty-cart text-center">
//           <div className="mb-4">
//             <i className="bi bi-cart-x empty-cart-icon"></i>
//             <h3 className="mt-3">Your cart is empty</h3>
//             <p className="text-muted">Looks like you haven't added any dishes to your cart yet.</p>
//           </div>
//           <Button variant="primary" onClick={continueShopping}>
//             Start Shopping
//           </Button>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default AddToCart;
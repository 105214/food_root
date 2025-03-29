import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './updatecart.css';

const UpdateCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/cart/getcart', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Ensure items array is correctly set
      setCartItems(response.data.cart?.items || []);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching cart items');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdate = async (foodId, newQuantity) => {
    if (!foodId || typeof foodId !== "string") {
        console.error("Invalid foodId:", foodId);
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        setIsLoading(true);
        // Try with the correct API endpoint format - this may need adjustment 
        // based on your backend implementation
        const response = await axios.put(
            'http://localhost:3001/api/cart/updatecart',
            { 
                foodId: foodId,
                quantity: newQuantity 
            },
            { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            }
        );

        setMessage(response.data.message || 'Cart updated successfully');
        fetchCartItems(); // Refresh cart after update
    } catch (error) {
        console.error("Error updating cart:", error);
        setMessage(error.response?.data?.message || 'Error updating cart');
        
        // Log detailed error information for debugging
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
            console.error("Response headers:", error.response.headers);
        }
    } finally {
        setIsLoading(false);
    }
};

  const incrementQuantity = (foodId, currentQuantity) => {
    handleUpdate(foodId, currentQuantity + 1);
  };

  const decrementQuantity = (foodId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleUpdate(foodId, currentQuantity - 1);
    }
  };

  return (
    <div className="container update-cart">
      <div className="card p-4">
        <h2 className="text-center">Your Cart</h2>
        {message && <div className="alert alert-info">{message}</div>}
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <ul className="list-group">
            {cartItems.map((item) => (
              <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.dishId.name}</h5>
                  <p>Price: ${(item.dishId.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="quantity-controls">
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => decrementQuantity(item.dishId._id, item.quantity)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => incrementQuantity(item.dishId._id, item.quantity)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UpdateCart;












// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './updatecart.css';

// const UpdateCart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const fetchCartItems = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:3001/api/cart/getcart', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
  
//       // Ensure items array is correctly set
//       setCartItems(response.data.cart?.items || []);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error fetching cart items');
//     }
//   };
  

// console.log(cartItems)
// const handleUpdate = async (foodId, newQuantity) => {
//     if (!foodId || typeof foodId !== "string") {
//         console.error("Invalid foodId:", foodId);
//         return;
//     }
    
//     const token = localStorage.getItem('token');
//     const requestData = { foodId, quantity: newQuantity }; // Correcting key name

//     console.log("Sending update request:", requestData);

//     try {
//         const response = await axios.put(
//             `http://localhost:3001/api/cart/updatecart`, // Remove dishId from URL
//             requestData, // Send foodId inside the request body
//             { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setMessage(response.data.message);
//         fetchCartItems(); // Refresh cart after update
//     } catch (error) {
//         console.error("Error response:", error.response?.data);
//         setMessage(error.response?.data?.message || 'Error updating cart');
//     }
// };
// const incrementQuantity = (foodId, currentQuantity) => {
//     handleUpdate(foodId, currentQuantity + 1);
// };

// const decrementQuantity = (foodId, currentQuantity) => {
//     if (currentQuantity > 1) {
//         handleUpdate(foodId, currentQuantity - 1);
//     }
// };






// //   const handleUpdate = async (dishId, newQuantity) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await axios.put(
// //         `http://localhost:3001/api/cart/updatecart/${dishId}`,
// //         { quantity: newQuantity },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setMessage(response.data.message);
// //       fetchCartItems(); // Refresh the cart after update
// //     } catch (error) {
// //       setMessage(error.response?.data?.message || 'Error updating cart');
// //     }
// //   };

  

//   return (
//     <div className="container update-cart">
//       <div className="card p-4">
//         <h2 className="text-center">Your Cart</h2>
//         {message && <div className="alert alert-info">{message}</div>}
//         {cartItems.length === 0 ? (
//           <p className="text-center">Your cart is empty.</p>
//         ) : (
//           <ul className="list-group">
//             {cartItems.map((item) => (
//               <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">

//                 <div>
//                   <h5>{item.dishId.name}</h5>
//                   <p>Price: ${item.dishId.price * item.quantity}</p>
//                 </div>
//                 <div>
//                 <button onClick={() => decrementQuantity(item.dishId._id, item.quantity)}> - </button>
// <span className="mx-2">{item.quantity}</span>
// <button onClick={() => incrementQuantity(item.dishId._id, item.quantity)}> + </button>


//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UpdateCart;

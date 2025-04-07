import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';

import './css/userorder.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Define the getAxiosInstance function
    const getAxiosInstance = () => {
        const token = localStorage.getItem('token');
        return axios.create({
            baseURL: 'http://localhost:3001/api',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    };
const makePayment = async (order) => {
    try {
        setIsLoading(true);
        
        // Make sure this matches exactly how your env var is defined
        const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        console.log("Stripe key exists:", !!stripeKey); // Debug log
        
        if (!stripeKey) {
            throw new Error("Stripe publishable key is not defined");
        }
        
        const stripe = await loadStripe(stripeKey);
        const axiosInstance = getAxiosInstance();

        // Ensure each item has a valid description before sending
        const products = order.items.map(item => ({
            dishName: item.dishName || item.name || "Food Item",
            description: item.description || "No description available", // Ensure this is never empty
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1
        }));
        
        console.log("Products being sent:", JSON.stringify(products, null, 2));

        const response = await axiosInstance.post("/payment/create-checkout-session", {
            products: products
        });

        if (!response.data || !response.data.sessionId) {
            throw new Error("No session ID returned from server");
        }

        const result = await stripe.redirectToCheckout({
            sessionId: response.data.sessionId,
        });
        
        if (result.error) {
            setMessage(`Payment error: ${result.error.message}`);
        }
    } catch (error) {
        console.error("Payment error:", error);
        let errorMessage = "Failed to process payment";
        
        // Extract the most helpful error message
        if (error.response) {
            errorMessage = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        setMessage(`Payment failed: ${errorMessage}`);
    } finally {
        setIsLoading(false);
    }
};
    



    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const axiosInstance = getAxiosInstance();
                const response = await axiosInstance.get('/order/getorder');
                
                if (response.data && response.data.orders && Array.isArray(response.data.orders) && response.data.orders.length > 0) {
                    setOrders(response.data.orders);
                } else {
                    setMessage("You have no orders.");
                }
            } catch (error) {
                console.error('Error fetching orders:', error.response ? error.response.data : error.message);
                setMessage(error.response?.data?.message || "Failed to load orders.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);
    
    const applyCoupon = async (orderId) => {
        try {
            setIsLoading(true);
            if (!coupon || !coupon.trim()) {
                setMessage("Please enter a coupon code");
                return;
            }
            
            const axiosInstance = getAxiosInstance();
    
            const response = await axiosInstance.post('/coupon/applycoupon', { 
                couponCode: coupon,
                orderId: orderId
            });
    
            // Update the message with success info
            setMessage(`Coupon applied successfully! You saved $${response.data.discountAmount}`);
            
            // Make sure to update the orders state with the new total
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, totalAmount: response.data.newTotal } : order
                )
            );
            
            // Reset the coupon field
            setCoupon('');
        } catch (error) {
            console.error('Error applying coupon:', error.response ? error.response.data : error.message);
            setMessage(error.response?.data?.message || "Failed to apply coupon");
        } finally {
            setIsLoading(false);
        }
    };
    
    const cancelOrder = async (orderId) => {
        try {
            setIsLoading(true);
            const axiosInstance = getAxiosInstance();
            
            await axiosInstance.delete(`/order/ordercancel/${orderId}`);
            setOrders(orders.filter(order => order._id !== orderId));
            setMessage("Order cancelled successfully");
        } catch (error) {
            console.error('Error cancelling order:', error);
            setMessage(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to display order items for debugging
    const renderOrderItems = (items) => {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return <p>No items in this order</p>;
        }
        
        return (
            <ul className="list-unstyled">
                {items.map((item, index) => (
                    <li key={index}>
                        {item.dishName || item.name || "Unknown item"} - 
                        Qty: {item.quantity || 1} x ${item.price || 0}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Container>
            <h2 className="my-4">My Orders</h2>
            {message && <Alert variant="info" onClose={() => setMessage(null)} dismissible>{message}</Alert>}
            <Button variant="primary" onClick={() => navigate('/cart')} className="mb-3">Go to Cart</Button>
            
            {isLoading ? (
                <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : orders.length > 0 ? (
                orders.map(order => (
                    <Card key={order._id} className="mb-3 p-3">
                        <Card.Body>
                            <Card.Title>Order ID: {order._id}</Card.Title>
                            <Card.Text>
                                <strong>Total Amount:</strong> ${order.totalAmount}<br/>
                                <strong>Status:</strong> {order.status}
                            </Card.Text>
                            {/* Show order items for clarity */}
                            <div className="mb-3">
                                <strong>Items:</strong>
                                {renderOrderItems(order.items)}
                            </div>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter coupon" 
                                value={coupon} 
                                onChange={(e) => setCoupon(e.target.value)} 
                                className="mb-2"
                            />
                            <div className="d-flex gap-2">
                                <Button variant="success" onClick={() => applyCoupon(order._id)}>Apply Coupon</Button>
                                {order.status !== 'cancelled' && (
                                    <Button variant="danger" onClick={() => cancelOrder(order._id)}>Cancel Order</Button>
                                )}
                                {order.status !== 'paid' && order.status !== 'cancelled' && (
                                    <Button variant="primary" onClick={() => makePayment(order)}>Pay Now</Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <Alert variant="info">No orders found</Alert>
            )}
        </Container>
    );
};

export default UserOrders;


























// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { loadStripe } from "@stripe/stripe-js";
// import { Container, Card, Button, Form, Alert } from 'react-bootstrap';

// import './css/Userorder.css';

// const UserOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const [coupon, setCoupon] = useState('');
//     const [message, setMessage] = useState(null);
//     const navigate = useNavigate();


//     const makePayment=async()=>{
//         try{
//             const stripe=await loadStripe(import.meta.env.Vite_Stripe_Publishable_key)

//             const session = await axiosInstance({
//                 url:"/payment/create-checkout-session",
//                 method: "POST",
//                 data:{products:dishData?.dishes},
//             })

//             console.log(session,"=====session")
//             const result =stripe.redirectToCheckout({
//                 sessionId:session.data.sessionId,
//             })
//         } catch (error){
//             console.log(error,"payment error");
            
//         }
//     }


    
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 // Create an axios instance with proper configuration 
//                 const axiosInstance = axios.create({
//                     baseURL: 'http://localhost:3001/api',
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
                
//                 const response = await axiosInstance.get('/order/getorder');
                
//                 if (response.data.orders && response.data.orders.length > 0) {
//                     setOrders(response.data.orders);
//                 } else {
//                     setMessage("You have no orders.");
//                 }
//             } catch (error) {
//                 console.error('Error fetching orders:', error.response ? error.response.data : error.message);
//                 setMessage(error.response?.data?.message || "Failed to load orders.");
//             }
//         };
//         fetchOrders();
//     }, []);
    
    

//     const applyCoupon = async (orderId) => {
//         try {
//             const token = localStorage.getItem('token');
//             const axiosInstance = axios.create({
//                 baseURL: 'http://localhost:3001/api',
//                 headers: { Authorization: `Bearer ${token}` }
//             });
    
//             const response = await axiosInstance.post('/coupon/applycoupon', { 
//                 couponCode: coupon,
//                 orderId: orderId
//             });
    
//             // Update the message with success info
//             setMessage(`Coupon applied successfully! You saved $${response.data.discountAmount}`);
            
//             // Make sure to update the orders state with the new total
//             setOrders(prevOrders =>
//                 prevOrders.map(order =>
//                     order._id === orderId ? { ...order, totalAmount: response.data.newTotal } : order
//                 )
//             );
            
//             // Reset the coupon field
//             setCoupon('');
//         } catch (error) {
//             console.error('Error applying coupon:', error.response ? error.response.data : error.message);
//             setMessage(error.response?.data?.message || "Failed to apply coupon");
//         }
//     };
    
// // In UserOrders.js
// const cancelOrder = async (orderId) => {
//     try {
//         const token = localStorage.getItem('token');
//         const axiosInstance = axios.create({
//             baseURL: 'http://localhost:3001/api',
//             headers: { Authorization: `Bearer ${token}` }
//         });
        
//         await axiosInstance.delete(`/order/ordercancel/${orderId}`);
//         setOrders(orders.filter(order => order._id !== orderId));
//         setMessage("Order cancelled successfully");
//     } catch (error) {
//         console.error('Error cancelling order:', error);
//         setMessage(error.response?.data?.message || "Failed to cancel order");
//     }
// };

//     return (
//         <Container>
//             <h2 className="my-4">My Orders</h2>
//             {message && <Alert variant="success">{message}</Alert>}
//             <Button variant="primary" onClick={() => navigate('/cart')} className="mb-3">Go to Cart</Button>
//             {orders.map(order => (
//                 <Card key={order._id} className="mb-3 p-3">
//                     <Card.Body>
//                         <Card.Title>Order ID: {order._id}</Card.Title>
//                         <Card.Text>
//                             <strong>Total Amount:</strong> ${order.totalAmount}<br/>
//                             <strong>Status:</strong> {order.status}
//                         </Card.Text>
//                         <Form.Control 
//                             type="text" 
//                             placeholder="Enter coupon" 
//                             value={coupon} 
//                             onChange={(e) => setCoupon(e.target.value)} 
//                             className="mb-2"
//                         />
//                         <Button variant="success" onClick={() => applyCoupon(order._id)} className="me-2">Apply Coupon</Button>
//                         <Button variant="danger" onClick={() => cancelOrder(order._id)}>Cancel Order</Button>
//                     </Card.Body>
//                     <button className='btn btn-success' onClick={makePayment}>Pay</button>
//                 </Card>
//             ))}
//         </Container>
//     );
// };

// export default UserOrders;

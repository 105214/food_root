import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./order.css";
const backendurl=import.meta.env.VITE_BACKEND_URL




const Order = () => {
  const [orders, setOrders] = useState([]);
  const userId = "your-user-id"; // Replace with dynamic user ID from auth

  useEffect(() => {
    axios
      .get(`${backendurl}/orders/getorders`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => console.error("Error fetching orders", error));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Your Orders</h2>
      <div className="row">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="col-md-6 col-lg-4" key={order._id}>
              <div className="order-card p-3 mb-3 shadow">
                <h5>Order ID: {order._id}</h5>
                <p><strong>Total:</strong> ${order.totalAmount}</p>
                <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
                <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
                <h6>Items:</h6>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.quantity}x {item.dishItem.name} - ${item.price}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Order;

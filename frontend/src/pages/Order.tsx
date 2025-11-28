import { Link } from "react-router-dom";
import { useOrder } from "../context/hooks/Order.Hook"
import { useEffect } from "react";


const Order = () => {
  const { loading, orders, viewOrders} = useOrder();
  console.log("orderpage",orders);
  useEffect(() => {
    viewOrders();
  },
   // eslint-disable-next-line react-hooks/exhaustive-deps
   [])
  
  return (
    <div>
      <div>
        <h1>All Order's</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 mb-4">
              <h2>Order ID: {order._id}</h2>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p>Status: {order.status}</p>
              <Link to={`/orderDetails/${order._id}`}>View Details</Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Order

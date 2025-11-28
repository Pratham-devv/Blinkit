import { useEffect, useState } from "react";
import { useOrder } from "../context/hooks/Order.Hook";


const OrderStatus = () => {
  const { viewOrderDetails, loading } = useOrder();
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const loadOrder = async () => {
      const orderId = localStorage.getItem("orderId");
      console.log("Stored Order ID:", orderId);

      if (!orderId) return;

      const data = await viewOrderDetails(orderId);
      console.log("Fetched Order Details:", data);

      setDetails(data);
    };

    loadOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (!details) {
    return <p>No order details found.</p>;
  }

  return (
    <div>
      <h1>Order Successful!</h1>

      <h2>Order ID: {details._id}</h2>
      <p>Total Amount: ₹{details.totalAmount}</p>
      <p>Status: {details.status}</p>

      <h3>Items:</h3>
      <ul>
        {details.items.map((item: any, index: number) => {
          const product = item.product; // backend sends populated "product"

          return (
            <li key={index} className="border p-4 mb-4">
              <p>{product?.title}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{product?.price}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderStatus;

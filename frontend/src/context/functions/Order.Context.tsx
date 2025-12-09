import { createContext, useState, useEffect,  } from "react";
import api from "../../api/axiosInstance";

import type { OrderContextType, Order , PlaceOrderInput} from "../../types/Order.types";
import axios from "axios";
import { useAuth } from "../hooks/Auth.Hook";

const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.message ?? "An error occurred";
  }
  if (err instanceof Error) return err.message;
  return "An error occurred";
};

const OrderContext = createContext<OrderContextType | null>(null);


export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useAuth()?.token || null;

  
  const viewOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching orders:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };


  const placeOrder = async (orderData: PlaceOrderInput) => {
    if (!token) {
      setError("User not authenticated");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/orders/placeOrder", orderData);
      console.log("Order placed:", res.data);
      console.log("Order ID:", res.data.order._id);
      localStorage.setItem("orderId", res.data.order._id);
      const orderDetail = await viewOrderDetails(res.data.order._id);
      console.log("Fetched Order Details:", orderDetail);
      setError(null);
      return orderDetail || null;
    } catch (err: unknown) {
      console.error("Error placing order:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };


  const viewOrderDetails = async(orderId: string): Promise<Order | null> => {
    if (!token) return null;
    try {
      setLoading(true);
      const res = await api.get(`/orders/${orderId}`);
      console.log("Fetched Order Detailsss:", res.data);
      return res.data;
    } catch (err: unknown) {
      console.error("Error fetching order details:", err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  
  const cancelOrder = async (orderId: string) => {
    if (!token) return;
    try {
      setLoading(true);
      await api.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Order cancelled:", orderId);
      
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err: unknown) {
      console.error("Error cancelling order:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (token) 
        viewOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        viewOrders,
        viewOrderDetails,
        cancelOrder,
        loading,
        error,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;

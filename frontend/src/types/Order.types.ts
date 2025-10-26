import type { CartItem } from "./Cart.types";

export interface Order {
  _id: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending'| 'shipped'| 'delivered'| 'cancelled';
  createdAt: string;
}


export interface PlaceOrderInput {
  items: CartItem[];
  totalAmount: number;
  shippingAddress?: string;
  paymentMethod?: 'card' | 'cash' | 'wallet';
  
}

export interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: PlaceOrderInput) => Promise<void>; 
  viewOrders: () => Promise<void>;
  viewOrderDetails: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}
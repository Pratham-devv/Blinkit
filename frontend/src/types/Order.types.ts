import type { Product } from './Product.types';

export interface OrderItem{
  products: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending'| 'shipped'| 'delivered'| 'cancelled';
  createdAt: string;
}


export interface PlaceOrderInput {
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: string;
  paymentMethod?: 'card' | 'cash' | 'wallet';
  
}

export interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: PlaceOrderInput) => Promise<Order | null | undefined>; 
  viewOrders: () => Promise<void>;
  viewOrderDetails: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}
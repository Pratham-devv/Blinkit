import type { CartItem } from "./Cart.types";

export interface Order{
    _id: string;
    items: CartItem[];
    totalPrice: number;
    status: 'pending'| 'shipped'| 'delivered'| 'cancelled';
    
}
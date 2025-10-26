import type { Product } from "./Product.types";

export interface CartItem{
    products: Product;
    quantity: number;
}

export interface CartContextType{
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number)=> void;
    removeFromCart: (productId: string)=> void;
    clearCart: ()=> void;
    viewCart: ()=> void;
}
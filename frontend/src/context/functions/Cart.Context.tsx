import { createContext, useEffect, useState } from "react";
import type { CartContextType, CartItem } from "../../types/Cart.types";


const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({children})=>{
    const [cartItems, setCartItems] = useState<CartItem[]>(
        localStorage.getItem("cartItems")? JSON.parse(localStorage.getItem("cartItems")! as string): []
    );

    useEffect(()=>{
        if(!cartItems){
            viewCart();
        };
    },[]);

    const addToCart = async(productId:string, quantity=1)=>{
        const updatedCart= {...cartItems, items: [...(cartItems?cartItems ||[]), {products: productId, quantity}]};




    const removeFromcart = (productId: string)=>{
        setCartItems(prevItems=> prevItems.filter(item=> item.products._id !== productId));
    };

    const clearCart = ()=>{
        setCartItems([]);
    };
    const viewCart = ()=>{
        // This function can be expanded to fetch cart details from backend if needed
        return cartItems;
    };

    return (
        <CartContext.Provider value={{cartItems, addToCart, removeFromcart, clearCart, viewCart}}>
            {children}
        </CartContext.Provider>
    );
}
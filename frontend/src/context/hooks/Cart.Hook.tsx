import { useContext } from "react";
import {CartContext} from "../functions/Cart.Context";

export const useCart = ()=>{
    const context =  useContext(CartContext);
    if(!context){
        throw new Error("useCart must be used within an CartProvider");
    }   
    return context;  
}; 
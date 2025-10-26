import { useContext } from "react";
import ProductContext from "../functions/Product.Context";

export const useProd = ()=>{
    const context =  useContext(ProductContext);
    if(!context){
        throw new Error("useProd must be used within an ProdProvider");
    }   
    return context;
}; 
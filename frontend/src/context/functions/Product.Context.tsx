import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Product, ProductContextType } from "../../types/Product.types";


const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider: React.FC<{children: ReactNode}> = ({children})=>{
    const[products, setProducts] = useState<Product[]>([]);
    
    useEffect(()=>{
        if(products.length === 0){
            getProducts();
        }
    },[]);

    const getProducts = async ()=>{
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setProducts(data);
    };

    const viewProductById = async (productId: string): Promise<Product | null>=>{
        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if(res.ok){
            const data = await res.json();
            return data;
        }
        return null;
    };

    const viewProductByCategory = async (category: string): Promise<Product[]>=>{
        const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        if(res.ok){
            const data = await res.json();
            return data;
        }
        return [];
    };
    const searchProducts = async (query: string): Promise<Product[]>=>{
        const allRes = await fetch('https://fakestoreapi.com/products');
        if(allRes.ok){
            const allProducts: Product[] = await allRes.json();
            return allProducts.filter(product=> product.title.toLowerCase().includes(query.toLowerCase()));
        }
        return [];
    };
    return (
        <ProductContext.Provider value={{products, getProducts, viewProductById, viewProductByCategory, searchProducts}}>
            {children}
        </ProductContext.Provider>
    );
}
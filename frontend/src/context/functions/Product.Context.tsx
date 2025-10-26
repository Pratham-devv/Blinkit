import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Product, ProductContextType } from "../../types/Product.types";
import api from "../../api/axiosInstance";


const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider: React.FC<{children: ReactNode}> = ({children})=>{
    const[products, setProducts] = useState<Product[]>([]);
    
    useEffect(()=>{
        getProducts();
    }, []);

    const getProducts = async ()=>{
        const res = await api.get('/products');
        setProducts(res.data);
        console.log(res.data);
        return res.data;
    };

    const viewProductById = async (productId: string): Promise<Product | null>=>{
        const res = await api.get(`/products/${productId}`);
        if(res.status === 200){
            return res.data;
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
export default ProductContext;
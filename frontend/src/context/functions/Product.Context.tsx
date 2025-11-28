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
            console.log(res.data);
            return res.data;
            
        }
        return null;
    };

    const viewProductByCategory = async (category: string): Promise<Product[]>=>{
        const res = await api.get(`/products/${category}`);
        if(res.status === 200){
            const data: Product[] = res.data;
            return data;
        }
        return [];
    };
    const searchProducts = async (query: string): Promise<Product[]>=>{
        const allRes = await api.get(`products/search?q=${query}`);
        if(allRes.status === 200){
            const allProducts: Product[] = await allRes.data;
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
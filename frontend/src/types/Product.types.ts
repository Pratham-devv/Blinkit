export interface Product{
    _id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: string;
}   

export interface ProductContextType{
    products: Product[];
    getProducts: ()=> Promise<void>;
    viewProductById: (productId: string)=> Promise<Product | null>;
    viewProductByCategory: (category: string)=> Promise<Product[]>;
    searchProducts: (query: string)=> Promise<Product[]> ;
}
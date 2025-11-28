import { useParams } from "react-router-dom";
import { useProd } from "../context/hooks/Products.Hook";
import { useEffect, useState } from "react";
import type { Product } from "../types/Product.types";


const ProductDetails = () => {
  const {viewProductById} = useProd();
  const {productId} = useParams();
  
  console.log("product id is",productId);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<Product>(null!);
  useEffect(()=>{
    const fetchProduct = async ()=>{
    if(productId){
     
      const product = await viewProductById(productId!);
      setProductDetails(product!);
      console.log("product is",product);
    }
  };
  fetchProduct();
  setLoading(false);
  }, [productId, viewProductById]);

  if(loading){
    return <p>Loading product details...</p>;
  }

  
  return (
    <div>
      Product Details Page
      <div>
        <h2>{productDetails?.title}</h2>
        <img src={productDetails?.image} width="200" />
        <p>Price: ${productDetails?.price}</p>
        <p>Description: {productDetails?.description}</p>
        <p>Category: {productDetails?.category}</p>
        <p>Rating: {productDetails?.rating}</p>
      </div>
      
    </div>
  )
}

export default ProductDetails;


import { useProd } from "../context/hooks/Products.Hook";
import {useCart} from "../context/hooks/Cart.Hook";

const Home = () => {
  const {products} = useProd();
  const {addToCart} = useCart();
  
  
  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <h2>Categories</h2>
        <div className="grid grid-cols-3 gap-4">
          {products.map(product => product.category).filter((value, index, self) => self.indexOf(value) === index).map((category, index) => (
            <div key={index} className="border flex justify-center items-center p-4">{category}</div>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {products.map((product)=>(
          <div key={product._id} className="border p-4">
            <h2 className="font-bold">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <img src={product.image} alt={product.title} width="100" />
            <p>Rating: {product.rating}</p>
            <button 
            type="button"
            onClick={()=> addToCart(product,1)} > Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  )
} 

export default Home

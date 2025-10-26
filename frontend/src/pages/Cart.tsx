import { useNavigate } from "react-router-dom";
import { useCart } from "../context/hooks/Cart.Hook";
import { useOrder } from "../context/hooks/Order.Hook";




const Cart = () => {
  const {cartItems, addToCart, removeFromCart} = useCart();
  const {placeOrder} = useOrder();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
   const handlePlaceOrder = ()=>{
    if(!token){
        navigate("/login");
        return;
    }
    placeOrder({
      items: cartItems,
      totalAmount: cartItems.reduce((acc, item) => acc + item.products.price * item.quantity, 0),
    });
    navigate("/order");
    
   }


  return (
    <div>
      Cart
      <div>
        {cartItems.map(item=>(
          <div key={item.products._id} className="border p-4 mb-4">
            <h2 className="font-bold">{item.products.title}</h2>
            <div><button onClick={()=>removeFromCart(item.products._id)}>-</button> {item.quantity} <button onClick={()=>addToCart(item.products,1)}>+</button></div>
            <p>Price: ${item.products.price}</p>
          </div>
        ))}

        
      </div>
      <button
      onClick={handlePlaceOrder}
      >Place Order</button>
    </div>
  )
}

export default Cart;

import { useNavigate } from "react-router-dom";
import { useCart } from "../context/hooks/Cart.Hook";
import { useOrder } from "../context/hooks/Order.Hook";




const Cart = () => {
  const {cartItems, addToCart, removeFromCart} = useCart();
  console.log("here are the",cartItems)
  const {placeOrder} = useOrder();
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 
  const cartArray = Array.isArray(cartItems)
  ? cartItems
  : cartItems?.items || [];
   const handlePlaceOrder = async ()=>{
    if(!token){
      
        navigate(`/login`);
        return;
    }
    const order = await placeOrder({ 
      items: cartItems,
      totalAmount: cartItems.reduce((acc, item) => acc + item.products.price * item.quantity, 0),
    });
    console.log("order is",order);

    const orderId = order!._id; 
    console.log(orderId); 
    if(order&& orderId){
      navigate(`/order/success/${orderId}`);
      window.location.reload();
    }
    
    }


  return (
    <div>
      Cart
      <div>
    {cartArray.length === 0 ? (
      <p>Your cart is empty 🛒</p>
    ) : (
      cartArray.map((item, index) => {
        // handle both array-based and object-based product structure
        const product = Array.isArray(item.products)
          ? item.products[0]
          : item.products;

        return (
          <div key={product?._id || index} className="border p-2 mb-3">
            <h2>{product?.title || "Unnamed Product"}</h2>
            <p>Price: ₹{product?.price ?? "N/A"}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => removeFromCart(product?._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => addToCart(product, 1)}>+</button>
            </div>
          </div>
        );
      })
    )}
  </div>
      <button
      onClick={handlePlaceOrder}
      >Place Order</button>
    </div>
  )
}

export default Cart;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/hooks/Cart.Hook";
import { useOrder } from "../context/hooks/Order.Hook";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/hooks/Auth.Hook";


const Cart = () => {
  const { cartItems, addToCart, removeFromCart, removeItemCompletely } = useCart();
  const { placeOrder } = useOrder();
  const navigate = useNavigate();
  const { user} =  useAuth();


  const cartArray = Array.isArray(cartItems)
    ? cartItems
    : (cartItems as any)?.items || [];

  const totalAmount = cartArray.reduce(
    
    (acc: any, item: any) => acc + (item.products?.price || 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate(`/login`);
      return;
    }
    const order = await placeOrder({
      items: cartItems,
      totalAmount: totalAmount,
    });

    const orderId = order!._id;
    if (order && orderId) {
      navigate(`/order/success/${orderId}`);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">My Cart</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {cartArray.length} {cartArray.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {cartArray.length === 0 ? (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-6 sm:p-8 rounded-full mb-4 sm:mb-6">
              <ShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center px-4">
              Your cart is empty
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-center px-4">
              Add items to get started with your order
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartArray.map((item: any, index: number) => {
                const product = Array.isArray(item.products)
                  ? item.products[0]
                  : item.products;

                return (
                  <div
                    key={product?._id || index}
                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {product?.title || "Unnamed Product"}
                        </h3>
                        <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2 sm:mb-3">
                          ₹{product?.price ?? "N/A"}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                          <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/30 rounded-lg sm:rounded-xl border-2 border-emerald-200 dark:border-emerald-700">
                            <button
                              onClick={() => removeFromCart(product?._id)}
                              className="p-1.5 sm:p-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-l-lg sm:rounded-l-xl transition-colors"
                            >
                              <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                            </button>
                            <span className="px-3 sm:px-6 py-1.5 sm:py-2 font-bold text-gray-900 dark:text-white min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="p-1.5 sm:p-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-r-lg sm:rounded-r-xl transition-colors"
                            >
                              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItemCompletely(product?._id)}
                            className="ml-auto p-1.5 sm:p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg sm:rounded-xl transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 mt-4 lg:mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                    <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-emerald-600 dark:text-emerald-400">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  Place Order
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 sm:mt-4 px-2">
                  By placing this order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
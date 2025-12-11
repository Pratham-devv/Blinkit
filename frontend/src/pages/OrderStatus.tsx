/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useOrder } from "../context/hooks/Order.Hook";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Home,
  Clock,
  MapPin,
  ShoppingBag,
  Loader2,
  Sparkles,
} from "lucide-react";

const OrderStatus = () => {
  const { viewOrderDetails, loading } = useOrder();
  const [details, setDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      const orderId = localStorage.getItem("orderId");
      if (!orderId) return;

      const data = await viewOrderDetails(orderId);
      setDetails(data);
    };

    loadOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===================== LOADING =====================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-14 h-14 animate-spin text-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
            Loading your order…
          </p>
        </div>
      </div>
    );
  }

  // ===================== ORDER NOT FOUND =====================
  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <Package className="w-20 h-20 text-gray-400 dark:text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
            We couldn’t find details for this order.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ===================== MAIN PAGE =====================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="max-w-3xl mx-auto px-4">

        {/* Success Header */}
        <div className="text-center py-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
            <div className="relative bg-emerald-500 rounded-full p-5 shadow-md">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-6 flex justify-center items-center gap-2">
            Order Successful! <Sparkles className="w-7 h-7 text-emerald-500" />
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Your order is being prepared for delivery.
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Order #{details._id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Delivery Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between flex-wrap gap-6">

            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Estimated Delivery</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">10 minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Delivering to</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">
                  Home Address
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8">

          {/* Top Section */}
          <div className="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-700 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Order Status</p>
              <p className="text-gray-900 dark:text-white font-bold capitalize mt-1">
                {details.status}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{details.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">
                Items Ordered
              </h3>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({details.items.length})
              </span>
            </div>

            <div className="space-y-3">
              {details.items.map((item: any, index: number) => {
                const product = item.product;

                return (
                  <div
                    key={index}
                    className="
                      flex items-center justify-between
                      bg-gray-50 dark:bg-gray-700
                      p-4 rounded-xl border border-gray-200 dark:border-gray-600
                    "
                  >
                    {/* Image + Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <Package className="w-7 h-7 text-emerald-600 dark:text-emerald-300" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-gray-900 dark:text-white font-medium text-sm truncate max-w-[160px]">
                          {product?.title}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                          Qty {item.quantity} • ₹{product?.price}
                        </p>
                      </div>
                    </div>

                    {/* Total price */}
                    <p className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      ₹{(product?.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order ID */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Order ID</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white mt-1 break-all">
              {details._id}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => navigate("/order")}
            className="
              w-full py-3 rounded-xl border-2 border-emerald-500
              text-emerald-600 dark:text-emerald-400 dark:border-emerald-400
              bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-gray-700
              font-semibold transition-all
            "
          >
            View All Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="
              w-full py-3 rounded-xl
              bg-emerald-500 hover:bg-emerald-600
              text-white font-semibold
              transition-all shadow-md
              flex items-center justify-center gap-2
            "
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
            🎉 Thank you for choosing Grocer!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Your order is being prepared with care.
          </p>
        </div>

      </div>
    </div>
  );
};

export default OrderStatus;

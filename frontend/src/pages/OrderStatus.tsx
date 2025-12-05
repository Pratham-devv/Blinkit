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
  ArrowRight
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600">
            Processing your order...
          </p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full mb-6 inline-block">
            <Package className="w-24 h-24 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order not found
          </h2>
          <p className="text-gray-500 mb-8">
            We couldn't find your order details.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
            <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-full shadow-2xl">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            Order Successful!
            <Sparkles className="w-8 h-8 text-emerald-500" />
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your order! We're preparing it for delivery.
          </p>
          <p className="text-sm text-gray-500">
            Order #{details._id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Delivery Info Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-emerald-50">Estimated Delivery</p>
                <p className="font-bold text-lg">10 Minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-emerald-50">Delivering to</p>
                <p className="font-bold text-lg">Home Address</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Status</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold text-gray-900 capitalize">
                  {details.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-emerald-600">
                ₹{details.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
              <span className="text-sm text-gray-500">
                ({details.items.length} {details.items.length === 1 ? "item" : "items"})
              </span>
            </div>

            <div className="space-y-3">
              {details.items.map((item: any, index: number) => {
                const product = item.product;

                return (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-emerald-600" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {product?.title || "Product"}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">
                          ₹{product?.price || 0}
                        </span>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{((product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order ID */}
          <div className="pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="font-mono text-sm text-gray-900 break-all">
                {details._id}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate("/order")}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md"
          >
            <Package className="w-5 h-5" />
            View All Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Thank You Message */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 text-center">
          <h3 className="font-bold text-gray-900 mb-2 text-lg">
            🎉 Thank you for choosing Grocer!
          </h3>
          <p className="text-gray-600 text-sm">
            Your order is being prepared with care. Track your delivery in real-time from your orders page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
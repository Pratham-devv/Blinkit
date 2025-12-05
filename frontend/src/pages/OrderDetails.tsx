import { useEffect, useState } from "react";
import { useOrder } from "../context/hooks/Order.Hook";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  Loader2,
  Receipt
} from "lucide-react";

const OrderDetails = () => {
  const { viewOrderDetails, loading } = useOrder();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [details, setDetails] = useState<any>(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;

      const data = await viewOrderDetails(orderId);
      setDetails(data);
    };

    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "delivered" || statusLower === "completed") {
      return "bg-green-100 text-green-700 border-green-200";
    } else if (statusLower === "cancelled" || statusLower === "failed") {
      return "bg-red-100 text-red-700 border-red-200";
    } else if (statusLower === "processing" || statusLower === "pending") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    } else if (statusLower === "shipped" || statusLower === "out for delivery") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "delivered" || statusLower === "completed") {
      return <CheckCircle className="w-6 h-6" />;
    } else if (statusLower === "cancelled" || statusLower === "failed") {
      return <XCircle className="w-6 h-6" />;
    } else if (statusLower === "shipped" || statusLower === "out for delivery") {
      return <Truck className="w-6 h-6" />;
    }
    return <Clock className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full mb-6 inline-block">
            <Package className="w-24 h-24 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order not found
          </h2>
          <p className="text-gray-500 mb-8">
            We couldn't find the order you're looking for.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const itemsTotal = details.items.reduce(
    (acc: number, item: OrderItem) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return(
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                <p className="text-sm text-gray-500">
                  #{details._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${getStatusColor(details.status).replace('text-', 'bg-').replace('bg-', 'bg-')}`}>
                    {getStatusIcon(details.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Status</p>
                    <h3 className="text-2xl font-bold text-gray-900 capitalize">
                      {details.status}
                    </h3>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl border-2 ${getStatusColor(details.status)}`}>
                  <span className="font-semibold capitalize">{details.status}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                <span className="ml-2 text-sm text-gray-500">
                  ({details.items.length} {details.items.length === 1 ? "item" : "items"})
                </span>
              </div>

              <div className="space-y-4">
                {details.items.map((item: OrderI, index: number) => {
                  const product = item.product;

                  return (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-emerald-600" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                          {product?.title || "Product"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Quantity: {item.quantity}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-600">
                            ₹{product?.price || 0}
                          </span>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{((product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">{details._id}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{itemsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold">₹0.00</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">
                      ₹{details.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      Home Address
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">
                      Cash on Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about your order? We're here to help!
              </p>
              <button className="w-full bg-white text-emerald-600 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors border-2 border-emerald-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
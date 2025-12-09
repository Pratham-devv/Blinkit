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
  Receipt,
} from "lucide-react";


const OrderDetails = () => {
  const { viewOrderDetails, loading } = useOrder();
  const [details, setDetails] = useState<any>(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;
    viewOrderDetails(orderId).then((res) => setDetails(res));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========== STATUS UI ==========

  const STATUS_STYLES: Record<string, string> = {
    delivered:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    completed:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",

    cancelled:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    failed:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",

    processing:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    pending:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",

    shipped:
      "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    "out for delivery":
      "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  };

  const getStatusColor = (status: string) =>
    STATUS_STYLES[status.toLowerCase()] ||
    "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (["delivered", "completed"].includes(s)) return <CheckCircle className="w-6 h-6" />;
    if (["cancelled", "failed"].includes(s)) return <XCircle className="w-6 h-6" />;
    if (["shipped", "out for delivery"].includes(s)) return <Truck className="w-6 h-6" />;
    return <Clock className="w-6 h-6" />;
  };

  // ========== LOADING UI ==========

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
        <Package className="w-20 h-20 text-gray-400 dark:text-gray-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
          We couldn't find your order details.
        </p>

        <button
          onClick={() => navigate("/order")}
          className="mt-6 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
        >
          View All Orders
        </button>
      </div>
    );
  }

  // ========== PRICE TOTAL ==========

  const itemsTotal = details.items.reduce(
    (acc: number, item: any) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-full lg:max-w-6xl mx-auto px-3 sm:px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/order")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Receipt className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Order Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                #{details._id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-full lg:max-w-6xl mx-auto px-3 sm:px-4 py-6 space-y-6">

        {/* STATUS CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${getStatusColor(details.status)}`}>
                {getStatusIcon(details.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                <h3 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
                  {details.status}
                </h3>
              </div>
            </div>

            <span
              className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(
                details.status
              )}`}
            >
              {details.status}
            </span>
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* ITEMS CARD */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 w-full">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Items</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({details.items.length})
                </span>
              </div>

              <div className="space-y-4">
                {details.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl w-full"
                  >
                    {/* Product Icon */}
                    <div className="min-w-16 min-h-16 w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center">
                      <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-300" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg ">
                        {item.product?.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Qty: {item.quantity} •{" "}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{item.product?.price}
                        </span>
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{(item.product?.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Item Total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="space-y-6 w-full">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 w-full lg:sticky lg:top-24">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Summary
              </h2>

              <div className="space-y-4">

                {/* Order ID */}
                <div className="flex items-start gap-3">
                  <Calendar className="text-emerald-600 w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Order ID</p>
                    <p className="font-medium text-gray-900 dark:text-white break-all">
                      {details._id}
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{itemsTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 dark:text-gray-400 mt-2">
                    <span>Delivery</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      FREE
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ₹{details.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Home Address
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Cash on Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 w-full">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Our support team is here for you 24/7.
              </p>

              <button className="mt-4 w-full py-3 rounded-xl bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 font-semibold border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition">
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

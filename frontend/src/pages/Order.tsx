import { Link } from "react-router-dom";
import { useOrder } from "../context/hooks/Order.Hook";
import { useEffect } from "react";
import {
  Package,
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  Loader2,
} from "lucide-react";

const Order = () => {
  const { loading, orders, viewOrders } = useOrder();

  useEffect(() => {
    viewOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (["delivered", "completed"].includes(s))
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";

    if (["cancelled", "failed"].includes(s))
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";

    if (["processing", "pending"].includes(s))
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";

    if (["shipped", "out for delivery"].includes(s))
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";

    return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (["delivered", "completed"].includes(s)) return <CheckCircle className="w-5 h-5" />;
    if (["cancelled", "failed"].includes(s)) return <XCircle className="w-5 h-5" />;
    if (["shipped", "out for delivery"].includes(s)) return <Truck className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {!loading && orders.length > 0 && (
                    <>
                      {orders.length} {orders.length === 1 ? "order" : "orders"}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300">
              Loading your orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-8 rounded-full mb-6">
              <ShoppingBag className="w-24 h-24 text-gray-400 dark:text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Orders List
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order._id} to={`/orderDetails/${order._id}`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all p-5 sm:p-6 border border-gray-100 dark:border-gray-700 group-hover:border-emerald-300">
                  
                  {/* Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                    {/* Left Section */}
                    <div className="flex items-start gap-4 flex-1">

                      {/* Icon */}
                      <div className="min-w-[3.5rem] min-h-[3.5rem] bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="w-7 h-7 text-emerald-600 dark:text-emerald-300" />
                      </div>

                      {/* Text Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400 break-all mb-3">
                          Order ID: {order._id}
                        </p>

                        {/* Status Badge */}
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount + Arrow */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total Amount
                        </p>
                      </div>

                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900 transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:text-gray-300 dark:group-hover:text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Footer Text */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to view order details
                      </p>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;

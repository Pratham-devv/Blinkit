import { useProd } from "../context/hooks/Products.Hook";
import { useCart } from "../context/hooks/Cart.Hook";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Star, 
  Plus, 
  Search, 
  MapPin, 
  Clock,
  TrendingUp,
  Sparkles
} from "lucide-react";

const Home = () => {
  const { products } = useProd();
  const { addToCart, cartItems } = useCart();

  // Get unique categories
  const categories = products
    .map((product) => product.category)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Get cart quantity of a product
  const getQuantity = (productId: string) => {
    const item = cartItems.find((c) => c.products._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-1.5 sm:p-2 rounded-xl">
                <ShoppingCart className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Grocer
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Fresh in minutes</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Deliver to Home</span>
              </div>
              <Link
                to="/cart"
                className="relative p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <Link to="/search" className="relative block">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search for products..."
              readOnly
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
            />
          </Link>
        </div>
      </header>

      {/* Delivery Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Delivery in 10 minutes</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Categories Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/categories"
                className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-emerald-500 dark:border-gray-700 dark:hover:border-emerald-500 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl sm:text-2xl">🛒</span>
                </div>
                <p className="text-center font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {category}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">All Products</h2>
            <span className="ml-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ({products.length} items)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => {
              const quantity = getQuantity(product._id);

              return (
                <div
                  key={product._id}
                  className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Product Image */}
                  <Link to={`/productDetails/${product._id}`} className="block">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-2.5 sm:p-4">
                    <Link to={`/productDetails/${product._id}`}>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors min-h-[2.5rem] sm:min-h-[3rem]">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <div>
                        <p className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{product.price}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">MRP incl. taxes</p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">

                      {/* View Button */}
                      <Link
                        to={`/productDetails/${product._id}`}
                        className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2.5 border-2 border-emerald-500 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-lg sm:rounded-xl font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors text-center text-xs sm:text-sm"
                      >
                        View
                      </Link>

                      {/* Add / Stepper */}
                      {quantity === 0 ? (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-2 sm:px-4 py-1.5 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2.5 bg-emerald-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold">

                          <button
                            onClick={() => addToCart(product, -1)}
                            className="px-2"
                          >
                            -
                          </button>

                          <span className="px-2">{quantity}</span>

                          <button
                            onClick={() => addToCart(product, 1)}
                            className="px-2"
                          >
                            +
                          </button>

                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Cart Button */}
      <Link
        to="/cart"
        className="sm:hidden fixed bottom-20 right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all z-40"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {cartItems.length}
        </span>
      </Link>
    </div>
  );
};

export default Home;

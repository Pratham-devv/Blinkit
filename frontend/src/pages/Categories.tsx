import { useState } from "react";
import { useProd } from "../context/hooks/Products.Hook";
import { useCart } from "../context/hooks/Cart.Hook";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Grid3x3,
  Star,
  Plus,
  Package,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const { products } = useProd();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = products
    .map((product) => product.category)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : [];

  // Category emoji mapping
  const categoryEmojis: { [key: string]: string } = {
    Electronics: "📱",
    Clothing: "👕",
    Groceries: "🛒",
    Furniture: "🛋️",
    Books: "📚",
    Toys: "🧸",
    Sports: "⚽",
    Beauty: "💄",
    Home: "🏠",
    Food: "🍕",
  };

  const getCategoryEmoji = (category: string) => {
    return categoryEmojis[category] || "🏷️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                if (selectedCategory) {
                  setSelectedCategory(null);
                } else {
                  navigate("/");
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-1.5 sm:p-2 rounded-xl flex-shrink-0">
                <Grid3x3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {selectedCategory || "Categories"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {selectedCategory
                    ? `${filteredProducts.length} products`
                    : `Browse ${categories.length} categories`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Categories Grid - Show when no category is selected */}
        {!selectedCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-emerald-500 dark:border-gray-700 dark:hover:border-emerald-500 transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-4 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl sm:text-4xl">{getCategoryEmoji(category)}</span>
                </div>
                <p className="text-center font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm mb-1 sm:mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {category}
                </p>
                <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  <span>View Products</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Products Grid - Show when category is selected */}
        {selectedCategory && (
          <div>
            {/* Category Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-8 text-white shadow-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <span className="text-2xl sm:text-4xl">{getCategoryEmoji(selectedCategory)}</span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 truncate">{selectedCategory}</h2>
                  <p className="text-xs sm:text-sm text-emerald-50">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"} available
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
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
                      {/* Rating Badge */}
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                      <Link
                        to={`/productDetails/${product._id}`}
                        className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2.5 border-2 border-emerald-500 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-lg sm:rounded-xl font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors text-center text-xs sm:text-sm"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        className="px-2 sm:px-4 py-1.5 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-6 sm:p-8 rounded-full mb-4 sm:mb-6">
                  <Package className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 dark:text-gray-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center px-4">
                  No products found
                </h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-center px-4">
                  This category doesn't have any products yet.
                </p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Browse Other Categories
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
import React, { useState, useEffect } from "react";
import { useProd } from "../context/hooks/Products.Hook";
import type { Product } from "../types/Product.types";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  ShoppingCart,
  Star,
  Loader2,
  Package,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchPage: React.FC = () => {
  const { searchProducts } = useProd();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Real-time search as user types
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await searchProducts(query);
        setResults(res);
      } catch (err) {
        console.error("Search error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query, searchProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Search Products</h1>
                <p className="text-sm text-gray-500">Find what you need</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={query}
            placeholder="Search for products..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
            autoFocus
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-emerald-500 animate-spin" />
          )}
        </div>

        {/* Search Stats */}
        {query.trim() && !loading && results.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <p className="text-gray-600">
              Found <span className="font-bold text-gray-900">{results.length}</span>{" "}
              {results.length === 1 ? "result" : "results"} for "{query}"
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && query.trim() && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query.trim().length > 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full mb-6">
              <Package className="w-24 h-24 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No products found</h2>
            <p className="text-gray-500 text-center max-w-md">
              We couldn't find any products matching "{query}". Try different keywords.
            </p>
          </div>
        )}

        {/* Empty State (no search query) */}
        {!query.trim() && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-8 rounded-full mb-6">
              <Search className="w-24 h-24 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Start Searching</h2>
            <p className="text-gray-500 text-center max-w-md">
              Type in the search bar to find products instantly
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid gap-4">
            {results.map((product) => (
              <Link
                key={product._id}
                to={`/productDetails/${product._id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="flex gap-4 sm:gap-6 p-4 sm:p-6">
                  {/* Product Image */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-800">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">
                          ₹{product.price}
                        </p>
                        <p className="text-xs text-gray-500">MRP incl. of all taxes</p>
                      </div>

                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
                        <span className="hidden sm:inline">View Details</span>
                        <ShoppingCart className="w-5 h-5" />
                      </div>
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

export default SearchPage;
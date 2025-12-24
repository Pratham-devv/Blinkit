import React, { useState, useEffect } from "react";
import { useProd } from "../context/hooks/Products.Hook";
import type { Product } from "../types/Product.types";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  ShoppingCart,
  Star,
  Loader2,
  Package,
  TrendingUp
} from "lucide-react";

const SearchPage: React.FC = () => {
  const { searchProducts } = useProd();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");
  const navigate = useNavigate();

  // Debounced Search
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const res = await searchProducts(query);
        setResults(res);
      } catch {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Search className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold">Search Products</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Find the best deals</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WRAPPER */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* SEARCH BAR */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            value={query}
            placeholder="Search for groceries, snacks, essentials..."
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            autoFocus
          />

          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 animate-spin" />
          )}
        </div>

        {/* SEARCH RESULTS COUNT */}
        {query && !loading && results.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Found <span className="font-semibold text-gray-900 dark:text-white">{results.length}</span>{" "}
            results for "{query}"
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="mt-3 text-gray-500 dark:text-gray-400">Searching...</p>
          </div>
        )}

        {/* NO QUERY */}
        {!query.trim() && !loading && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-8 rounded-2xl mb-4">
              <Search className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">Start Searching</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              Type in the search bar to instantly discover products.
            </p>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && query.trim() && results.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl mb-4">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold">No results found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              Try different keywords or check spelling.
            </p>
          </div>
        )}

        {/* RESULTS */}
        <div className="grid gap-4 mt-2">
          {results.map((product) => (
            <Link
              key={product._id}
              to={`/productDetails/${product._id}`}
              className="group flex gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all"
            >
              {/* IMAGE */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                 <img
                        src={
                          product.image && product.image.length > 0
                            ? product.image[0]
                            : "https://picsum.photos/400/600"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />

                {/* Rating */}
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {product.rating}
                </div>
              </div>

              {/* TEXT SECTION */}
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {product.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                  {product.description}
                </p>

                {/* Bottom */}
                <div className="flex items-center justify-between mt-auto pt-3">
                  <div>
                    <p className="text-lg font-bold text-emerald-600">
                      ₹{product.price}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      MRP inclusive of all taxes
                    </p>
                  </div>

                  <div className="flex items-center gap-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs sm:text-sm font-semibold">
                    View
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

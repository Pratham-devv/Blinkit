import React, { useState } from "react";
import { useProd } from "../context/hooks/Products.Hook";
import type { Product } from "../types/Product.types";
import { Link } from "react-router-dom";

const SearchPage: React.FC = () => {
  const {searchProducts} = useProd();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await searchProducts(query);

    setResults(res);
    console.log("Search results:", res);
    } catch (err) {
        console.error("Search error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Search Products</h2>

      {/* Search bar */}
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          placeholder="Search products..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-black p-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="mt-4">Searching...</p>}

      {/* Error */}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {/* No results */}
      {!loading && results.length === 0 && query.length > 0 && (
        <p className="mt-4 text-gray-600">No products found.</p>
      )}

      {/* Results */}
      <div className="mt-6 space-y-4">
        {results.map((product) => (
          <div
            key={product._id}
            className="flex gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-28 h-28 object-cover rounded-lg"
            />

            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <p className="font-bold text-lg mt-1">₹{product.price}</p>

              <Link
                to={`/productdetails/${product._id}`}
                className="mt-2 inline-block bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;

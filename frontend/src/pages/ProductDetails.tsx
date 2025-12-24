import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProd } from "../context/hooks/Products.Hook";
import { useCart } from "../context/hooks/Cart.Hook";
import type { Product } from "../types/Product.types";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Loader2,
  Tag,
  Heart,
  Share2,
  CheckCircle,
} from "lucide-react";

const ProductDetails: React.FC = () => {
  const { viewProductById } = useProd();
  const { addToCart } = useCart();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (productId) {
          const product = await viewProductById(productId);
          if (mounted) setProductDetails(product ?? null);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        if (mounted) setProductDetails(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [productId, viewProductById]);

  const handleAddToCart = () => {
    if (!productDetails) return;
    addToCart(productDetails, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const incrementQuantity = () => setQuantity((p) => p + 1);
  const decrementQuantity = () => setQuantity((p) => (p > 1 ? p - 1 : 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-full mb-6 inline-block">
            <Package className="w-24 h-24 text-gray-400 dark:text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Product not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-full lg:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                Product Details
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="Wishlist"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                aria-label="Share"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => navigate("/cart")}
                aria-label="Go to cart"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-full lg:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Image / Media */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <div className="w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-700 aspect-[4/3] flex items-center justify-center">
               
              <img
                src={productDetails.image && productDetails.image.length > 0 ? productDetails.image[0] : "https://picsum.photos/400/600"}
                alt={productDetails.title ?? "product image"}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-700">
                <Tag className="w-4 h-4" />
                <span className="font-medium text-sm truncate max-w-[10rem]">{productDetails.category}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {productDetails.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1.5 rounded-xl border border-yellow-200 dark:border-yellow-700">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">{productDetails.rating ?? "0"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-300">/ 5</span>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  (Based on customer reviews)
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-transparent dark:to-transparent rounded-2xl p-4 sm:p-6 border border-emerald-200 dark:border-emerald-700 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Price</p>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹{productDetails.price?.toFixed ? productDetails.price.toFixed(2) : productDetails.price}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">MRP incl. of all taxes</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 dark:border-gray-700 mb-6 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{productDetails.description || "No description available for this product."}</p>
            </div>

            {/* Actions */}
            <div className="w-full">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 lg:sticky lg:top-28">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Quantity */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Quantity</p>
                    <div className="inline-flex items-center bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-700">
                      <button
                        onClick={decrementQuantity}
                        aria-label="Decrease quantity"
                        className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-l-md transition"
                      >
                        <Minus className="w-4 h-4 text-emerald-600" />
                      </button>
                      <div className="px-6 py-2 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                        {quantity}
                      </div>
                      <button
                        onClick={incrementQuantity}
                        aria-label="Increase quantity"
                        className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-r-md transition"
                      >
                        <Plus className="w-4 h-4 text-emerald-600" />
                      </button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Total</p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{((productDetails.price ?? 0) * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                      addedToCart
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

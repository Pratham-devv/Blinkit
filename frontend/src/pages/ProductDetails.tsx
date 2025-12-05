import { useParams, useNavigate } from "react-router-dom";
import { useProd } from "../context/hooks/Products.Hook";
import { useCart } from "../context/hooks/Cart.Hook";
import { useEffect, useState } from "react";
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
  CheckCircle
} from "lucide-react";

const ProductDetails = () => {
  const { viewProductById } = useProd();
  const { addToCart } = useCart();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<Product>(null!);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const product = await viewProductById(productId!);
        setProductDetails(product!);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId, viewProductById]);

  const handleAddToCart = () => {
    if (productDetails) {
      addToCart(productDetails, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full mb-6 inline-block">
            <Package className="w-24 h-24 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-8">
            The product you're looking for doesn't exist.
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Product Details
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={productDetails.image}
                alt={productDetails.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Category Badge */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl border-2 border-emerald-200">
                <Tag className="w-4 h-4" />
                <span className="font-semibold text-sm">{productDetails.category}</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Title & Rating */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {productDetails.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-xl border-2 border-yellow-200">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">
                    {productDetails.rating}
                  </span>
                  <span className="text-sm text-gray-600">/ 5.0</span>
                </div>
                <span className="text-sm text-gray-500">
                  (Based on customer reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-200 mb-6">
              <p className="text-sm text-gray-600 mb-2">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-emerald-600">
                  ₹{productDetails.price}
                </span>
                <span className="text-sm text-gray-500">MRP incl. of all taxes</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6 flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {productDetails.description || "No description available for this product."}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky bottom-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Quantity</p>
                  <div className="flex items-center bg-emerald-50 rounded-xl border-2 border-emerald-200 w-fit">
                    <button
                      onClick={decrementQuantity}
                      className="p-3 hover:bg-emerald-100 rounded-l-xl transition-colors"
                    >
                      <Minus className="w-5 h-5 text-emerald-600" />
                    </button>
                    <span className="px-8 py-3 font-bold text-gray-900 text-lg min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-3 hover:bg-emerald-100 rounded-r-xl transition-colors"
                    >
                      <Plus className="w-5 h-5 text-emerald-600" />
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Total</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    ₹{(productDetails.price * quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-3 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
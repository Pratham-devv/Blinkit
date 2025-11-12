import { createContext, useEffect, useState } from "react";
import type { CartContextType, CartItem } from "../../types/Cart.types";
import type { Product } from "../../types/Product.types";
import api from "../../api/axiosInstance";

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const token = localStorage.getItem("token");

  console.log("🛒 Cart Items:", cartItems);

  // 🧩 Fetch Cart from Backend or LocalStorage
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const res = await api.get("/cart"); // ✅ your GET route
          // Backend returns object with `items` array
          if (res.data?.items) {
            setCartItems(res.data.items);
          } else {
            setCartItems([]);
          }
        } catch (err) {
          console.error("❌ Error fetching backend cart:", err);
        }
      } else {
        // Guest user cart (localStorage)
        const localCart = localStorage.getItem("cartItems");
        if (localCart) setCartItems(JSON.parse(localCart));
      }
    };

    fetchCart();
  }, [token]);

  // 🧩 Store cart locally for guest users
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  // 🧩 Add Item to Cart
  const addToCart = async (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.products._id === product._id);
      let updated;

      if (existing) {
        updated = prevItems.map((item) =>
          item.products._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prevItems, { products: product, quantity }];
      }

      if (!token) localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        // ✅ your backend route is /cart/add
        await api.post("/cart/add", { productId: product._id, quantity });
      } catch (err) {
        console.error("❌ Error adding to backend cart:", err);
      }
    }
  };

  // 🧩 Remove Item
  const removeFromCart = async (productId: string) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.products._id === productId);
      if (!item) return prevItems;

      let updated;
      if (item.quantity === 1) {
        updated = prevItems.filter((i) => i.products._id !== productId);
      } else {
        updated = prevItems.map((i) =>
          i.products._id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }

      if (!token) localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        await api.delete(`/cart/remove`,{data:{productId}}); // ✅ consistent backend route
      } catch (err) {
        console.error("❌ Error removing from backend cart:", err);
      }
    }
  };

  // 🧩 Clear Cart
  const clearCart = async () => {
    setCartItems([]);
    if (!token) {
      localStorage.removeItem("cartItems");
    } else {
      try {
        await api.delete("/cart/clear"); // ✅ create /cart/clear route in backend if not present
      } catch (err) {
        console.error("❌ Error clearing backend cart:", err);
      }
    }
  };

  // 🧩 View Cart
  const viewCart = () => cartItems;

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, viewCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };

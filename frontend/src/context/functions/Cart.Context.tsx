import { createContext, useEffect, useState } from "react";
import type { CartContextType, CartItem } from "../../types/Cart.types";
import type { Product } from "../../types/Product.types";
import api from "../../api/axiosInstance";

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const res = await api.get("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems(res.data);
        } catch (err) {
          console.error("Error fetching backend cart:", err);
        }
      } else {
        const localCart = localStorage.getItem("cartItems");
        if (localCart) setCartItems(JSON.parse(localCart));
      }
    };

    fetchCart();
  }, [token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

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
        await api.post(
          "/cart",
          { productId: product._id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error adding to backend cart:", err);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.products._id === productId);
      if (!item) return prevItems;

      let updated;
      if (item.quantity === 1) {
        updated = prevItems.filter((i) => i.products._id !== productId);
      } else {
        updated = prevItems.map((i) =>
          i.products._id === productId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }

      if (!token) localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        await api.delete(`/cart/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error removing from backend cart:", err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (!token) localStorage.removeItem("cartItems");
    else {
      try {
        await api.delete("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error clearing backend cart:", err);
      }
    }
  };

  const viewCart = () => cartItems;

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, viewCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

import { createContext, useEffect, useState } from "react";
import type { CartContextType, CartItem } from "../../types/Cart.types";
import type { Product } from "../../types/Product.types";
import api from "../../api/axiosInstance";
import { useAuth } from "../hooks/Auth.Hook";

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const[localCartItems,setLocalCartItems]=useState<CartItem[]>([]);
  const {token}= useAuth();
  console.log("🛒 Cart Items:", cartItems);

  // 🧩 Fetch Cart from Backend or LocalStorage  
  useEffect(() => {
    const syncAndFetchCart = async () => {
      // 1️⃣ Guest mode: no token → only local cart
      if (!token) {
        const localCart = localStorage.getItem("cartItems");
        const parsed: CartItem[] = localCart ? JSON.parse(localCart) : [];
        setLocalCartItems(parsed);
        setCartItems([]); // clear backend cart display
        return;
      }

      // 2️⃣ Logged in: try merging guest cart (if any) into backend
      try {
        const localCart = localStorage.getItem("cartItems");
        const parsed: CartItem[] = localCart ? JSON.parse(localCart) : [];

        if (parsed.length > 0) {
          const mergePayload = parsed.map((item) => ({
            productId: item.products._id,
            quantity: item.quantity,
          }));

          const mergeRes = await api.post("/cart/merge", { items: mergePayload });
          const mergedItems: CartItem[] = (mergeRes.data.items || []).map((item: CartItem) => ({
            products: item.products,    // populated product from backend
            quantity: item.quantity,
          }));

          setCartItems(mergedItems);
          console.log("Merged guest cart into backend cart:", mergedItems);
          setLocalCartItems([]);
          localStorage.removeItem("cartItems");
          setCartItems([...mergedItems]);
          return; // done, we have fresh merged cart
        }
      } catch (err) {
        console.error("❌ Error merging guest cart:", err);
        // if merge fails, we just fall through and try normal fetch
      }

      // 3️⃣ If no local cart or merge failed → just fetch backend cart
      try {
        const res = await api.get("/cart");
        const backendItems: CartItem[] = (res.data.items || []).map((item: CartItem) => ({
          products: item.products,
          quantity: item.quantity,
        }));

        setCartItems(backendItems);
        console.log("Fetched backend cart items:", backendItems);
        setLocalCartItems([]);
      } catch (err) {
        console.error("Error fetching backend cart:", err);
      }
    };

    syncAndFetchCart();
  }, [token]);
 
  


  // 🧩 Add Item to Cart
  const addToCart = async (product: Product, quantity = 1) => {
    if (!token) {
      // guest mode → work on localCartItems + localStorage
      setLocalCartItems((prev) => { 
        const existing = prev.find((i) => i.products._id === product._id);
        let updated: CartItem[];

        if (existing) {
          updated = prev.map((item) =>
            item.products._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updated = [...prev, { products: product, quantity }];
        }

        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // logged in → backend cart
    setCartItems((prev) => {;
      const existing = prev.find((i) => String(i.products._id) === String(product._id));
      console.log("Existing item in main cart:", existing);
      if (existing) {
        return prev.map((item) =>
          item.products._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { products: product, quantity }];
    });

    try {
      await api.post("/cart/add", { productId: product._id, quantity });
    } catch (err) {
      console.error("❌ Error adding to backend cart:", err);
    }
  };

  // 🧩 Remove Item
  const removeFromCart = async (productId: string) => {
    if (!token) {
      setLocalCartItems((prev) => {
        const item = prev.find((i) => i.products._id === productId);
        if (!item) return prev;

        let updated: CartItem[];
        if (item.quantity === 1) {
          updated = prev.filter((i) => i.products._id !== productId);
        } else {
          updated = prev.map((i) =>
            i.products._id === productId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          );
        }
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    setCartItems((prev) => {    
      const item = prev.find((i) => i.products._id === productId);
      if (!item) return prev;

      let updated: CartItem[];
      if (item.quantity === 1) {
        updated = prev.filter((i) => i.products._id !== productId);
      } else {
        updated = prev.map((i) =>
          i.products._id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return updated;
    });

    try {
      await api.delete("/cart/remove", { data: { productId } });
    } catch (err) {
      console.error("❌ Error removing from backend cart:", err);
    }
  };

  const removeItemCompletely = async (productId: string) => {
    if (!token) {
      setLocalCartItems((prev) => {
        const updated = prev.filter((i) => i.products._id !== productId);
        localStorage.setItem("cartItems", JSON.stringify(updated));
        return updated;
      });
      return;
    }
    setCartItems((prev) => {    
      const updated = prev.filter((i) => i.products._id !== productId);
      return updated;
    });
    try {
      await api.delete("/cart/clearItem", { data: { productId } });
    } catch (err) {
      console.error("❌ Error removing item completely from backend cart:", err);
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


  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, localCartItems, removeItemCompletely }}
    >
      {children}
    </CartContext.Provider>
  );
};

export {CartContext}; 

import { Cart, ICart } from "../models/cart.model";
import {  Response } from "express";
import { Product } from "../models/product.model";
import { AuthiRequest } from "../middlewares/Auth.middleware";
import mongoose from "mongoose";
import { it } from "node:test";

interface MergeItemInput {
  productId: string;
  quantity: number;
}


export const addToCart = async (req: AuthiRequest, res: Response) => {
    try { 
        const userId = req.user?._id.toString();
        console.log(userId);
        const { productId, quantity } = req.body;
        console.log("Here is products Id",productId);
        console.log(quantity);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } 
        let cart = await Cart.findOne({ user: userId }).populate("items.products", "title price image").exec();
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        console.log("cart before adding item:", cart);
        const existingItem = cart.items.find((item) => String(item.products._id || item.products) === String(productId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ products: productId, quantity });
        }
        await cart.save();
        res.status(200).json(cart);
    }   
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const viewCart = async (req: AuthiRequest, res: Response) => {
    try {
        const userId = req.user?._id.toString();
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await Cart.findOne({ user: userId }).populate('items.products', 'title price');
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const removeFromCart = async (req: AuthiRequest, res: Response) => {
    try {
        const userId = req.user?._id.toString();;
        const { productId } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const existingItem = cart.items.find((item) => String(item.products?._id || item.products) === String(productId));
        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                cart.items = cart.items.filter((item) => String(item.products?._id || item.products) !== String(productId));
            }
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        } 
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const clearCart = async (req: AuthiRequest, res: Response) => {
    try {
        const userId = req.user?._id.toString();
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = [];
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateCartItem = async (req: AuthiRequest, res: Response) => {
    try {
        const userId =req.user?._id.toString();
        const { productId, quantity } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const itemIndex = cart.items.findIndex(item => item.products.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex]!.quantity = quantity;
            await cart.save();
            return res.status(200).json(cart);
        } else {    
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const mergeCart = async (req: AuthiRequest, res: Response) => {
  try {
    const userId = req.user?.id.toString();
    const items: MergeItemInput[] = req.body.items || [];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "items must be an array" });
    }

    // Normalize: merge duplicates from client itself
    const mergedFromClient = new Map<string, number>();
    for (const item of items) {
      if (!item.productId || typeof item.quantity !== "number") continue;
      const current = mergedFromClient.get(item.productId) ?? 0;
      mergedFromClient.set(item.productId, current + Math.max(item.quantity, 0));
    }

    // Find existing cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If no cart yet → create new from client items
      const newItems: ICart["items"] = [...mergedFromClient.entries()].map(
        ([productId, quantity]) => ({
          products: new mongoose.Types.ObjectId(productId),
          quantity,
        })
      );

      cart = await Cart.create({
        user: new mongoose.Types.ObjectId(userId),
        items: newItems,
      });
    } else {
      // Merge with existing cart items
      const map = new Map<string, number>();

      // existing items
      for (const item of cart.items) {
        map.set(String(item.products), (map.get(String(item.products)) ?? 0) + item.quantity);
      }

      // incoming items
      for (const [productId, qty] of mergedFromClient.entries()) {
        map.set(productId, (map.get(productId) ?? 0) + qty);
      }

      // rebuild array
      cart.items = [...map.entries()].map(([productId, quantity]) => ({
        products: new mongoose.Types.ObjectId(productId),
        quantity,
      }));

      await cart.save();
    }

    // Optionally populate products
    await cart.populate("items.products");

    return res.status(200).json({
      success: true,
      items: cart.items,
    });
  } catch (err) {
    console.error("Error merging cart:", err);
    return res.status(500).json({ message: "Server error while merging cart" });
  }
};

// export const mergeCart = async (req: AuthiRequest, res: Response) => {
//     try {
//         const userId = req.user?._id.toString();
//         const guestCartItems = req.body.items || []; // Expecting an array of { productId, quantity }
//         console.log("cart items to merge:", guestCartItems);

//         let cart = await Cart.findOne({ user: userId }).populate("items.products", "title price image").exec();
//         if (!cart) {
//             cart = new Cart({ user: userId, items: [] });
//         }
//         guestCartItems.forEach((guestItem:any) => {
//             console.log("merging item:", guestItem.products._id);
//             console.log("guest item productId as ObjectId:",guestItem);
//             const existing = cart.items.find((i)=> i.products.toString() === guestItem.products._id);
//             if (existing) {
//                 existing.quantity += guestItem.quantity;
//             } else {
//                 cart.items.push({ products: guestItem.products._id , quantity: guestItem.quantity });
//             }
//         });
//         await cart.save();
//         console.log("merged cart:", cart);
//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// }


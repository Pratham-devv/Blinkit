import { Cart } from "../models/cart.model";
import { Request, Response } from "express";
import { Product } from "../models/product.model";


export interface CartRequest extends Request {
    user?: { _id: string } | undefined;
}


export const addToCart = async (req: CartRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { productId, quantity } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } 
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        const existingItemIndex = cart.items.findIndex(item => item.products.toString() === productId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex]!.quantity += quantity;
        } else {
            cart.items.push({ products: [productId], quantity });
        }
        await cart.save();
        res.status(200).json(cart);
    }   
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const viewCart = async (req: CartRequest, res: Response) => {
    try {
        const userId = req.user?._id;
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

export const removeFromCart = async (req: CartRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const { productId } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const itemIndex = cart.items.findIndex(item => item.products.toString() === productId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }   
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const clearCart = async (req: CartRequest, res: Response) => {
    try {
        const userId = req.user?._id;
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






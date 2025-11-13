import {Cart} from "../models/cart.model";
import {Request, Response} from "express";
import { Order } from "../models/order.model";
import { AuthiRequest } from "../middlewares/Auth.middleware";
import mongoose from "mongoose";

export const placeOrder = async (req: AuthiRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🛒 Get user cart with populated products
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.products",
      "price title"
    );

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    console.log(cart);

    // 🧮 Calculate total amount safely
    const totalAmount = cart.items.reduce((acc, item) => {
      if (!item.products) return acc;

      // Handle populated vs unpopulated products
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;

      if (!product) return acc; // skip undefined products

      const price = (product as any).price ?? 0;
      return acc + price * (item.quantity || 0);
    }, 0);

    console.log("Order amount",totalAmount);

    // 🧱 Build order items array safely 
    const orderItems = cart.items
      .filter((item) => item.products && item.quantity > 0)
      .map((item) => {
        const product =
          Array.isArray(item.products) && item.products.length > 0
            ? item.products[0]
            : item.products;
        console.log("order Product",product);

        const productId = new mongoose.Types.ObjectId(product as any);

        return {
          product: productId,
          quantity: item.quantity,
        };
      });

    // 🚫 Guard clause: if no valid products
    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No valid products in cart" });
    }

    // 🆕 Create new order
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "pending",
    });

    // 🧹 Clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error: any) {
    console.error("❌ Order error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



export const viewOrders = async (req: AuthiRequest, res: Response) => {
    try {
        const userId = req.user?._id.toString();
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const orders = await Order.find({ user: userId }).populate('products.product', 'title price').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const viewOrderDetails = async (req: AuthiRequest, res: Response) => {
    try {
        const userId = req.user?._id.toString();
        const orderId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const order = await Order.findOne({ _id: orderId, user: userId }).populate('products.product', 'title price');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const cancelOrder = async (req: AuthiRequest, res: Response) => {
    try {
        const userId = req.user?._id.toString();
        const orderId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== 'pending') {
            return res.status(400).json({ message: "Only pending orders can be cancelled" });
        }   
        order.status = 'cancelled';
        await order.save();
        res.status(200).json({ message: "Order cancelled", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }   
};


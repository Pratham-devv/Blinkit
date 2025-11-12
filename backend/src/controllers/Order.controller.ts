import {Cart} from "../models/cart.model";
import {Request, Response} from "express";
import { Order } from "../models/order.model";
import { AuthiRequest } from "../middlewares/Auth.middleware";
import mongoose from "mongoose";

export const placeOrder = async (req: AuthiRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // find user's cart and populate products
    const cart = await Cart.findOne({ user: userId }).populate("items.products", "price title");
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Your cart is empty" });
      return;
    }

    // Place individual orders for each cart item
    const orders = await Promise.all(
      cart.items.map(async (item) => {
        const product =
          Array.isArray(item.products) && item.products.length > 0
            ? item.products[0]
            : item.products;
        const price = (product as any)?.price || 0;

        const totalAmount = price * item.quantity;

        const newOrder = new Order({
          user: userId,
          product: product instanceof mongoose.Types.ObjectId || product,
          quantity: item.quantity,
          totalAmount,
          status: "pending",
        });

        await newOrder.save();
        return newOrder;
      })
    );

    // Clear the cart after order placement
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Orders placed successfully",
      orders,
    });
  } catch (error: any) {
    console.error("❌ Order Error:", error.message);
    res.status(500).json({ message: "Server error while placing orders", error: error.message });
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


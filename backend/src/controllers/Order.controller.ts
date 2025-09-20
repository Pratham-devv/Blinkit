import {Cart} from "../models/cart.model";
import {Request, Response} from "express";
import { Order } from "../models/order.model";

export interface OrderRequest extends Request {
    user?: { _id: string } | undefined;
}

export const placeOrder = async (req: OrderRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await Cart.findOne({ user: userId }).populate('items.products', 'title price');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const orderItems = cart.items.map(item => ({
            product: item.products[0],
            quantity: item.quantity,
        }));
        const totalAmount = cart.items.reduce((total, item) => {
            const product = (item.products as any).price;
            return total + (product.price * item.quantity);
        }, 0);
        const order = new Order({
            user: userId,
            products: orderItems,
            totalAmount,
            status: 'pending',
        });
        await order.save();
        cart.items = [];
        await cart.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const viewOrders = async (req: OrderRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const orders = await Order.find({ user: userId }).populate('products.product', 'title price').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const viewOrderDetails = async (req: OrderRequest, res: Response) => {
    try {
        const userId = req.user?._id;
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

export const cancelOrder = async (req: OrderRequest, res: Response) => {
    try {
        const userId = req.user?._id;
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


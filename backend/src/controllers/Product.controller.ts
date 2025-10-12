import { Product } from "../models/product.model";
import { Request, Response } from "express";


export const viewProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);                  // retrieve product by ID react se.. yaad rkhio yaha full view dena
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const viewProductByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};  

export const searchProducts = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: "Query parameter is required and must be a string" });
        }
        const products = await Product.find({ title: { $regex: query, $options: 'i' } })
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }   
};
export const postManyProducts = async (req: Request, res: Response) => {
    try {
        const productsData = req.body; // Expecting an array of products in the request body
        if (!Array.isArray(productsData) || productsData.length === 0) {
            return res.status(400).json({ message: "Request body must be a non-empty array of products" });
        }   
        const createdProducts = await Product.insertMany(productsData);
        res.status(201).json(createdProducts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }   
};





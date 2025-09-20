import { Category } from "../models/category.model";
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
       const {category} = req.query;
         const filter: any = {};
        if (category) {
            const categoryDoc = await Category.findOne({ name: category.toString()});
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            } else {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const products = await Product
            .find(filter)
            .populate('category', 'name')
            .sort({ createdAt: -1 });
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




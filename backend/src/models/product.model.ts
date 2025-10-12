import mongoose from "mongoose";


export interface IProduct {
    id: mongoose.Types.ObjectId;
    title: string;
    price: number;
    category: string;
    stock: number;
    description: string;
    images: string[];
    rating: number[];
}

const ProductSchema = new mongoose.Schema<IProduct>({
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    rating: { type: [Number], default: [] },
}, { timestamps: true }); 

export const Product = mongoose.model<IProduct>('Product', ProductSchema);


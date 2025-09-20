import mongoose, { Schema } from "mongoose";

export interface ICategory {
    name: string;
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });


export const Category = mongoose.model<ICategory>('Category', categorySchema);

import mongoose, {Schema, Document}  from "mongoose";

export default interface IOrder extends Document{
    user: mongoose.Types.ObjectId;
    products: { product: mongoose.Types.ObjectId; quantity: number }[]; // Array of products with quantities
    totalAmount: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}
const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });     

export const Order = mongoose.model<IOrder>('Order', orderSchema);
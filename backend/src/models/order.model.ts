import mongoose, {Schema, Document}  from "mongoose";

interface IOrderItem{
    product: mongoose.Types.ObjectId;
    quantity: Number;
};

export default interface IOrder extends Document{
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}
const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });     

export const Order = mongoose.model<IOrder>('Order', orderSchema);
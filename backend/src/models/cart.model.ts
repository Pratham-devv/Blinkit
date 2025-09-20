import mongoose , {Document} from "mongoose";

export interface ICartItem {
    products: mongoose.Types.ObjectId[];
    quantity: number;
}

export interface ICart extends Document{
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
}
const cartSchema = new mongoose.Schema<ICart>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
        products: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }]
}, { timestamps: true });
export const Cart = mongoose.model<ICart>('Cart', cartSchema);
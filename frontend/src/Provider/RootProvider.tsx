import type { ReactNode } from "react";
import { AuthProvider } from "../context/functions/Auth.Context";
import { ProductProvider } from "../context/functions/Product.Context";
import { CartProvider } from "../context/functions/Cart.Context";
import { OrderProvider } from "../context/functions/Order.Context";

interface RootProviderProps {
    children: ReactNode;
}
export const RootProvider = ({children}: RootProviderProps) => {
    return (
        <AuthProvider>
            <ProductProvider>
                <CartProvider>
                    <OrderProvider>
                    {children}
                    </OrderProvider>
                </CartProvider>
                
            </ProductProvider>

        </AuthProvider>
    );
};

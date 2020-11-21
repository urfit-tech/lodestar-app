import React from 'react';
import { CartProductProps } from '../types/checkout';
import { ProductType } from '../types/product';
declare const CartContext: React.Context<{
    cartProducts: CartProductProps[];
    isProductInCart?: ((productType: ProductType, productTarget: string) => boolean) | undefined;
    getCartProduct?: ((productId: string) => CartProductProps | null) | undefined;
    addCartProduct?: ((productType: ProductType, productTarget: string, productOptions?: {
        [key: string]: any;
    } | undefined) => Promise<void>) | undefined;
    updatePluralCartProductQuantity?: ((productId: string, quantity: number) => Promise<void>) | undefined;
    removeCartProducts?: ((productIds: string[]) => Promise<void>) | undefined;
    clearCart?: (() => Promise<void>) | undefined;
}>;
export declare const CartProvider: React.FC;
export default CartContext;

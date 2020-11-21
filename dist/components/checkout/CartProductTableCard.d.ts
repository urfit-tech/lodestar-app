import { CardProps } from 'antd/lib/card';
import React from 'react';
import { CartProductProps } from '../../types/checkout';
declare type CartProductTableCardProps = CardProps & {
    shopId: string;
    cartProducts: CartProductProps[];
    withCartLink?: boolean;
};
declare const CartProductTableCard: React.FC<CartProductTableCardProps>;
export default CartProductTableCard;

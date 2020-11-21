import React from 'react';
import { CartProductProps } from '../../types/checkout';
import { MemberProps } from '../../types/member';
declare const CheckoutBlock: React.FC<{
    member: MemberProps | null;
    shopId: string;
    cartProducts: CartProductProps[];
}>;
export default CheckoutBlock;

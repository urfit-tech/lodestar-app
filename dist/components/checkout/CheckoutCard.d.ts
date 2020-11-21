import { CardProps } from 'antd/lib/card';
import React from 'react';
import { CartProductProps, CheckProps } from '../../types/checkout';
import { InvoiceProps } from './InvoiceInput';
import { ShippingProps } from './ShippingInput';
declare const CheckoutCard: React.FC<CardProps & {
    discountId: string | null;
    check: CheckProps;
    cartProducts: CartProductProps[];
    invoice: InvoiceProps;
    shipping: ShippingProps | null;
    onCheckout?: () => void;
}>;
export default CheckoutCard;

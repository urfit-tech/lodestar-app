import React from 'react';
import { shippingOptionProps } from '../../types/checkout';
export declare const csvShippingMethods: string[];
export declare type ShippingProps = {
    name?: string;
    phone?: string;
    address?: string;
    shippingMethod?: string;
    specification?: string;
    storeId?: string;
    storeName?: string;
};
export declare const validateShipping: (shipping: ShippingProps) => boolean;
declare const ShippingInput: React.FC<{
    value?: ShippingProps;
    onChange?: (value: ShippingProps) => void;
    isValidating?: boolean;
    shippingMethods?: shippingOptionProps[];
}>;
export default ShippingInput;

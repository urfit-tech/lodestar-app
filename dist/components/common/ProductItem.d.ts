import React from 'react';
declare type ProductItemProps = {
    id: string;
    startedAt?: Date;
    variant?: 'default' | 'simple' | 'simpleCartProduct' | 'checkout' | 'coupon-product';
    quantity?: number;
};
declare const ProductItem: React.FC<ProductItemProps>;
export default ProductItem;

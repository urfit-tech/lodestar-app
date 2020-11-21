import React from 'react';
declare type ProductSelectorProps = {
    loading?: boolean;
    error?: Error;
    products: {
        id: string;
        title: string;
        type: string;
    }[];
    value?: string[];
    onChange?: (value: string[]) => void;
};
declare const ProductSelector: React.FC<ProductSelectorProps>;
export default ProductSelector;

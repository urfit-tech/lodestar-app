import React from 'react';
declare const QuantityInput: React.FC<{
    value?: number;
    min?: number;
    max?: number;
    onChange?: (value: number | undefined) => void;
}>;
export default QuantityInput;

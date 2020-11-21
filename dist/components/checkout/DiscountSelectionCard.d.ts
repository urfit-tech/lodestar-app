import React from 'react';
import { CheckProps } from '../../types/checkout';
declare const DiscountSelectionCard: React.FC<{
    value?: string | null;
    check?: CheckProps;
    onChange?: (discountId: string) => void;
}>;
export default DiscountSelectionCard;

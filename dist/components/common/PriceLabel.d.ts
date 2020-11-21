import React from 'react';
import { PeriodType } from '../../types/program';
declare type PriceLabelOptions = {
    listPrice: number;
    salePrice?: number | null;
    downPrice?: number | null;
    periodAmount?: number | null;
    periodType?: PeriodType;
    currencyId?: 'LSC' | string;
};
declare const PriceLabel: React.FC<PriceLabelOptions & {
    variant?: 'default' | 'inline' | 'full-detail';
    render?: React.FC<PriceLabelOptions & {
        formatPrice: (price: number) => string;
    }>;
    noFreeText?: boolean;
}>;
export default PriceLabel;

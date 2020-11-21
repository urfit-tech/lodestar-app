import React from 'react';
import { MerchandiseProps } from '../../types/merchandise';
declare const MerchandiseBlock: React.FC<{
    merchandise: MerchandiseProps;
    withPaymentButton?: boolean;
    showDescription?: boolean;
}>;
export default MerchandiseBlock;

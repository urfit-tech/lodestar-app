import React from 'react';
import { MerchandiseProps, MerchandiseSpecProps } from '../../types/merchandise';
declare const MerchandisePaymentButton: React.FC<{
    merchandise: MerchandiseProps;
    merchandiseSpec: MerchandiseSpecProps;
    quantity: number;
}>;
export default MerchandisePaymentButton;

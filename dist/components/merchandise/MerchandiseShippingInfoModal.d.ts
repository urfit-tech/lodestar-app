import React from 'react';
import { InvoiceProps } from '../checkout/InvoiceInput';
import { ShippingProps } from '../checkout/ShippingInput';
declare const MerchandiseShippingInfoModal: React.FC<{
    shipping: ShippingProps;
    invoice: InvoiceProps;
}>;
export default MerchandiseShippingInfoModal;

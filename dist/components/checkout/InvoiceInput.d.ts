import React from 'react';
export declare type InvoiceProps = {
    name: string;
    phone: string;
    email: string;
    phoneBarCode?: string;
    citizenCode?: string;
    uniformNumber?: string;
    uniformTitle?: string;
    donationCode?: string;
    postCode?: string;
    address?: string;
};
export declare const validateInvoice: (invoice: InvoiceProps) => string[];
declare const InvoiceInput: React.FC<{
    value?: InvoiceProps;
    onChange?: (value: InvoiceProps) => void;
    isValidating?: boolean;
    shouldSameToShippingCheckboxDisplay?: boolean;
}>;
export default InvoiceInput;

import React from 'react';
export declare type CardHolder = {
    phoneNumber: string;
    name: string;
    email: string;
    zipCode?: string;
    address?: string;
    nationalId?: string;
};
declare type CreditCardSelectorProps = {
    memberId: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
};
declare const CreditCardSelector: React.FC<CreditCardSelectorProps>;
export default CreditCardSelector;

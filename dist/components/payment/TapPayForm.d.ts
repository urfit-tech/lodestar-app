import React from 'react';
export declare type TPCreditCard = {
    cardType: 'mastercard' | 'visa' | 'jcb' | 'amex' | 'unionpay' | 'unknown';
    canGetPrime: boolean;
    hasError: boolean;
    status: {
        number: 0 | 1 | 2 | 3;
        expiry: number;
        ccv: number;
    };
};
declare type TapPayFormProps = {
    onUpdate?: (tpCreditCard: TPCreditCard) => void;
};
declare const _default: React.NamedExoticComponent<TapPayFormProps>;
export default _default;

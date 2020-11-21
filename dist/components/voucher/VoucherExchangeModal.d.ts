import React from 'react';
declare type VoucherExchangeModalProps = {
    productQuantityLimit: number;
    description: string | null;
    productIds: string[];
    onExchange?: (setVisible: React.Dispatch<React.SetStateAction<boolean>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, selectedProductIds: string[]) => void;
};
declare const VoucherExchangeModal: React.FC<VoucherExchangeModalProps>;
export default VoucherExchangeModal;

import React from 'react';
import { VoucherProps } from './Voucher';
declare type VoucherCollectionBlockProps = {
    memberId: string | null;
    loading?: boolean;
    error?: Error;
    voucherCollection: (VoucherProps & {
        productIds: string[];
    })[];
    onInsert: (setLoading: React.Dispatch<React.SetStateAction<boolean>>, code: string) => void;
    onExchange: (setVisible: React.Dispatch<React.SetStateAction<boolean>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, selectedProductIds: string[], voucherId: string) => void;
};
declare const VoucherCollectionBlock: React.FC<VoucherCollectionBlockProps>;
export default VoucherCollectionBlock;

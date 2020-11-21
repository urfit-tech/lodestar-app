import React from 'react';
export declare type VoucherProps = {
    id: string;
    title: string;
    description: string | null;
    startedAt?: Date;
    endedAt?: Date;
    productQuantityLimit: number;
    available: boolean;
    extra?: React.ReactNode;
    action?: React.ReactNode;
};
declare const Voucher: React.FC<VoucherProps>;
export default Voucher;

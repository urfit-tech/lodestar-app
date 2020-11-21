import React from 'react';
import { CouponProps, OrderDiscountProps, OrderProductProps } from '../../types/checkout';
declare const CouponSelectionModal: React.FC<{
    memberId: string;
    orderProducts: OrderProductProps[];
    orderDiscounts: OrderDiscountProps[];
    onSelect?: (coupon: CouponProps) => void;
    render?: React.FC<{
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
        selectedCoupon?: CouponProps;
    }>;
}>;
export default CouponSelectionModal;

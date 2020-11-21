import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { CouponProps } from '../../types/checkout';
declare const CouponDescriptionModal: React.FC<ModalProps & {
    coupon: CouponProps;
}>;
export default CouponDescriptionModal;

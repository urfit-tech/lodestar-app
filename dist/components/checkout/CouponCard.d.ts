import { CardProps } from 'antd/lib/card';
import React from 'react';
import { CouponProps } from '../../types/checkout';
declare const CouponCard: React.FC<CardProps & {
    coupon: CouponProps;
}>;
export default CouponCard;

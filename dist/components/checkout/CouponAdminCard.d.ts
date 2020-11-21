import React from 'react';
import { CouponProps } from '../../types/checkout';
declare const CouponAdminCard: React.FC<{
    coupon: CouponProps;
    outdated?: boolean;
}>;
export default CouponAdminCard;

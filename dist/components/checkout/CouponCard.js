var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Card } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { dateFormatter } from '../../helpers';
import { checkoutMessages } from '../../helpers/translation';
import PriceLabel from '../common/PriceLabel';
var CouponCard = function (_a) {
    var coupon = _a.coupon, cardProps = __rest(_a, ["coupon"]);
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(Card, __assign({}, cardProps),
        React.createElement("div", { style: { fontSize: '20px', fontWeight: 'bold', paddingBottom: '12px' } }, coupon.couponCode.couponPlan.title),
        React.createElement("div", null,
            coupon.couponCode.couponPlan.constraint
                ? formatMessage({ id: 'checkout.coupon.full', defaultMessage: '消費滿 {amount} 折抵' }, { amount: React.createElement(PriceLabel, { listPrice: coupon.couponCode.couponPlan.constraint }) })
                : formatMessage(checkoutMessages.content.discountDirectly),
            coupon.couponCode.couponPlan.type === 'cash'
                ? formatMessage({ id: 'checkout.coupon.amount', defaultMessage: '金額 {amount} 元' }, { amount: React.createElement(PriceLabel, { listPrice: coupon.couponCode.couponPlan.amount }) })
                : coupon.couponCode.couponPlan.type === 'percent'
                    ? formatMessage({ id: 'checkout.coupon.proportion', defaultMessage: '比例 {amount}%' }, { amount: coupon.couponCode.couponPlan.amount })
                    : null),
        React.createElement("div", null,
            coupon.couponCode.couponPlan.startedAt
                ? dateFormatter(coupon.couponCode.couponPlan.startedAt)
                : formatMessage(checkoutMessages.coupon.fromNow),
            ' ~ ',
            coupon.couponCode.couponPlan.endedAt
                ? dateFormatter(coupon.couponCode.couponPlan.endedAt)
                : formatMessage(checkoutMessages.coupon.noPeriod))));
};
export default CouponCard;
//# sourceMappingURL=CouponCard.js.map
import { Button, Divider, Input, message, Modal, Spin } from 'antd';
import axios from 'axios';
import { sum } from 'ramda';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { handleError } from '../../helpers';
import { checkoutMessages, codeMessages, commonMessages } from '../../helpers/translation';
import { useCouponCollection } from '../../hooks/data';
import { useAuth } from '../auth/AuthContext';
import CouponCard from './CouponCard';
var CouponSelectionModal = function (_a) {
    var memberId = _a.memberId, orderProducts = _a.orderProducts, orderDiscounts = _a.orderDiscounts, onSelect = _a.onSelect, render = _a.render;
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), authToken = _b.authToken, backendEndpoint = _b.backendEndpoint;
    var _c = useCouponCollection(memberId), coupons = _c.coupons, loadingCoupons = _c.loadingCoupons, refetchCoupons = _c.refetchCoupons;
    var _d = useState(''), code = _d[0], setCode = _d[1];
    var _e = useState(false), visible = _e[0], setVisible = _e[1];
    var _f = useState(false), inserting = _f[0], setInserting = _f[1];
    var _g = useState(), selectedCoupon = _g[0], setSelectedCoupon = _g[1];
    var handleCouponInsert = function () {
        setInserting(true);
        axios
            .post(backendEndpoint + "/payment/exchange", {
            code: code,
            type: 'Coupon',
        }, {
            headers: { authorization: "Bearer " + authToken },
        })
            .then(function (_a) {
            var data = _a.data;
            if (data.code === 'SUCCESS') {
                refetchCoupons();
                setCode('');
                message.success(formatMessage(codeMessages[data.code]));
            }
            else {
                message.error(formatMessage(codeMessages[data.code]));
            }
        })
            .catch(handleError)
            .finally(function () { return setInserting(false); });
    };
    return (React.createElement(React.Fragment, null,
        render && render({ setVisible: setVisible, selectedCoupon: selectedCoupon }),
        React.createElement(Modal, { title: formatMessage(checkoutMessages.title.chooseCoupon), footer: null, onCancel: function () { return setVisible(false); }, visible: visible },
            loadingCoupons ? (React.createElement(Spin, null)) : (coupons
                .filter(function (coupon) { return !coupon.status.outdated && !coupon.status.used; })
                .map(function (coupon) {
                var couponPlanScope = coupon.couponCode.couponPlan.scope;
                var couponPlanProductIds = coupon.couponCode.couponPlan.productIds || [];
                var isInCouponScope = function (productId) {
                    var productType = productId.split('_')[0];
                    return (couponPlanScope === null ||
                        couponPlanScope.includes(productType) ||
                        couponPlanProductIds.includes(productId));
                };
                var filteredOrderProducts = orderProducts.filter(function (orderProduct) {
                    return isInCouponScope(orderProduct.productId);
                });
                var filteredOrderDiscounts = orderDiscounts.filter(function (orderDiscount) { return orderDiscount.type === 'DownPrice'; });
                var price = sum(filteredOrderProducts.map(function (orderProduct) { return orderProduct.price; })) -
                    sum(filteredOrderDiscounts.map(function (orderDiscount) { return orderDiscount.price; }));
                return coupon.couponCode.couponPlan.constraint <= price ? (React.createElement(CouponCard, { key: coupon.id, coupon: coupon, onClick: function () {
                        onSelect && onSelect(coupon);
                        setSelectedCoupon(coupon);
                        setVisible(false);
                    }, style: { cursor: 'pointer', marginBottom: '12px' } })) : (React.createElement(CouponCard, { key: coupon.id, coupon: coupon, style: { userSelect: 'none', cursor: 'not-allowed', marginBottom: '12px', color: '#9b9b9b' } }));
            })),
            React.createElement(Divider, null, formatMessage(commonMessages.defaults.or)),
            React.createElement("div", { className: "d-flex" },
                React.createElement("div", { className: "flex-grow-1" },
                    React.createElement(Input, { style: { borderRadius: '4px 0px 0px 4px' }, placeholder: formatMessage(checkoutMessages.form.placeholder.enter), value: code, onChange: function (e) { return setCode(e.target.value); } })),
                React.createElement(Button, { block: true, type: "primary", style: { width: '72px', borderRadius: '0px 4px 4px 0px' }, loading: inserting, onClick: handleCouponInsert }, formatMessage(commonMessages.button.add))))));
};
export default CouponSelectionModal;
//# sourceMappingURL=CouponSelectionModal.js.map
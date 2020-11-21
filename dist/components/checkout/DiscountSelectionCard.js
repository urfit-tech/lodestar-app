var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Radio } from 'antd';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { checkoutMessages, commonMessages } from '../../helpers/translation';
import { useEnrolledMembershipCardIds } from '../../hooks/card';
import { useAuth } from '../auth/AuthContext';
import { AuthModalContext } from '../auth/AuthModal';
import CouponSelectionModal from './CouponSelectionModal';
import MembershipCardSelectionModal from './MembershipCardSelectionModal';
var StyledRadio = styled(Radio)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    display: block;\n    height: 3rem;\n    line-height: 3rem;\n  }\n"], ["\n  && {\n    display: block;\n    height: 3rem;\n    line-height: 3rem;\n  }\n"])));
var DiscountSelectionCard = function (_a) {
    var discountId = _a.value, check = _a.check, onChange = _a.onChange;
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var setAuthModalVisible = useContext(AuthModalContext).setVisible;
    var enrolledMembershipCardIds = useEnrolledMembershipCardIds(currentMemberId || '').enrolledMembershipCardIds;
    var _b = (discountId === null || discountId === void 0 ? void 0 : discountId.split('_')) || [null, null], discountType = _b[0], discountTarget = _b[1];
    return (React.createElement(Radio.Group, { style: { width: '100%' }, value: discountType || 'None', onChange: function (e) { return onChange && onChange(e.target.value); } },
        React.createElement(StyledRadio, { value: "None" }, formatMessage(checkoutMessages.form.radio.noDiscount)),
        React.createElement(StyledRadio, { value: "Coupon" },
            React.createElement("span", null, formatMessage(checkoutMessages.form.radio.useCoupon)),
            discountType === 'Coupon' && (React.createElement("span", { className: "ml-2" }, currentMemberId ? (React.createElement(CouponSelectionModal, { memberId: currentMemberId, orderProducts: (check === null || check === void 0 ? void 0 : check.orderProducts) || [], orderDiscounts: (check === null || check === void 0 ? void 0 : check.orderDiscounts) || [], onSelect: function (coupon) {
                    onChange && onChange("Coupon_" + coupon.id);
                }, render: function (_a) {
                    var setVisible = _a.setVisible, selectedCoupon = _a.selectedCoupon;
                    return (React.createElement(React.Fragment, null,
                        React.createElement(Button, { onClick: function () { return setVisible(true); } }, discountTarget
                            ? formatMessage(commonMessages.button.reselectCoupon)
                            : formatMessage(commonMessages.button.chooseCoupon)),
                        selectedCoupon && React.createElement("span", { className: "ml-3" }, selectedCoupon.couponCode.couponPlan.title)));
                } })) : (React.createElement(Button, { onClick: function () { return setAuthModalVisible && setAuthModalVisible(true); } }, formatMessage(commonMessages.button.chooseCoupon)))))),
        enrolledMembershipCardIds.length > 0 && (React.createElement(StyledRadio, { value: "Card" },
            React.createElement("span", null, formatMessage(checkoutMessages.content.useMemberCard)),
            discountType === 'Card' && (React.createElement("span", { className: "ml-2" }, currentMemberId ? (React.createElement(MembershipCardSelectionModal, { memberId: currentMemberId, onSelect: function (membershipCardId) {
                    onChange && onChange("Card_" + membershipCardId);
                }, render: function (_a) {
                    var setVisible = _a.setVisible, selectedMembershipCard = _a.selectedMembershipCard;
                    return (React.createElement(React.Fragment, null,
                        React.createElement(Button, { onClick: function () { return setVisible(true); } }, discountTarget
                            ? formatMessage(commonMessages.button.reselectCoupon)
                            : formatMessage(checkoutMessages.title.chooseMemberCard)),
                        selectedMembershipCard && React.createElement("span", { className: "ml-3" }, selectedMembershipCard.title)));
                } })) : null))))));
};
export default DiscountSelectionCard;
var templateObject_1;
//# sourceMappingURL=DiscountSelectionCard.js.map
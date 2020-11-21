var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Divider } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { dateFormatter } from '../../helpers';
import { checkoutMessages, commonMessages } from '../../helpers/translation';
import AdminCard from '../common/AdminCard';
import PriceLabel from '../common/PriceLabel';
import CouponDescriptionModal from './CouponDescriptionModal';
var StyledAdminCard = styled(AdminCard)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  &::before {\n    content: ' ';\n    position: absolute;\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    background-color: #f7f8f8;\n    top: 50%;\n    transform: translateY(-50%);\n    left: -10px;\n    z-index: 999;\n    box-shadow: inset rgba(0, 0, 0, 0.06) -1px 0px 5px 0px;\n  }\n  &::after {\n    content: ' ';\n    position: absolute;\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    background-color: #f7f8f8;\n    top: 50%;\n    transform: translateY(-50%);\n    right: -10px;\n    z-index: 999;\n    box-shadow: inset rgba(0, 0, 0, 0.06) 4px 0px 5px 0px;\n  }\n  .ant-card-head {\n    border-bottom: 0;\n  }\n  .ant-card-head-title {\n    padding: 0;\n  }\n  .ant-card-body {\n    padding: 14px 28px 17px 28px;\n  }\n  .ant-card-bordered {\n    border-radius: 0px;\n  }\n"], ["\n  position: relative;\n  &::before {\n    content: ' ';\n    position: absolute;\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    background-color: #f7f8f8;\n    top: 50%;\n    transform: translateY(-50%);\n    left: -10px;\n    z-index: 999;\n    box-shadow: inset rgba(0, 0, 0, 0.06) -1px 0px 5px 0px;\n  }\n  &::after {\n    content: ' ';\n    position: absolute;\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    background-color: #f7f8f8;\n    top: 50%;\n    transform: translateY(-50%);\n    right: -10px;\n    z-index: 999;\n    box-shadow: inset rgba(0, 0, 0, 0.06) 4px 0px 5px 0px;\n  }\n  .ant-card-head {\n    border-bottom: 0;\n  }\n  .ant-card-head-title {\n    padding: 0;\n  }\n  .ant-card-body {\n    padding: 14px 28px 17px 28px;\n  }\n  .ant-card-bordered {\n    border-radius: 0px;\n  }\n"])));
var StyledTitle = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: -webkit-box;\n  height: 3.25rem;\n  line-height: 1.3;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  letter-spacing: 0.77px;\n  font-size: 20px;\n  font-weight: bold;\n  overflow: hidden;\n  white-space: break-spaces;\n"], ["\n  display: -webkit-box;\n  height: 3.25rem;\n  line-height: 1.3;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  letter-spacing: 0.77px;\n  font-size: 20px;\n  font-weight: bold;\n  overflow: hidden;\n  white-space: break-spaces;\n"])));
var StyledPriceLabel = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 24px;\n  letter-spacing: 0.2px;\n"], ["\n  color: ", ";\n  font-size: 24px;\n  letter-spacing: 0.2px;\n"])), function (props) { return (props.outdated ? 'var(--gray)' : props.theme['@primary-color']); });
var StyledText = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 2px 6px;\n  color: ", ";\n  background-color: ", ";\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.4px;\n"], ["\n  padding: 2px 6px;\n  color: ", ";\n  background-color: ", ";\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.4px;\n"])), function (props) { return (props.outdated ? 'var(--gray-dark)' : props.theme['@primary-color']); }, function (props) { return (props.outdated ? 'var(--gray-lighter)' : props.theme['@processing-color']); });
var CouponAdminCard = function (_a) {
    var coupon = _a.coupon, outdated = _a.outdated;
    var formatMessage = useIntl().formatMessage;
    var _b = useState(false), visible = _b[0], setVisible = _b[1];
    return (React.createElement(StyledAdminCard, { title: React.createElement("div", { className: "d-flex align-items-start justify-content-between py-4" },
            React.createElement(StyledTitle, null, coupon.couponCode.couponPlan.title),
            React.createElement(StyledPriceLabel, { className: "ml-4", outdated: outdated }, coupon.couponCode.couponPlan.type === 'cash' ? (React.createElement(PriceLabel, { listPrice: coupon.couponCode.couponPlan.amount })) : coupon.couponCode.couponPlan.type === 'percent' ? (coupon.couponCode.couponPlan.amount % 10 === 0 ? (10 - coupon.couponCode.couponPlan.amount / 10 + " " + formatMessage(commonMessages.unit.off)) : (100 - coupon.couponCode.couponPlan.amount + " " + formatMessage(commonMessages.unit.off))) : null)) },
        React.createElement(StyledText, { outdated: outdated },
            coupon.couponCode.couponPlan.constraint
                ? formatMessage(checkoutMessages.coupon.full, {
                    amount: React.createElement(PriceLabel, { listPrice: coupon.couponCode.couponPlan.constraint }),
                })
                : formatMessage(checkoutMessages.content.discountDirectly),
            coupon.couponCode.couponPlan.type === 'cash'
                ? formatMessage(checkoutMessages.coupon.amount, {
                    amount: React.createElement(PriceLabel, { listPrice: coupon.couponCode.couponPlan.amount }),
                })
                : coupon.couponCode.couponPlan.type === 'percent'
                    ? formatMessage(checkoutMessages.coupon.proportion, {
                        amount: coupon.couponCode.couponPlan.amount,
                    })
                    : null),
        React.createElement("div", { style: { fontFamily: 'Roboto', fontSize: '14px', paddingTop: '12px' } },
            coupon.couponCode.couponPlan.startedAt
                ? dateFormatter(coupon.couponCode.couponPlan.startedAt)
                : formatMessage(checkoutMessages.coupon.fromNow),
            ' ~ ',
            coupon.couponCode.couponPlan.endedAt
                ? dateFormatter(coupon.couponCode.couponPlan.endedAt)
                : formatMessage(checkoutMessages.coupon.noPeriod)),
        React.createElement(Divider, { className: "my-3" }),
        React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
            React.createElement(Button, { type: "link", onClick: function () { return setVisible(true); }, style: {
                    fontSize: '14px',
                    padding: 0,
                    letterSpacing: '-1px',
                    height: 'auto',
                } }, formatMessage(commonMessages.button.details)),
            React.createElement(CouponDescriptionModal, { coupon: coupon, visible: visible, onCancel: function () { return setVisible(false); } }))));
};
export default CouponAdminCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=CouponAdminCard.js.map
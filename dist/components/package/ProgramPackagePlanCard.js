var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Divider } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CheckoutProductModal from '../../containers/checkout/CheckoutProductModal';
import { commonMessages, productMessages } from '../../helpers/translation';
import { useMember } from '../../hooks/member';
import { useAuth } from '../auth/AuthContext';
import PriceLabel from '../common/PriceLabel';
import { BraftContent } from '../common/StyledBraftEditor';
var StyledCard = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1.5rem;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n"], ["\n  padding: 1.5rem;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n"])));
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n"], ["\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n"])));
var StyledHighlight = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n  letter-spacing: 0.18px;\n"], ["\n  color: ", ";\n  font-size: 14px;\n  letter-spacing: 0.18px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledEnrollment = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--black-45);\n  text-align: right;\n  font-size: 14px;\n  letter-spacing: 0.18px;\n"], ["\n  color: var(--black-45);\n  text-align: right;\n  font-size: 14px;\n  letter-spacing: 0.18px;\n"])));
var ProgramPackagePlanCard = function (_a) {
    var id = _a.id, title = _a.title, description = _a.description, isSubscription = _a.isSubscription, isParticipantsVisible = _a.isParticipantsVisible, periodAmount = _a.periodAmount, periodType = _a.periodType, listPrice = _a.listPrice, salePrice = _a.salePrice, soldAt = _a.soldAt, discountDownPrice = _a.discountDownPrice, enrollmentCount = _a.enrollmentCount, programPackageId = _a.programPackageId, loading = _a.loading, isEnrolled = _a.isEnrolled;
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var member = useMember(currentMemberId || '').member;
    var isOnSale = soldAt ? Date.now() < soldAt.getTime() : false;
    return (React.createElement(StyledCard, null,
        React.createElement(StyledTitle, { className: "mb-3" }, title),
        React.createElement(PriceLabel, { variant: "full-detail", listPrice: listPrice, salePrice: isOnSale ? salePrice : undefined, downPrice: discountDownPrice, periodType: isSubscription ? periodType : undefined, periodAmount: isSubscription ? periodAmount : undefined }),
        React.createElement(Divider, { className: "my-3" }),
        !isSubscription && (React.createElement(StyledHighlight, { className: "mb-3" }, formatMessage(productMessages.programPackage.label.availableForLimitTime, {
            amount: periodAmount,
            unit: periodType === 'D'
                ? formatMessage(commonMessages.unit.day)
                : periodType === 'W'
                    ? formatMessage(commonMessages.unit.week)
                    : periodType === 'M'
                        ? formatMessage(commonMessages.unit.monthWithQuantifier)
                        : periodType === 'Y'
                            ? formatMessage(commonMessages.unit.year)
                            : formatMessage(commonMessages.unknown.period),
        }))),
        React.createElement("div", { className: "mb-3" },
            React.createElement(BraftContent, null, description)),
        isParticipantsVisible && (React.createElement(StyledEnrollment, { className: "mb-3" },
            React.createElement("span", { className: "mr-2" }, enrollmentCount || 0),
            React.createElement("span", null, formatMessage(commonMessages.unit.people)))),
        React.createElement("div", null, isEnrolled ? (React.createElement(Link, { to: "/program-packages/" + programPackageId + "/contents" },
            React.createElement(Button, { block: true }, formatMessage(commonMessages.button.enter)))) : (React.createElement(CheckoutProductModal, { renderTrigger: function (_a) {
                var setVisible = _a.setVisible;
                return (React.createElement(Button, { type: "primary", onClick: function () { return setVisible(); }, loading: loading, block: true }, isSubscription
                    ? formatMessage(commonMessages.button.subscribeNow)
                    : formatMessage(commonMessages.button.purchase)));
            }, paymentType: isSubscription ? 'subscription' : 'perpetual', defaultProductId: "ProgramPackagePlan_" + id, member: member })))));
};
export default ProgramPackagePlanCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=ProgramPackagePlanCard.js.map
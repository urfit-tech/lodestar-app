var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button } from 'antd';
import React, { useContext } from 'react';
import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import CheckoutProductModal from '../../containers/checkout/CheckoutProductModal';
import { useApp } from '../../containers/common/AppContext';
import CartContext from '../../contexts/CartContext';
import { commonMessages } from '../../helpers/translation';
import { useMember } from '../../hooks/member';
import EmptyCover from '../../images/empty-cover.png';
import { useAuth } from '../auth/AuthContext';
import { AuthModalContext } from '../auth/AuthModal';
import PriceLabel from '../common/PriceLabel';
import ShortenPeriodTypeLabel from '../common/ShortenPeriodTypeLabel';
import { BraftContent } from '../common/StyledBraftEditor';
var messages = defineMessages({
    limited: { id: 'product.project.text.limited', defaultMessage: '限量' },
    participants: { id: 'product.project.text.participants', defaultMessage: '參與者' },
    availableForLimitTime: {
        id: 'common.label.availableForLimitTime',
        defaultMessage: '可觀看 {amount} {unit}',
    },
});
var StyledButton = styled(Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    margin-top: 20px;\n    width: 100%;\n  }\n"], ["\n  && {\n    margin-top: 20px;\n    width: 100%;\n  }\n"])));
var StyledWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background: white;\n  overflow: hidden;\n  border-radius: 4px;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);\n  transition: box-shadow 0.2s ease-in-out;\n"], ["\n  background: white;\n  overflow: hidden;\n  border-radius: 4px;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);\n  transition: box-shadow 0.2s ease-in-out;\n"])));
var CoverImage = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding-top: calc(100% / 3);\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"], ["\n  padding-top: calc(100% / 3);\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"])), function (props) { return props.src; });
var StyledTitle = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledPeriod = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), function (props) { return props.theme['@primary-color']; });
var StyledDescription = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.18px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.18px;\n"])));
var StyledProjectPlanInfo = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: inline-block;\n  border-radius: 4px;\n  background: ", ";\n\n  .wrapper {\n    padding: 10px 0;\n    line-height: 12px;\n\n    div {\n    }\n  }\n"], ["\n  display: inline-block;\n  border-radius: 4px;\n  background: ", ";\n\n  .wrapper {\n    padding: 10px 0;\n    line-height: 12px;\n\n    div {\n    }\n  }\n"])), function (props) { return (props.active ? props.theme['@primary-color'] + "19" : 'var(--gray-lighter)'); });
var StyledProjectPlanInfoWrapper = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  padding: 10px 0;\n  line-height: 12px;\n"], ["\n  padding: 10px 0;\n  line-height: 12px;\n"])));
var StyledProjectPlanInfoBlock = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  display: inline-block;\n  line-height: 1;\n  font-size: 12px;\n  letter-spacing: 0.15px;\n  color: ", ";\n  padding: 0 10px;\n\n  &:last-child:not(:first-child) {\n    border-left: 1px solid ", ";\n  }\n"], ["\n  display: inline-block;\n  line-height: 1;\n  font-size: 12px;\n  letter-spacing: 0.15px;\n  color: ", ";\n  padding: 0 10px;\n\n  &:last-child:not(:first-child) {\n    border-left: 1px solid ", ";\n  }\n"])), function (props) { return (props.active ? "" + props.theme['@primary-color'] : 'var(--gray-dark)'); }, function (props) { return (props.active ? "" + props.theme['@primary-color'] : 'var(--gray-dark)'); });
var ProjectPlanCard = function (_a) {
    var id = _a.id, projectTitle = _a.projectTitle, coverUrl = _a.coverUrl, title = _a.title, description = _a.description, listPrice = _a.listPrice, salePrice = _a.salePrice, soldAt = _a.soldAt, discountDownPrice = _a.discountDownPrice, isSubscription = _a.isSubscription, periodAmount = _a.periodAmount, periodType = _a.periodType, isEnrolled = _a.isEnrolled, isExpired = _a.isExpired, isParticipantsVisible = _a.isParticipantsVisible, isPhysical = _a.isPhysical, isLimited = _a.isLimited, buyableQuantity = _a.buyableQuantity, projectPlanEnrollmentCount = _a.projectPlanEnrollmentCount;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(StyledWrapper, null,
        React.createElement(CoverImage, { src: coverUrl || EmptyCover }),
        React.createElement("div", { className: "p-4" },
            React.createElement(StyledTitle, { className: "mb-3" }, title),
            React.createElement("div", { className: "mb-3" },
                React.createElement(PriceLabel, { variant: "full-detail", listPrice: listPrice, salePrice: ((soldAt === null || soldAt === void 0 ? void 0 : soldAt.getTime()) || 0) > Date.now() ? salePrice : undefined, downPrice: isSubscription && discountDownPrice > 0 ? discountDownPrice : undefined, periodAmount: periodAmount, periodType: periodType ? periodType : undefined })),
            !isSubscription && periodType && (React.createElement(StyledPeriod, { className: "mb-3" }, formatMessage(messages.availableForLimitTime, {
                amount: periodAmount || 1,
                unit: React.createElement(ShortenPeriodTypeLabel, { periodType: periodType, withQuantifier: true }),
            }))),
            (isLimited || isParticipantsVisible) && (React.createElement(StyledProjectPlanInfo, { className: "mb-4", active: !isExpired && (!isLimited || Boolean(buyableQuantity && buyableQuantity > 0)) },
                React.createElement(StyledProjectPlanInfoWrapper, null, isParticipantsVisible && (React.createElement(StyledProjectPlanInfoBlock, { active: !isExpired && (!isLimited || Boolean(buyableQuantity && buyableQuantity > 0)) }, formatMessage(messages.participants) + " " + projectPlanEnrollmentCount))))),
            React.createElement(StyledDescription, { className: "mb-4" },
                React.createElement(BraftContent, null, description)),
            React.createElement("div", null, isExpired ? (React.createElement("span", null, formatMessage(commonMessages.status.finished))) : isLimited && !buyableQuantity ? (React.createElement("span", null, formatMessage(commonMessages.button.soldOut))) : isEnrolled === false ? (isSubscription ? (React.createElement(SubscriptionPlanBlock, { projectPlanId: id, projectTitle: projectTitle, title: title, isPhysical: isPhysical, listPrice: listPrice, salePrice: salePrice })) : (React.createElement(PerpetualPlanBlock, { projectPlanId: id, projectTitle: projectTitle, title: title, isPhysical: isPhysical, listPrice: listPrice, salePrice: salePrice }))) : null))));
};
var PerpetualPlanBlock = function (_a) {
    var projectPlanId = _a.projectPlanId, projectTitle = _a.projectTitle, title = _a.title, listPrice = _a.listPrice, salePrice = _a.salePrice, isPhysical = _a.isPhysical;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var sharingCode = useQueryParam('sharing', StringParam)[0];
    var settings = useApp().settings;
    var _b = useContext(CartContext), addCartProduct = _b.addCartProduct, isProductInCart = _b.isProductInCart;
    return (isProductInCart === null || isProductInCart === void 0 ? void 0 : isProductInCart('ProjectPlan', projectPlanId)) ? (React.createElement(StyledButton, { type: "primary", size: "large", onClick: function () {
            history.push("/cart");
        } },
        React.createElement("span", null, formatMessage(commonMessages.button.cart)))) : (React.createElement(StyledButton, { type: "primary", size: "large", onClick: function () {
            if (settings['tracking.fb_pixel_id']) {
                ReactPixel.track('AddToCart', {
                    value: typeof salePrice === 'number' ? salePrice : listPrice,
                    currency: 'TWD',
                });
            }
            if (settings['tracking.ga_id']) {
                ReactGA.plugin.execute('ec', 'addProduct', {
                    id: projectPlanId,
                    name: projectTitle + " - " + title,
                    category: 'ProjectPlan',
                    price: "" + listPrice,
                    quantity: '1',
                    currency: 'TWD',
                });
                ReactGA.plugin.execute('ec', 'setAction', 'add');
                ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart');
            }
            addCartProduct === null || addCartProduct === void 0 ? void 0 : addCartProduct('ProjectPlan', projectPlanId, {
                quantity: 1,
                sharingCode: sharingCode,
            }).then(function () { return history.push("/cart?type=funding"); });
        } },
        React.createElement("span", null, formatMessage(commonMessages.button.join))));
};
var SubscriptionPlanBlock = function (_a) {
    var projectPlanId = _a.projectPlanId, projectTitle = _a.projectTitle, title = _a.title, listPrice = _a.listPrice, salePrice = _a.salePrice, isPhysical = _a.isPhysical;
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), currentMemberId = _b.currentMemberId, isAuthenticated = _b.isAuthenticated;
    var settings = useApp().settings;
    var setAuthModalVisible = useContext(AuthModalContext).setVisible;
    var member = useMember(currentMemberId || '').member;
    if (!isAuthenticated) {
        return (React.createElement(StyledButton, { type: "primary", size: "large", onClick: function () { return setAuthModalVisible && setAuthModalVisible(true); } },
            React.createElement("span", null, formatMessage(commonMessages.button.join))));
    }
    return (React.createElement(CheckoutProductModal, { renderTrigger: function (_a) {
            var setVisible = _a.setVisible;
            return (React.createElement(StyledButton, { type: "primary", size: "large", onClick: function () {
                    settings['tracking.fb_pixel_id'] &&
                        ReactPixel.track('AddToCart', {
                            value: typeof salePrice === 'number' ? salePrice : listPrice,
                            currency: 'TWD',
                        });
                    if (settings['tracking.ga_id']) {
                        ReactGA.plugin.execute('ec', 'addProduct', {
                            id: projectPlanId,
                            name: projectTitle + " - " + title,
                            category: 'ProjectPlan',
                            price: "" + listPrice,
                            quantity: '1',
                            currency: 'TWD',
                        });
                        ReactGA.plugin.execute('ec', 'setAction', 'add');
                        ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart');
                    }
                    setVisible();
                } },
                React.createElement("span", null, formatMessage(commonMessages.button.join))));
        }, paymentType: "subscription", defaultProductId: "ProjectPlan_" + projectPlanId, isProductPhysical: isPhysical, member: member }));
};
export default ProjectPlanCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=ProjectPlanCard.js.map
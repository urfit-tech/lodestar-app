var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Dropdown, Icon, Menu, Select } from 'antd';
import { max, min } from 'lodash';
import { repeat } from 'ramda';
import React, { useContext, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import CartContext from '../../contexts/CartContext';
import { desktopViewMixin } from '../../helpers';
import { commonMessages, voucherMessages } from '../../helpers/translation';
import EmptyCover from '../../images/empty-cover.png';
import CountDownTimeBlock from '../common/CountDownTimeBlock';
import { CustomRatioImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
import QuantityInput from '../common/QuantityInput';
import { BREAK_POINT } from '../common/Responsive';
import ShippingMethodLabel from '../common/ShippingMethodLabel';
import { BraftContent } from '../common/StyledBraftEditor';
import MerchandisePaymentButton from './MerchandisePaymentButton';
var messages = defineMessages({
    specification: { id: 'product.merchandise.ui.specification', defaultMessage: '規格' },
    fare: { id: 'product.merchandise.ui.fare', defaultMessage: '運費' },
    shippingInDays: { id: 'merchandise.label.shippingInDays', defaultMessage: '到貨約 {days} 天' },
    remain: { id: 'product.merchandise.ui.remain', defaultMessage: '剩餘' },
});
var StyledThumbnailTrack = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  overflow: hidden;\n\n  > div {\n    white-space: nowrap;\n    transition: transform 0.2s ease-in-out;\n    transform: translateX(calc(", " * -25%));\n  }\n\n  ", "\n"], ["\n  overflow: hidden;\n\n  > div {\n    white-space: nowrap;\n    transition: transform 0.2s ease-in-out;\n    transform: translateX(calc(", " * -25%));\n  }\n\n  ",
    "\n"])), function (props) { return (props.page < 2 ? 0 : -2 + props.page); }, function (props) {
    return desktopViewMixin(css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      > div {\n        transform: translateX(calc(", " * -20%));\n      }\n    "], ["\n      > div {\n        transform: translateX(calc(", " * -20%));\n      }\n    "])), props.page < 3 ? 0 : -3 + props.page));
});
var StyledThumbnailBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: inline-block;\n  padding: 0.5rem;\n  width: 25%;\n\n  ", "\n"], ["\n  display: inline-block;\n  padding: 0.5rem;\n  width: 25%;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    width: 20%;\n  "], ["\n    width: 20%;\n  "])))));
var StyledTag = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.4px;\n"], ["\n  color: ", ";\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.4px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledTitle = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledInfo = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  line-height: 1.5;\n"], ["\n  color: var(--gray-darker);\n  line-height: 1.5;\n"])));
var StyledInfoText = styled.span(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n"])));
var StyledAbstract = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  white-space: pre-wrap;\n"], ["\n  white-space: pre-wrap;\n"])));
var StyledButton = styled(Button)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  color: var(--gray-darker);\n"], ["\n  color: var(--gray-darker);\n"])));
var StyledMenu = styled(Menu)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  width: 15rem;\n"], ["\n  width: 15rem;\n"])));
var StyledMenuItem = styled(Menu.Item)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  .duration {\n    font-size: 12px;\n    font-weight: 500;\n    letter-spacing: 0.6px;\n    color: var(--gray-dark);\n  }\n"], ["\n  .duration {\n    font-size: 12px;\n    font-weight: 500;\n    letter-spacing: 0.6px;\n    color: var(--gray-dark);\n  }\n"])));
var StyledButtonBlock = styled.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  @media (max-width: ", "px) {\n    padding: 0.75rem 2rem;\n    position: fixed;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    background: white;\n  }\n"], ["\n  @media (max-width: ", "px) {\n    padding: 0.75rem 2rem;\n    position: fixed;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    background: white;\n  }\n"])), BREAK_POINT - 1);
var StyledDescription = styled.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  padding-bottom: 4rem;\n\n  ", "\n"], ["\n  padding-bottom: 4rem;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n    max-height: 18rem;\n    padding-right: 1rem;\n    padding-bottom: 0;\n    overflow: auto;\n  "], ["\n    max-height: 18rem;\n    padding-right: 1rem;\n    padding-bottom: 0;\n    overflow: auto;\n  "])))));
var MerchandiseBlock = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var merchandise = _a.merchandise, withPaymentButton = _a.withPaymentButton, showDescription = _a.showDescription;
    var formatMessage = useIntl().formatMessage;
    var getCartProduct = useContext(CartContext).getCartProduct;
    var _h = useState(0), imageIndex = _h[0], setImageIndex = _h[1];
    var _j = useState(merchandise.specs[0]), selectedSpec = _j[0], setSelectedSpec = _j[1];
    var _k = useState(1), quantity = _k[0], setQuantity = _k[1];
    var inCartQuantity = ((_c = (_b = getCartProduct === null || getCartProduct === void 0 ? void 0 : getCartProduct("MerchandiseSpec_" + selectedSpec.id)) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.quantity) || 0;
    var remainQuantity = (selectedSpec.buyableQuantity || 0) - inCartQuantity;
    return (React.createElement("div", { className: "row justify-content-between" },
        React.createElement("div", { className: "col-12 col-lg-4 mb-5 mb-lg-0" }, merchandise.images && merchandise.images.length > 0 ? (React.createElement(React.Fragment, null,
            React.createElement(CustomRatioImage, { width: "100%", ratio: 1, src: ((_d = merchandise.images[imageIndex % merchandise.images.length]) === null || _d === void 0 ? void 0 : _d.url) || EmptyCover, className: "mb-4", shape: "rounded" }),
            React.createElement(StyledThumbnailTrack, { page: imageIndex },
                React.createElement("div", null, repeat(merchandise.images, merchandise.images.length < 5 ? 1 : Math.ceil((imageIndex + 1) / merchandise.images.length) + 1)
                    .flat()
                    .map(function (image, index) { return (React.createElement(StyledThumbnailBlock, { key: image.url + "_" + index },
                    React.createElement(CustomRatioImage, { width: "100%", ratio: 1, src: image.url, shape: "rounded", className: "cursor-pointer", onClick: function () { return setImageIndex(index); } }))); }))))) : (React.createElement(CustomRatioImage, { width: "100%", ratio: 1, src: EmptyCover, className: "mb-4", shape: "rounded" }))),
        React.createElement("div", { className: "col-12 col-lg-7" },
            React.createElement("div", { className: "mb-1" }, (_e = merchandise.tags) === null || _e === void 0 ? void 0 : _e.map(function (tag) { return (React.createElement(Link, { key: tag, to: "/merchandises?tag=" + tag, className: "mr-2" },
                React.createElement(StyledTag, { key: tag },
                    "#",
                    tag))); })),
            React.createElement(StyledTitle, null, merchandise.title),
            React.createElement("div", { className: "mb-4" },
                React.createElement(PriceLabel, { variant: "inline", listPrice: selectedSpec.listPrice, salePrice: (((_f = merchandise.soldAt) === null || _f === void 0 ? void 0 : _f.getTime()) || 0) > Date.now() ? selectedSpec.salePrice : undefined })),
            merchandise.isCountdownTimerVisible && merchandise.soldAt && merchandise.soldAt.getTime() > Date.now() && (React.createElement("div", { className: "mb-3" },
                React.createElement(CountDownTimeBlock, { expiredAt: merchandise.soldAt, icon: true }))),
            merchandise.abstract && (React.createElement(StyledAbstract, { className: "mb-4" },
                React.createElement("div", null, merchandise.abstract))),
            merchandise.isPhysical && ((_g = merchandise.memberShop) === null || _g === void 0 ? void 0 : _g.shippingMethods) && (React.createElement(StyledInfo, { className: "mb-4" },
                React.createElement("div", { className: "mr-4 d-inline-block" }, formatMessage(messages.fare)),
                React.createElement(Dropdown, { trigger: ['click'], overlay: React.createElement(StyledMenu, null, merchandise.memberShop.shippingMethods.map(function (shippingMethod) { return (React.createElement(StyledMenuItem, { key: shippingMethod.id, className: "d-flex justify-content-between" },
                        React.createElement("div", { className: "d-flex flex-column" },
                            React.createElement("span", null,
                                React.createElement(ShippingMethodLabel, { shippingMethodId: shippingMethod.id })),
                            React.createElement(StyledInfoText, { className: "duration" }, formatMessage(messages.shippingInDays, { days: shippingMethod.days }))),
                        React.createElement("span", null,
                            React.createElement(PriceLabel, { listPrice: shippingMethod.fee })))); })) },
                    React.createElement(StyledButton, { type: "link" },
                        React.createElement("span", null,
                            React.createElement(PriceLabel, { listPrice: min(merchandise.memberShop.shippingMethods.map(function (shippingMethod) { return shippingMethod.fee; })) || 0 }),
                            ' ~ ',
                            React.createElement(PriceLabel, { listPrice: max(merchandise.memberShop.shippingMethods.map(function (shippingMethod) { return shippingMethod.fee; })) || 0 })),
                        React.createElement(Icon, { type: "down" }))))),
            React.createElement(StyledInfo, { className: "d-flex align-items-center mb-4" },
                React.createElement("div", { className: "d-inline-block mr-4 flex-shrink-0" }, formatMessage(messages.specification)),
                React.createElement("div", { className: "flex-grow-1" },
                    React.createElement(Select, { value: selectedSpec.id, onChange: function (value) {
                            var target = merchandise.specs.find(function (spec) { return spec.id === value; });
                            target && setSelectedSpec(target);
                        }, style: { width: '100%' } }, merchandise.specs.map(function (spec) { return (React.createElement(Select.Option, { key: spec.id, value: spec.id }, spec.title)); })))),
            merchandise.isPhysical && !merchandise.isCustomized && (React.createElement(StyledInfo, { className: "d-flex align-items-center mb-4" },
                React.createElement("div", { className: "mr-4 d-inline-block" }, formatMessage(voucherMessages.content.amount)),
                React.createElement(QuantityInput, { value: quantity, min: 0, max: remainQuantity, onChange: function (value) { return setQuantity(value || 0); } }),
                React.createElement("span", { className: "ml-3" },
                    formatMessage(messages.remain),
                    " ",
                    remainQuantity))),
            withPaymentButton ? (React.createElement(MerchandisePaymentButton, { merchandise: merchandise, merchandiseSpec: selectedSpec, quantity: quantity })) : (React.createElement(StyledButtonBlock, null,
                React.createElement(Link, { to: "/merchandises/" + merchandise.id },
                    React.createElement(StyledButton, { type: "primary" }, formatMessage(commonMessages.button.purchase))))),
            showDescription && (React.createElement(StyledDescription, null,
                React.createElement(BraftContent, null, merchandise.description))))));
};
export default MerchandiseBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
//# sourceMappingURL=MerchandiseBlock.js.map
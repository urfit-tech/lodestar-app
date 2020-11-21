var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import { Modal } from 'antd';
import BraftEditor from 'braft-editor';
import React from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import CheckIcon from '../../images/check.svg';
import PriceLabel from '../common/PriceLabel';
import ProductItem from '../common/ProductItem';
import { BraftContent } from '../common/StyledBraftEditor';
var messages = defineMessages({
    couponPlanCode: { id: 'promotion.label.couponPlanCode', defaultMessage: '折扣代碼' },
    rules: { id: 'promotion.label.rules', defaultMessage: '使用規則' },
    constraints: { id: 'promotion.text.constraints', defaultMessage: '消費滿 {total} 折抵 {discount}' },
    directly: { id: 'promotion.text.directly', defaultMessage: '直接折抵 {discount}' },
    discountTarget: { id: 'promotion.text.discountTarget', defaultMessage: '折抵項目' },
    description: { id: 'promotion.text.description', defaultMessage: '使用描述' },
    allScope: { id: 'common.product.allScope', defaultMessage: '全站折抵' },
    allProgram: { id: 'common.product.allProgram', defaultMessage: '全部單次課程' },
    allProgramPlan: { id: 'common.product.allProgramPlan', defaultMessage: '全部訂閱課程' },
    allActivityTicket: { id: 'common.product.allActivityTicket', defaultMessage: '全部線下實體' },
    allPodcastProgram: { id: 'common.product.allPodcastProgram', defaultMessage: '全部廣播' },
    allPodcastPlan: { id: 'common.product.allPodcastPlan', defaultMessage: '全部廣播訂閱頻道' },
    allAppointmentPlan: { id: 'common.product.allAppointmentPlan', defaultMessage: '全部預約' },
    allMerchandise: { id: 'common.product.allMerchandise', defaultMessage: '全部商品' },
    allProjectPlan: { id: 'common.product.allProjectPlan', defaultMessage: '全部專案' },
    allProgramPackagePlan: { id: 'common.product.allProgramPackagePlan', defaultMessage: '全部課程組合' },
    otherSpecificProduct: { id: 'common.product.otherSpecificProduct', defaultMessage: '其他特定項目' },
});
var StyledModal = styled(Modal)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n  .ant-modal-header {\n    border-bottom: 0px solid #e8e8e8;\n    padding: 24px 24px;\n  }\n  .ant-modal-title {\n    font-weight: bold;\n  }\n  .ant-modal-body {\n    font-size: 14px;\n    line-height: 1.57;\n    letter-spacing: 0.18px;\n    color: var(--gray-darker);\n  }\n  .ant-modal-close-x {\n    color: #9b9b9b;\n  }\n"], ["\n  color: ", ";\n  .ant-modal-header {\n    border-bottom: 0px solid #e8e8e8;\n    padding: 24px 24px;\n  }\n  .ant-modal-title {\n    font-weight: bold;\n  }\n  .ant-modal-body {\n    font-size: 14px;\n    line-height: 1.57;\n    letter-spacing: 0.18px;\n    color: var(--gray-darker);\n  }\n  .ant-modal-close-x {\n    color: #9b9b9b;\n  }\n"])), function (props) { return props.theme['@normal-color']; });
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n"], ["\n  margin-bottom: 0.75rem;\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n"])));
var CouponDescriptionModal = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var coupon = _a.coupon, modalProps = __rest(_a, ["coupon"]);
    var formatMessage = useIntl().formatMessage;
    var withDescription = !BraftEditor.createEditorState(coupon.couponCode.couponPlan.description || '').isEmpty();
    return (React.createElement(StyledModal, __assign({ title: null, footer: null }, modalProps),
        React.createElement(StyledTitle, null, coupon.couponCode.couponPlan.title),
        React.createElement("div", { className: "mb-4" }),
        React.createElement(StyledTitle, null, formatMessage(messages.rules)),
        React.createElement("div", { className: "mb-4" }, coupon.couponCode.couponPlan.constraint
            ? formatMessage(messages.constraints, {
                total: React.createElement(PriceLabel, { listPrice: coupon.couponCode.couponPlan.constraint }),
                discount: coupon.couponCode.couponPlan.type === 'cash' ? (React.createElement(PriceLabel, { listPrice: coupon.couponCode.couponPlan.amount })) : (coupon.couponCode.couponPlan.amount + "%"),
            })
            : formatMessage(messages.directly, {
                discount: coupon.couponCode.couponPlan.type === 'cash' ? (React.createElement(PriceLabel, { listPrice: coupon.couponCode.couponPlan.amount })) : (coupon.couponCode.couponPlan.amount + "%"),
            })),
        React.createElement(StyledTitle, null, formatMessage(messages.discountTarget)),
        React.createElement("div", { className: "mb-4" },
            coupon.couponCode.couponPlan.scope === null && React.createElement("div", null, formatMessage(messages.allScope)),
            ((_b = coupon.couponCode.couponPlan.scope) === null || _b === void 0 ? void 0 : _b.includes('Program')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allProgram)))),
            ((_c = coupon.couponCode.couponPlan.scope) === null || _c === void 0 ? void 0 : _c.includes('ProgramPlan')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allProgramPlan)))),
            ((_d = coupon.couponCode.couponPlan.scope) === null || _d === void 0 ? void 0 : _d.includes('ActivityTicket')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allActivityTicket)))),
            ((_e = coupon.couponCode.couponPlan.scope) === null || _e === void 0 ? void 0 : _e.includes('PodcastProgram')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allPodcastProgram)))),
            ((_f = coupon.couponCode.couponPlan.scope) === null || _f === void 0 ? void 0 : _f.includes('PodcastPlan')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allPodcastPlan)))),
            ((_g = coupon.couponCode.couponPlan.scope) === null || _g === void 0 ? void 0 : _g.includes('AppointmentPlan')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allAppointmentPlan)))),
            ((_h = coupon.couponCode.couponPlan.scope) === null || _h === void 0 ? void 0 : _h.includes('Merchandise')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allMerchandise)))),
            ((_j = coupon.couponCode.couponPlan.scope) === null || _j === void 0 ? void 0 : _j.includes('ProjectPlan')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allProjectPlan)))),
            ((_k = coupon.couponCode.couponPlan.scope) === null || _k === void 0 ? void 0 : _k.includes('ProgramPackagePlan')) && (React.createElement("div", { className: "mb-2" },
                React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.allProgramPackagePlan)))),
            coupon.couponCode.couponPlan.productIds && coupon.couponCode.couponPlan.productIds.length > 0 && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "mb-2" },
                    React.createElement(Icon, { src: CheckIcon, className: "mr-2" }),
                    React.createElement("span", null, formatMessage(messages.otherSpecificProduct))),
                React.createElement("div", { className: "pl-4" }, coupon.couponCode.couponPlan.productIds.map(function (productId) { return (React.createElement(ProductItem, { key: productId, id: productId, variant: "coupon-product" })); }))))),
        withDescription && (React.createElement(React.Fragment, null,
            React.createElement(StyledTitle, null, formatMessage(messages.description)),
            React.createElement(BraftContent, null, coupon.couponCode.couponPlan.description)))));
};
export default CouponDescriptionModal;
var templateObject_1, templateObject_2;
//# sourceMappingURL=CouponDescriptionModal.js.map
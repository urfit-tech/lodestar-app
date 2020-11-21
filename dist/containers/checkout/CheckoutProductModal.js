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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { Button, Divider, Form, Skeleton } from 'antd';
import { camelCase } from 'lodash';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';
import DiscountSelectionCard from '../../components/checkout/DiscountSelectionCard';
import InvoiceInput, { validateInvoice } from '../../components/checkout/InvoiceInput';
import ShippingInput, { validateShipping } from '../../components/checkout/ShippingInput';
import PriceLabel from '../../components/common/PriceLabel';
import ProductItem from '../../components/common/ProductItem';
import { notEmpty } from '../../helpers';
import { checkoutMessages, commonMessages } from '../../helpers/translation';
import { useCheck } from '../../hooks/checkout';
import { useUpdateMemberMetadata } from '../../hooks/member';
import { useApp } from '../common/AppContext';
import { StyledCheckoutBlock, StyledCheckoutPrice, StyledModal, StyledTitle, StyledWarningText, StyledWrapper, } from './CheckoutProductModal.styled';
var CheckoutProductItem = function (_a) {
    var name = _a.name, price = _a.price;
    var appCurrencyId = useApp().currencyId;
    return (React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
        React.createElement("span", { className: "flex-grow-1 mr-4" }, name),
        React.createElement("span", { className: "flex-shrink-0" },
            React.createElement(PriceLabel, { listPrice: price, currencyId: appCurrencyId }))));
};
var CheckoutProductModal = function (_a) {
    var _b, _c;
    var form = _a.form, renderTrigger = _a.renderTrigger, renderProductSelector = _a.renderProductSelector, paymentType = _a.paymentType, defaultProductId = _a.defaultProductId, isProductPhysical = _a.isProductPhysical, warningText = _a.warningText, startedAt = _a.startedAt, member = _a.member, shippingMethods = _a.shippingMethods, modalProps = __rest(_a, ["form", "renderTrigger", "renderProductSelector", "paymentType", "defaultProductId", "isProductPhysical", "warningText", "startedAt", "member", "shippingMethods"]);
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var sharingCode = useQueryParam('sharing', StringParam)[0];
    var updateMemberMetadata = useUpdateMemberMetadata();
    var _d = useState(false), isModalVisible = _d[0], setModalVisible = _d[1];
    // payment information
    var cachedPaymentInfor = {
        shipping: {
            name: '',
            phone: '',
            address: '',
            shippingMethod: 'home-delivery',
            specification: '',
            storeId: '',
            storeName: '',
        },
        invoice: {
            name: '',
            phone: '',
            email: (member === null || member === void 0 ? void 0 : member.email) || '',
        },
    };
    try {
        var cachedShipping = localStorage.getItem('kolable.cart.shipping');
        var cachedInvoice = localStorage.getItem('kolable.cart.invoice');
        cachedPaymentInfor.shipping = cachedShipping
            ? JSON.parse(cachedShipping)
            : __assign(__assign({}, cachedPaymentInfor.shipping), (_b = member === null || member === void 0 ? void 0 : member.metadata) === null || _b === void 0 ? void 0 : _b.shipping);
        cachedPaymentInfor.invoice = cachedInvoice
            ? JSON.parse(cachedInvoice).value
            : __assign(__assign({}, cachedPaymentInfor.invoice), (_c = member === null || member === void 0 ? void 0 : member.metadata) === null || _c === void 0 ? void 0 : _c.invoice);
    }
    catch (_e) { }
    var shippingRef = useRef(null);
    var invoiceRef = useRef(null);
    var _f = useState(cachedPaymentInfor.shipping), shipping = _f[0], setShipping = _f[1];
    var _g = useState(cachedPaymentInfor.invoice), invoice = _g[0], setInvoice = _g[1];
    var _h = useState(false), isValidating = _h[0], setIsValidating = _h[1];
    // checkout
    var _j = useState(defaultProductId || ''), productId = _j[0], setProductId = _j[1];
    var productIds = [productId].filter(notEmpty);
    var discountId = form.getFieldValue('discountId');
    var productOptions = {};
    productIds.forEach(function (productId) {
        productOptions[productId] = {
            startedAt: startedAt,
            from: window.location.pathname,
            sharingCode: sharingCode,
        };
    });
    var _k = useCheck(productIds, discountId, isProductPhysical
        ? shipping
        : productId.startsWith('MerchandiseSpec_')
            ? {
                address: member === null || member === void 0 ? void 0 : member.email,
            }
            : null, productOptions), check = _k.check, orderPlacing = _k.orderPlacing, orderChecking = _k.orderChecking, placeOrder = _k.placeOrder, totalPrice = _k.totalPrice;
    var handleSubmit = function () {
        form.validateFieldsAndScroll(function (errors) { return __awaiter(void 0, void 0, void 0, function () {
            var isValidShipping, isValidInvoice, taskId;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (errors || !member) {
                            return [2 /*return*/];
                        }
                        !isValidating && setIsValidating(true);
                        isValidShipping = !isProductPhysical || validateShipping(shipping);
                        isValidInvoice = validateInvoice(invoice).length === 0;
                        if (!isValidShipping) {
                            (_a = shippingRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                            return [2 /*return*/];
                        }
                        else if (!isValidInvoice) {
                            (_b = invoiceRef.current) === null || _b === void 0 ? void 0 : _b.scrollIntoView({ behavior: 'smooth' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, placeOrder(paymentType, invoice)];
                    case 1:
                        taskId = _c.sent();
                        return [4 /*yield*/, updateMemberMetadata({
                                variables: {
                                    memberId: member.id,
                                    metadata: __assign(__assign({}, member.metadata), { invoice: invoice, shipping: isProductPhysical ? shipping : undefined }),
                                },
                            })];
                    case 2:
                        _c.sent();
                        history.push("/tasks/order/" + taskId);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return (React.createElement(React.Fragment, null,
        renderTrigger({ setVisible: function () { return setModalVisible(true); } }),
        React.createElement(StyledModal, __assign({ title: null, footer: null, width: "100%", visible: isModalVisible, onCancel: function () { return setModalVisible(false); } }, modalProps),
            React.createElement(StyledTitle, { className: "mb-4" }, formatMessage(checkoutMessages.title.cart)),
            React.createElement(StyledWrapper, null,
                React.createElement("div", { className: "mb-5" },
                    React.createElement(ProductItem, { id: productId, startedAt: startedAt, variant: "checkout" })),
                React.createElement(Form, { onSubmit: function (e) {
                        e.preventDefault();
                        handleSubmit();
                    } },
                    renderProductSelector && (React.createElement("div", { className: "mb-5" }, renderProductSelector({ productId: productId, onProductChange: function (productId) { return setProductId(productId); } }))),
                    !!warningText && React.createElement(StyledWarningText, null, warningText),
                    isProductPhysical && (React.createElement("div", { ref: shippingRef },
                        React.createElement(ShippingInput, { value: shipping, onChange: function (value) { return setShipping(value); }, shippingMethods: shippingMethods, isValidating: isValidating }))),
                    React.createElement("div", { ref: invoiceRef, className: "mb-5" },
                        React.createElement(InvoiceInput, { value: invoice, onChange: function (value) { return setInvoice(value); }, isValidating: isValidating, shouldSameToShippingCheckboxDisplay: isProductPhysical })),
                    React.createElement("div", { className: "mb-5" }, form.getFieldDecorator('discountId', {
                        initialValue: discountId,
                    })(React.createElement(DiscountSelectionCard, { check: check }))),
                    React.createElement(Divider, { className: "mb-3" }),
                    orderChecking ? (React.createElement(Skeleton, { active: true })) : (React.createElement(React.Fragment, null,
                        React.createElement(StyledCheckoutBlock, { className: "mb-5" },
                            check.orderProducts.map(function (orderProduct) { return (React.createElement(CheckoutProductItem, { key: orderProduct.name, name: orderProduct.name, price: orderProduct.price })); }),
                            check.orderDiscounts.map(function (orderDiscount) { return (React.createElement(CheckoutProductItem, { key: orderDiscount.name, name: orderDiscount.name, price: orderDiscount.price })); }),
                            check.shippingOption && (React.createElement(CheckoutProductItem, { name: formatMessage(checkoutMessages.shipping[camelCase(check.shippingOption.id)]), price: check.shippingOption.fee }))),
                        React.createElement(StyledCheckoutPrice, { className: "mb-3" },
                            React.createElement(PriceLabel, { listPrice: totalPrice })))),
                    React.createElement("div", { className: "text-right" },
                        React.createElement(Button, { onClick: function () { return setModalVisible(false); }, className: "mr-3" }, formatMessage(commonMessages.button.cancel)),
                        React.createElement(Button, { type: "primary", loading: orderPlacing, htmlType: "submit" }, paymentType === 'subscription'
                            ? formatMessage(checkoutMessages.button.cartSubmit)
                            : formatMessage(commonMessages.button.purchase))))))));
};
export default Form.create()(CheckoutProductModal);
//# sourceMappingURL=CheckoutProductModal.js.map
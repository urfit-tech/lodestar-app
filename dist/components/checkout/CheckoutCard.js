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
import { Button } from 'antd';
import { camelCase } from 'lodash';
import { prop, sum } from 'ramda';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { ThemeContext } from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { checkoutMessages } from '../../helpers/translation';
import AdminCard from '../common/AdminCard';
import PriceLabel from '../common/PriceLabel';
var CheckoutCard = function (_a) {
    var _b, _c;
    var discountId = _a.discountId, check = _a.check, cartProducts = _a.cartProducts, invoice = _a.invoice, shipping = _a.shipping, loading = _a.loading, onCheckout = _a.onCheckout, cardProps = __rest(_a, ["discountId", "check", "cartProducts", "invoice", "shipping", "loading", "onCheckout"]);
    var formatMessage = useIntl().formatMessage;
    var theme = useContext(ThemeContext);
    var appCurrencyId = useApp().currencyId;
    return (React.createElement(AdminCard, __assign({}, cardProps),
        check.orderProducts.map(function (orderProduct, index) {
            var _a, _b, _c, _d;
            return (React.createElement("div", { key: index, className: "row mb-2" },
                React.createElement("div", { className: "col-6 offset-md-4 col-md-4" },
                    orderProduct.name,
                    " x",
                    ((_a = orderProduct === null || orderProduct === void 0 ? void 0 : orderProduct.options) === null || _a === void 0 ? void 0 : _a.quantity) || 1),
                React.createElement("div", { className: "col-6 col-md-4 text-right" },
                    React.createElement(PriceLabel, { listPrice: ((_b = orderProduct.options) === null || _b === void 0 ? void 0 : _b.currencyId) ? ((_c = orderProduct.options) === null || _c === void 0 ? void 0 : _c.currencyPrice) || 0 : orderProduct.price, currencyId: ((_d = orderProduct.options) === null || _d === void 0 ? void 0 : _d.currencyId) || appCurrencyId }))));
        }), (_b = check === null || check === void 0 ? void 0 : check.orderDiscounts) === null || _b === void 0 ? void 0 :
        _b.map(function (orderDiscount, index) { return (React.createElement("div", { key: index, className: "row mb-2" },
            React.createElement("div", { className: "col-6 offset-md-4 col-md-4" }, orderDiscount.name),
            React.createElement("div", { className: "col-6 col-md-4 text-right" },
                React.createElement(PriceLabel, { listPrice: -orderDiscount.price, currencyId: appCurrencyId })))); }),
        (check === null || check === void 0 ? void 0 : check.shippingOption) && (React.createElement("div", { className: "row mb-2" },
            React.createElement("div", { className: "col-10 offset-md-4 col-md-6" }, formatMessage(checkoutMessages.shipping[camelCase(check.shippingOption.id)])),
            React.createElement("div", { className: "col-2 col-md-2 text-right" },
                React.createElement(PriceLabel, { listPrice: check.shippingOption.fee, currencyId: appCurrencyId })))),
        (check === null || check === void 0 ? void 0 : check.orderProducts) && (check === null || check === void 0 ? void 0 : check.orderDiscounts) && (React.createElement("div", { className: "row mb-3 mt-5" },
            React.createElement("div", { className: "col-12 offset-md-8 col-md-4 text-right", style: {
                    fontSize: '24px',
                    color: theme['@primary-color'],
                } },
                React.createElement("span", { className: "mr-2" }, formatMessage(checkoutMessages.content.total)),
                React.createElement(PriceLabel, { listPrice: sum(check.orderProducts.map(prop('price'))) -
                        sum(check.orderDiscounts.map(prop('price'))) +
                        (((_c = check.shippingOption) === null || _c === void 0 ? void 0 : _c.fee) || 0) })))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12 offset-md-8 col-md-4 offset-lg-10 col-lg-2" },
                React.createElement(Button, { type: "primary", block: true, disabled: check.orderProducts.length === 0, loading: loading, onClick: function () { return onCheckout === null || onCheckout === void 0 ? void 0 : onCheckout(); } }, formatMessage(checkoutMessages.button.cartSubmit))))));
};
export default CheckoutCard;
//# sourceMappingURL=CheckoutCard.js.map
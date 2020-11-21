var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { Button, Checkbox, Divider, Modal } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import ProductItem from '../../components/common/ProductItem';
import { commonMessages, voucherMessages } from '../../helpers/translation';
var StyledTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledDescription = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 16px;\n  letter-spacing: 0.2px;\n  white-space: pre-wrap;\n"], ["\n  color: var(--gray-darker);\n  font-size: 16px;\n  letter-spacing: 0.2px;\n  white-space: pre-wrap;\n"])));
var StyledNotice = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 2rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  margin-bottom: 2rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var VoucherExchangeModal = function (_a) {
    var productQuantityLimit = _a.productQuantityLimit, description = _a.description, productIds = _a.productIds, onExchange = _a.onExchange;
    var formatMessage = useIntl().formatMessage;
    var _b = useState(false), visible = _b[0], setVisible = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState([]), selectedProductIds = _d[0], setSelectedProductIds = _d[1];
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { type: "primary", onClick: function () { return setVisible(true); } }, formatMessage(commonMessages.button.useNow)),
        React.createElement(Modal, { centered: true, destroyOnClose: true, footer: null, visible: visible, onCancel: function () { return setVisible(false); } },
            React.createElement(StyledTitle, { className: "mb-2" }, formatMessage({ id: 'voucher.redeemable.items', defaultMessage: '可兌換 {productQuantityLimit} 個項目' }, { productQuantityLimit: productQuantityLimit })),
            React.createElement(StyledDescription, { className: "mb-2" }, description),
            React.createElement(StyledNotice, null, formatMessage(voucherMessages.content.notice)),
            productIds.map(function (productId) { return (React.createElement("div", { key: productId },
                React.createElement("div", { className: "d-flex align-items-center justify-content-start" },
                    React.createElement(Checkbox, { className: "mr-4", onChange: function (e) {
                            if (e.target.checked) {
                                setSelectedProductIds(__spreadArrays(selectedProductIds, [productId]));
                            }
                            else {
                                setSelectedProductIds(selectedProductIds.filter(function (id) { return id !== productId; }));
                            }
                        }, disabled: !selectedProductIds.includes(productId) && selectedProductIds.length >= productQuantityLimit }),
                    React.createElement(ProductItem, { id: productId })),
                React.createElement(Divider, { className: "my-4" }))); }),
            React.createElement("div", { className: "text-right" },
                React.createElement(Button, { className: "mr-2", onClick: function () { return setVisible(false); } }, formatMessage(commonMessages.button.cancel)),
                React.createElement(Button, { type: "primary", loading: loading, disabled: selectedProductIds.length === 0 || selectedProductIds.length > productQuantityLimit, onClick: function () {
                        if (onExchange) {
                            onExchange(setVisible, setLoading, selectedProductIds);
                        }
                    } }, formatMessage(commonMessages.button.exchange))))));
};
export default VoucherExchangeModal;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=VoucherExchangeModal.js.map
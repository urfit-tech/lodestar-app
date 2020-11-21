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
import { Button, Form, Input, Radio } from 'antd';
import { camelCase } from 'lodash';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { checkoutMessages } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
import PriceLabel from '../common/PriceLabel';
export var csvShippingMethods = ['seven-eleven', 'family-mart', 'ok-mart', 'hi-life'];
var StyledTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledPriceTag = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  color: ", ";\n"], ["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  color: ", ";\n"])), function (props) { return props.theme['@primary-color']; });
export var validateShipping = function (shipping) {
    return [shipping.name, shipping.phone, shipping.address].every(function (value) { return !!value; });
};
var ShippingInput = function (_a) {
    var _b, _c, _d;
    var value = _a.value, onChange = _a.onChange, isValidating = _a.isValidating, shippingMethods = _a.shippingMethods;
    var formatMessage = useIntl().formatMessage;
    var backendEndpoint = useAuth().backendEndpoint;
    var appCurrencyId = useApp().currencyId;
    var nameRef = useRef(null);
    var phoneRef = useRef(null);
    var addressRef = useRef(null);
    var specificationRef = useRef(null);
    var cachedCvsOptions = localStorage.getItem('kolable.cart.shippingOptions');
    var _e = useState(cachedCvsOptions ? JSON.parse(cachedCvsOptions) : {}), currentCvsOptions = _e[0], setCurrentCvsOptions = _e[1];
    var handleChange = function (key, inputValue) {
        var newShippingOption = {};
        if (key === 'shippingMethod' && currentCvsOptions[inputValue]) {
            var _a = currentCvsOptions[inputValue], storeId = _a.storeId, storeName = _a.storeName, storeAddress = _a.storeAddress;
            newShippingOption = {
                storeId: storeId,
                storeName: storeName,
                address: storeAddress,
            };
            localStorage.setItem('kolable.cart.shippingOptions', JSON.stringify(newShippingOption));
        }
        var newValue = __assign({ name: (value === null || value === void 0 ? void 0 : value.name) || '', phone: (value === null || value === void 0 ? void 0 : value.phone) || '', address: (value === null || value === void 0 ? void 0 : value.address) || '', shippingMethod: (value === null || value === void 0 ? void 0 : value.shippingMethod) || 'home-delivery', specification: (value === null || value === void 0 ? void 0 : value.specification) || '', storeId: (value === null || value === void 0 ? void 0 : value.storeId) || '', storeName: (value === null || value === void 0 ? void 0 : value.storeName) || '' }, newShippingOption);
        newValue[key] = inputValue;
        localStorage.setItem('kolable.cart.shipping', JSON.stringify(newValue));
        onChange && onChange(newValue);
    };
    window.callCvsPopupCallback = function (params) {
        var _a;
        var cvsType = params.cvsType, storeId = params.storeId, storeName = params.storeName, storeAddress = params.storeAddress;
        if (value === null || value === void 0 ? void 0 : value.shippingMethod) {
            var newCvsOptions = __assign(__assign({}, currentCvsOptions), (_a = {}, _a[cvsType || value.shippingMethod] = params, _a));
            setCurrentCvsOptions(newCvsOptions);
            localStorage.setItem('kolable.cart.shippingOptions', JSON.stringify(newCvsOptions));
        }
        var newValue = __assign(__assign({ name: (value === null || value === void 0 ? void 0 : value.name) || '', phone: (value === null || value === void 0 ? void 0 : value.phone) || '', specification: (value === null || value === void 0 ? void 0 : value.specification) || '' }, value), { storeId: storeId,
            storeName: storeName, address: storeAddress || '', shippingMethod: cvsType || (value === null || value === void 0 ? void 0 : value.shippingMethod) || 'home-delivery' });
        localStorage.setItem('kolable.cart.shipping', JSON.stringify(newValue));
        onChange && onChange(newValue);
    };
    var handleStoreSelect = function () {
        var cvsSelectionBackUrl = encodeURIComponent(backendEndpoint + "/payment/cvs-proxy/" + (value === null || value === void 0 ? void 0 : value.shippingMethod) + "?callbackUrl=" + window.location.origin + "/cvs");
        var cvsSelectionUrl;
        switch (value === null || value === void 0 ? void 0 : value.shippingMethod) {
            case 'seven-eleven':
                cvsSelectionUrl = "https://emap.pcsc.com.tw/ecmap/default.aspx?eshopparid=935&eshopid=001&eshoppwd=presco123&tempvar=&sid=1&storecategory=3&showtype=1&storeid=&url=" + cvsSelectionBackUrl;
                break;
            case 'ok-mart':
                cvsSelectionUrl = "https://ecservice.okmart.com.tw/ECMapInquiry/ShowStore?userip=&cvsid=1592042616368&cvstemp=" + cvsSelectionBackUrl;
                break;
            case 'hi-life':
            case 'family-mart':
                cvsSelectionUrl = "https://map.ezship.com.tw/ezship_map_web_2014.jsp?rtURL=" + cvsSelectionBackUrl;
                break;
            default:
                break;
        }
        window.open(cvsSelectionUrl);
    };
    return (React.createElement("div", null,
        React.createElement(StyledTitle, { className: "mb-4" }, formatMessage(checkoutMessages.shipping.shippingInput)),
        shippingMethods && (React.createElement(Form.Item, { required: true, label: formatMessage(checkoutMessages.shipping.shippingMethod) },
            React.createElement(Radio.Group, { value: (value === null || value === void 0 ? void 0 : value.shippingMethod) || 'home-delivery', onChange: function (event) { return handleChange('shippingMethod', event.target.value); } }, shippingMethods
                .filter(function (shippingMethod) { return shippingMethod.enabled; })
                .map(function (shippingMethod) {
                var formattedShippingMethod = checkoutMessages.shipping[camelCase(shippingMethod.id)];
                return (React.createElement(Radio, { key: shippingMethod.id, value: shippingMethod.id, className: "d-block mt-4" },
                    React.createElement("span", { className: "align-middle mr-2" }, formatMessage(formattedShippingMethod)),
                    React.createElement(StyledPriceTag, { className: "mr-2" },
                        React.createElement(PriceLabel, { listPrice: shippingMethod.fee, currencyId: appCurrencyId })),
                    csvShippingMethods.includes(shippingMethod.id) && (value === null || value === void 0 ? void 0 : value.shippingMethod) === shippingMethod.id && (React.createElement(React.Fragment, null,
                        React.createElement("span", { className: "mr-2" },
                            React.createElement(Button, { onClick: function () { return handleStoreSelect(); } }, formatMessage(checkoutMessages.shipping.selectStore))),
                        currentCvsOptions[value === null || value === void 0 ? void 0 : value.shippingMethod] && (React.createElement("span", null, currentCvsOptions[value === null || value === void 0 ? void 0 : value.shippingMethod].storeName))))));
            })))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12 col-lg-6" },
                React.createElement(Form.Item, { required: true, label: formatMessage(checkoutMessages.form.label.receiverName), validateStatus: isValidating && ((_b = nameRef.current) === null || _b === void 0 ? void 0 : _b.input.value) === '' ? 'error' : undefined },
                    React.createElement(Input, { ref: nameRef, placeholder: formatMessage(checkoutMessages.form.message.nameText), defaultValue: (value === null || value === void 0 ? void 0 : value.name) || '', onBlur: function (event) { return handleChange('name', event.target.value); } }))),
            React.createElement("div", { className: "col-12 col-lg-6" },
                React.createElement(Form.Item, { required: true, label: formatMessage(checkoutMessages.form.label.receiverPhone), validateStatus: isValidating && ((_c = phoneRef.current) === null || _c === void 0 ? void 0 : _c.input.value) === '' ? 'error' : undefined },
                    React.createElement(Input, { ref: phoneRef, placeholder: formatMessage(checkoutMessages.form.message.phone), defaultValue: (value === null || value === void 0 ? void 0 : value.phone) || '', onBlur: function (event) { return handleChange('phone', event.target.value); } })))),
        React.createElement(Form.Item, { required: true, label: formatMessage(checkoutMessages.form.label.receiverAddress), validateStatus: isValidating && ((_d = addressRef.current) === null || _d === void 0 ? void 0 : _d.input.value) === '' ? 'error' : undefined },
            React.createElement(Input, { ref: addressRef, placeholder: formatMessage(checkoutMessages.form.message.addressText), defaultValue: (value === null || value === void 0 ? void 0 : value.address) || '', value: value === null || value === void 0 ? void 0 : value.address, onBlur: function (event) { return handleChange('address', event.target.value); }, onChange: function (event) { return handleChange('address', event.target.value); } })),
        React.createElement(Form.Item, { label: formatMessage(checkoutMessages.shipping.specification) },
            React.createElement(Input.TextArea, { ref: specificationRef, rows: 5, defaultValue: (value === null || value === void 0 ? void 0 : value.specification) || '', onBlur: function (event) { return handleChange('specification', event.target.value); } }))));
};
export default ShippingInput;
var templateObject_1, templateObject_2;
//# sourceMappingURL=ShippingInput.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
import { Checkbox, Form, Input, Select, Skeleton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { validationRegExp } from '../../helpers';
import { checkoutMessages } from '../../helpers/translation';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ant-select {\n    width: 100%;\n  }\n"], ["\n  .ant-select {\n    width: 100%;\n  }\n"])));
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledDescription = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledRemark = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.18px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.18px;\n"])));
export var validateInvoice = function (invoice) {
    var _a;
    var errorFields = [];
    for (var fieldId in invoice) {
        var fieldValue = fieldId === 'phone'
            ? (_a = invoice[fieldId]) === null || _a === void 0 ? void 0 : _a.replace(/-/g, '') : invoice[fieldId];
        if (typeof fieldValue === 'string' &&
            (!fieldValue || (validationRegExp[fieldId] && !validationRegExp[fieldId].test(fieldValue)))) {
            errorFields.push(fieldId);
        }
    }
    return errorFields;
};
var InvoiceInput = function (_a) {
    var value = _a.value, onChange = _a.onChange, isValidating = _a.isValidating, shouldSameToShippingCheckboxDisplay = _a.shouldSameToShippingCheckboxDisplay;
    var formatMessage = useIntl().formatMessage;
    var _b = useApp(), loading = _b.loading, enabledModules = _b.enabledModules;
    var nameRef = useRef(null);
    var phoneRef = useRef(null);
    var emailRef = useRef(null);
    var phoneBarCodeRef = useRef(null);
    var citizenCodeRef = useRef(null);
    var uniformNumberRef = useRef(null);
    var uniformTitleRef = useRef(null);
    var postCodeRef = useRef(null);
    var addressRef = useRef(null);
    var _c = useState(null), selectedType = _c[0], setSelectedType = _c[1];
    var _d = useState(null), selectedOption = _d[0], setSelectedOption = _d[1];
    var _e = useState('5380'), selectedCharity = _e[0], setSelectedCharity = _e[1];
    var errorFields = isValidating && value ? validateInvoice(value) : [];
    useEffect(function () {
        if (loading) {
            return;
        }
        if (enabledModules.invoice) {
            setSelectedType('donation');
        }
        else {
            setSelectedType('hardcopy');
        }
        try {
            var cachedInvoiceRaw = localStorage.getItem('kolable.cart.invoice');
            if (!cachedInvoiceRaw) {
                return;
            }
            var cachedInvoice = JSON.parse(cachedInvoiceRaw);
            cachedInvoice.type && setSelectedType(cachedInvoice.type);
            cachedInvoice.option && setSelectedOption(cachedInvoice.option);
        }
        catch (error) { }
    }, [loading, enabledModules.invoice]);
    if (loading) {
        return React.createElement(Skeleton, { active: true });
    }
    var handleChange = function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var invoiceType = _a.invoiceType, invoiceOption = _a.invoiceOption, invoiceCharity = _a.invoiceCharity, shippingName = _a.shippingName, shippingPhone = _a.shippingPhone, shippingAddress = _a.shippingAddress;
        var currentInvoiceType = typeof invoiceType === 'undefined' ? selectedType : invoiceType;
        var currentInvoiceOption = typeof invoiceOption === 'undefined' ? selectedOption : invoiceOption;
        var currentSelectedCharity = typeof invoiceCharity === 'undefined' ? selectedCharity : invoiceCharity;
        typeof invoiceType !== 'undefined' && setSelectedType(invoiceType);
        typeof invoiceOption !== 'undefined' && setSelectedOption(invoiceOption);
        typeof invoiceCharity !== 'undefined' && setSelectedCharity(invoiceCharity);
        var currentValue = {
            name: shippingName || ((_b = nameRef.current) === null || _b === void 0 ? void 0 : _b.input.value) || '',
            phone: shippingPhone || ((_c = phoneRef.current) === null || _c === void 0 ? void 0 : _c.input.value) || '',
            email: ((_d = emailRef.current) === null || _d === void 0 ? void 0 : _d.input.value) || '',
            phoneBarCode: currentInvoiceOption === 'use-phone-bar-code' ? ((_e = phoneBarCodeRef.current) === null || _e === void 0 ? void 0 : _e.input.value) || '' : undefined,
            citizenCode: currentInvoiceOption === 'citizen-digital-certificate' ? ((_f = citizenCodeRef.current) === null || _f === void 0 ? void 0 : _f.input.value) || '' : undefined,
            uniformNumber: currentInvoiceType === 'uniform-number' || currentInvoiceType === 'hardcopy-uniform-number'
                ? ((_g = uniformNumberRef.current) === null || _g === void 0 ? void 0 : _g.input.value) || ''
                : undefined,
            uniformTitle: currentInvoiceType === 'uniform-number' || currentInvoiceType === 'hardcopy-uniform-number'
                ? ((_h = uniformTitleRef.current) === null || _h === void 0 ? void 0 : _h.input.value) || ''
                : undefined,
            donationCode: currentInvoiceType === 'donation' ? currentSelectedCharity : undefined,
            postCode: currentInvoiceType === 'hardcopy-uniform-number' ? ((_j = postCodeRef.current) === null || _j === void 0 ? void 0 : _j.input.value) || '' : undefined,
            address: currentInvoiceType === 'hardcopy-uniform-number'
                ? shippingAddress || ((_k = addressRef.current) === null || _k === void 0 ? void 0 : _k.input.value) || ''
                : undefined,
        };
        localStorage.setItem('kolable.cart.invoice', JSON.stringify({
            type: currentInvoiceType,
            option: currentInvoiceOption,
            value: currentValue,
        }));
        onChange && onChange(currentValue);
    };
    var syncWithShipping = function () { return __awaiter(void 0, void 0, void 0, function () {
        var cachedShipping;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            try {
                cachedShipping = JSON.parse(localStorage.getItem('kolable.cart.shipping') || '');
                (_a = nameRef.current) === null || _a === void 0 ? void 0 : _a.setValue((cachedShipping === null || cachedShipping === void 0 ? void 0 : cachedShipping.name) || '');
                (_b = phoneRef.current) === null || _b === void 0 ? void 0 : _b.setValue((cachedShipping === null || cachedShipping === void 0 ? void 0 : cachedShipping.phone) || '');
                (_c = addressRef.current) === null || _c === void 0 ? void 0 : _c.setValue((cachedShipping === null || cachedShipping === void 0 ? void 0 : cachedShipping.address) || '');
                handleChange({
                    invoiceType: selectedType,
                    invoiceOption: selectedOption,
                    invoiceCharity: selectedCharity,
                    shippingName: cachedShipping.name,
                    shippingPhone: cachedShipping.phone,
                    shippingAddress: cachedShipping.address,
                });
            }
            catch (error) {
                handleChange({
                    invoiceType: selectedType,
                    invoiceOption: selectedOption,
                    invoiceCharity: selectedCharity,
                });
            }
            return [2 /*return*/];
        });
    }); };
    return (React.createElement(StyledWrapper, null,
        React.createElement(StyledTitle, null, formatMessage(checkoutMessages.form.label.invoice)),
        React.createElement(StyledDescription, { className: "mb-4" }, enabledModules.invoice
            ? formatMessage(checkoutMessages.form.message.warningEmail)
            : formatMessage(checkoutMessages.form.message.warningHardcopy)),
        shouldSameToShippingCheckboxDisplay && (React.createElement("div", { className: "mb-4" },
            React.createElement(Checkbox, { onChange: function (event) { return event.target.checked && syncWithShipping(); } }, formatMessage(checkoutMessages.form.message.sameToShipping)))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12 col-lg-3" },
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.name), required: true, validateStatus: isValidating && errorFields.includes('name') ? 'error' : undefined, help: errorFields.includes('name') && formatMessage(checkoutMessages.form.message.errorName) },
                    React.createElement(Input, { ref: nameRef, placeholder: formatMessage(checkoutMessages.form.message.nameText), defaultValue: value ? value.name : '', onBlur: function () { return handleChange({}); } }))),
            React.createElement("div", { className: "col-12 col-lg-3" },
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.phone), required: true, validateStatus: isValidating && errorFields.includes('phone') ? 'error' : undefined, help: errorFields.includes('phone') && formatMessage(checkoutMessages.form.message.errorPhone) },
                    React.createElement(Input, { ref: phoneRef, placeholder: formatMessage(checkoutMessages.form.message.phone), defaultValue: value ? value.phone : '', onBlur: function () { return handleChange({}); } }))),
            React.createElement("div", { className: "col-12 col-lg-6" },
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.email), required: true, validateStatus: isValidating && errorFields.includes('email') ? 'error' : undefined, help: errorFields.includes('email') && formatMessage(checkoutMessages.form.message.errorEmail) },
                    React.createElement(Input, { ref: emailRef, placeholder: formatMessage(checkoutMessages.form.message.emailText), defaultValue: value ? value.email : '', onBlur: function () { return handleChange({}); } })))),
        React.createElement("div", { className: "row mb-4" },
            React.createElement("div", { className: "col-12 col-lg-6" }, enabledModules.invoice ? (React.createElement(Select, { value: selectedType, onChange: function (v) {
                    return handleChange({
                        invoiceType: v,
                        invoiceOption: v === 'electronic' ? 'send-to-email' : null,
                    });
                } },
                React.createElement(Select.Option, { value: "donation" }, formatMessage(checkoutMessages.form.label.donateInvoice)),
                React.createElement(Select.Option, { value: "electronic" }, formatMessage(checkoutMessages.form.label.electronicInvoice)),
                React.createElement(Select.Option, { value: "uniform-number" }, formatMessage(checkoutMessages.form.label.uniformNumber)))) : (React.createElement(Select, { value: selectedType, onChange: function (v) { return handleChange({ invoiceType: v }); } },
                React.createElement(Select.Option, { value: "hardcopy" }, formatMessage(checkoutMessages.form.label.hardcopyInvoice)),
                React.createElement(Select.Option, { value: "hardcopy-uniform-number" }, formatMessage(checkoutMessages.form.label.hardcopyUniformNumberInvoice))))),
            React.createElement("div", { className: "col-12 col-lg-6" },
                selectedType === 'donation' && (React.createElement(Select, { value: selectedCharity, onChange: function (v) { return handleChange({ invoiceCharity: v }); } },
                    React.createElement(Select.Option, { value: "5380" }, "5380 \u793E\u5718\u6CD5\u4EBA\u53F0\u7063\u5931\u667A\u75C7\u5354\u6703"),
                    React.createElement(Select.Option, { value: "8957282" }, "8957282 \u8CA1\u5718\u6CD5\u4EBA\u6D41\u6D6A\u52D5\u7269\u4E4B\u5BB6\u57FA\u91D1\u6703"),
                    React.createElement(Select.Option, { value: "25885" }, "25885 \u8CA1\u5718\u6CD5\u4EBA\u4F0A\u7538\u793E\u6703\u798F\u5229\u57FA\u91D1\u6703"))),
                selectedType === 'electronic' && (React.createElement(Select, { value: selectedOption, onChange: function (v) { return handleChange({ invoiceOption: v }); } },
                    React.createElement(Select.Option, { value: "send-to-email" }, formatMessage(checkoutMessages.form.label.sendToEmail)),
                    React.createElement(Select.Option, { value: "use-phone-bar-code" }, formatMessage(checkoutMessages.form.label.usePhoneBarCode)),
                    React.createElement(Select.Option, { value: "citizen-digital-certificate" }, formatMessage(checkoutMessages.form.label.citizenCode)))))),
        selectedOption === 'use-phone-bar-code' && (React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12" },
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.phoneBarCode), required: true, validateStatus: isValidating && errorFields.includes('phoneBarCode') ? 'error' : undefined, help: formatMessage(checkoutMessages.form.message.phoneBarCodeText) },
                    React.createElement(Input, { ref: phoneBarCodeRef, defaultValue: value ? value.phoneBarCode : undefined, onBlur: function () { return handleChange({}); } }))))),
        selectedOption === 'citizen-digital-certificate' && (React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12" },
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.citizenCode), required: true, validateStatus: isValidating && errorFields.includes('citizenCode') ? 'error' : undefined, help: formatMessage(checkoutMessages.form.message.citizenCodeText) },
                    React.createElement(Input, { ref: citizenCodeRef, defaultValue: value ? value.citizenCode : undefined, onBlur: function () { return handleChange({}); } }))))),
        (selectedType === 'uniform-number' || selectedType === 'hardcopy-uniform-number') && (React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12 col-lg-6" },
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.uniformNumber), required: true, validateStatus: isValidating && errorFields.includes('uniformNumber') ? 'error' : undefined },
                    React.createElement(Input, { ref: uniformNumberRef, placeholder: formatMessage(checkoutMessages.form.message.uniformNumberText), defaultValue: value ? value.uniformNumber : undefined, onBlur: function () { return handleChange({}); } }))),
            React.createElement("div", { className: "col-12 col-lg-6" },
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.uniformTitle), required: true, validateStatus: isValidating && errorFields.includes('uniformTitle') ? 'error' : undefined },
                    React.createElement(Input, { ref: uniformTitleRef, placeholder: formatMessage(checkoutMessages.form.message.uniformTitleText), defaultValue: value ? value.uniformTitle : undefined, onBlur: function () { return handleChange({}); } }))),
            React.createElement("div", { className: "col-12" }, selectedType === 'uniform-number' && (React.createElement(StyledRemark, null, formatMessage(checkoutMessages.form.message.uniformNumberRemark)))))),
        selectedType === 'hardcopy-uniform-number' && (React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12" },
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.receiverAddress), required: true, validateStatus: isValidating && (errorFields.includes('post') || errorFields.includes('address')) ? 'error' : undefined },
                    React.createElement("div", { className: "row no-gutters" },
                        React.createElement("div", { className: "col-4 pr-3" },
                            React.createElement(Input, { ref: postCodeRef, placeholder: formatMessage(checkoutMessages.form.label.postCode), defaultValue: value ? value.postCode : undefined, onBlur: function () { return handleChange({}); } })),
                        React.createElement("div", { className: "col-8" },
                            React.createElement(Input, { ref: addressRef, placeholder: formatMessage(checkoutMessages.form.label.receiverAddress), defaultValue: value ? value.address : undefined, onBlur: function () { return handleChange({}); } })))))))));
};
export default InvoiceInput;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=InvoiceInput.js.map
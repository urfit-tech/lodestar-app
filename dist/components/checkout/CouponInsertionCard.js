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
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { handleError } from '../../helpers';
import { checkoutMessages, codeMessages, commonMessages } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
import AdminCard from '../common/AdminCard';
var CouponInsertionCard = function (_a) {
    var form = _a.form, onInsert = _a.onInsert, cardProps = __rest(_a, ["form", "onInsert"]);
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), authToken = _b.authToken, backendEndpoint = _b.backendEndpoint;
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        form.validateFields(function (error, values) {
            if (!error) {
                setLoading(true);
                axios
                    .post(backendEndpoint + "/payment/exchange", {
                    code: values.code,
                    type: 'Coupon',
                }, {
                    headers: { authorization: "Bearer " + authToken },
                })
                    .then(function (_a) {
                    var code = _a.data.code;
                    if (code === 'SUCCESS') {
                        message.success(formatMessage(codeMessages[code]));
                        onInsert && onInsert();
                    }
                    else {
                        message.error(formatMessage(codeMessages[code]));
                    }
                    form.resetFields();
                })
                    .catch(handleError)
                    .finally(function () { return setLoading(false); });
            }
        });
    };
    return (React.createElement(AdminCard, __assign({}, cardProps),
        React.createElement(Form, { layout: "inline", onSubmit: handleSubmit },
            React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.label.addCoupon) }, form.getFieldDecorator('code', { rules: [{ required: true }] })(React.createElement(Input, null))),
            React.createElement(Form.Item, null,
                React.createElement(Button, { loading: loading, type: "primary", htmlType: "submit", disabled: !form.getFieldValue('code') }, formatMessage(commonMessages.button.add))))));
};
export default Form.create()(CouponInsertionCard);
//# sourceMappingURL=CouponInsertionCard.js.map
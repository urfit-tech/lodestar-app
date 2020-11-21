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
import { Button, Form, Input, message, Typography } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { handleError } from '../../helpers';
import { codeMessages, commonMessages, productMessages, profileMessages, settingsMessages, } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
import AdminCard from '../common/AdminCard';
import { StyledForm } from '../layout';
var ProfilePasswordAdminCard = function (_a) {
    var form = _a.form, memberId = _a.memberId, cardProps = __rest(_a, ["form", "memberId"]);
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), authToken = _b.authToken, backendEndpoint = _b.backendEndpoint;
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        form.validateFields(function (error, values) {
            if (!error) {
                setLoading(true);
                axios
                    .post(backendEndpoint + "/auth/change-password", {
                    password: values.password,
                    newPassword: values.newPassword,
                }, {
                    headers: { authorization: "Bearer " + authToken },
                })
                    .then(function (_a) {
                    var code = _a.data.code;
                    if (code === 'SUCCESS') {
                        message.success(formatMessage(commonMessages.message.success.passwordUpdate));
                    }
                    else {
                        message.error(formatMessage(codeMessages[code]));
                    }
                })
                    .catch(handleError)
                    .finally(function () { return setLoading(false); });
            }
        });
    };
    return (React.createElement(AdminCard, __assign({}, cardProps),
        React.createElement(Typography.Title, { className: "mb-4", level: 4 }, formatMessage(productMessages.program.title.changePassword)),
        React.createElement(StyledForm, { labelCol: { span: 24, md: { span: 4 } }, wrapperCol: { span: 24, md: { span: 8 } }, onSubmit: handleSubmit },
            React.createElement(Form.Item, { label: formatMessage(settingsMessages.profile.form.label.currentPassword) }, form.getFieldDecorator('password', {
                rules: [
                    {
                        required: true,
                        message: formatMessage(profileMessages.form.message.currentPassword),
                    },
                ],
            })(React.createElement(Input, { type: "password" }))),
            React.createElement(Form.Item, { label: formatMessage(settingsMessages.profile.form.label.newPassword) }, form.getFieldDecorator('newPassword', {
                rules: [
                    {
                        required: true,
                        message: formatMessage(settingsMessages.profile.form.message.newPassword),
                    },
                ],
            })(React.createElement(Input, { type: "password" }))),
            React.createElement(Form.Item, { label: formatMessage(settingsMessages.profile.form.label.confirmation) }, form.getFieldDecorator('confirmPassword', {
                rules: [
                    {
                        required: true,
                        message: formatMessage(settingsMessages.profile.form.message.confirmation),
                    },
                    {
                        validator: function (rule, value, callback) {
                            if (value && form.getFieldValue('newPassword') !== value) {
                                callback(new Error(formatMessage(settingsMessages.profile.form.validator.password)));
                            }
                            callback();
                        },
                    },
                ],
            })(React.createElement(Input, { type: "password" }))),
            React.createElement(Form.Item, { wrapperCol: { md: { offset: 4 } } },
                React.createElement(Button, { className: "mr-2", onClick: function () { return form.resetFields(); } }, formatMessage(commonMessages.button.cancel)),
                React.createElement(Button, { type: "primary", htmlType: "submit", loading: loading }, formatMessage(commonMessages.button.save))))));
};
export default Form.create()(ProfilePasswordAdminCard);
//# sourceMappingURL=ProfilePasswordAdminCard.js.map
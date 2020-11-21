var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Form, Icon, Input, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useAuth } from '../components/auth/AuthContext';
import { BREAK_POINT } from '../components/common/Responsive';
import DefaultLayout from '../components/layout/DefaultLayout';
import { handleError } from '../helpers';
import { codeMessages, commonMessages, usersMessages } from '../helpers/translation';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 4rem 1rem;\n  color: #585858;\n\n  .ant-form-explain {\n    font-size: 14px;\n  }\n\n  @media (min-width: ", "px) {\n    padding: 4rem;\n  }\n"], ["\n  padding: 4rem 1rem;\n  color: #585858;\n\n  .ant-form-explain {\n    font-size: 14px;\n  }\n\n  @media (min-width: ", "px) {\n    padding: 4rem;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 2rem;\n  color: #585858;\n  font-size: 20px;\n  font-weight: bold;\n  text-align: center;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n"], ["\n  margin-bottom: 2rem;\n  color: #585858;\n  font-size: 20px;\n  font-weight: bold;\n  text-align: center;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n"])));
var ResetPasswordPage = function (_a) {
    var form = _a.form;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var token = useQueryParam('token', StringParam)[0];
    var backendEndpoint = useAuth().backendEndpoint;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        form.validateFields(function (error, values) {
            if (!error) {
                setLoading(true);
                axios
                    .post(backendEndpoint + "/auth/reset-password", { newPassword: values.password }, {
                    headers: { authorization: "Bearer " + token },
                })
                    .then(function (_a) {
                    var code = _a.data.code;
                    if (code === 'SUCCESS') {
                        history.push('/reset-password-success');
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
    // FIXME: set auth token to reset password
    // useEffect(() => {
    //   try {
    //     localStorage.removeItem(`${localStorage.getItem('kolable.app.id')}.auth.token`)
    //   } catch (error) {}
    //   setAuthToken && setAuthToken(null)
    // }, [setAuthToken])
    return (React.createElement(DefaultLayout, { noFooter: true, centeredBox: true },
        React.createElement(StyledContainer, null,
            React.createElement(StyledTitle, null, formatMessage(usersMessages.title.resetPassword)),
            React.createElement(Form, { onSubmit: handleSubmit },
                React.createElement(Form.Item, null, form.getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: formatMessage(usersMessages.messages.enterPassword),
                        },
                    ],
                })(React.createElement(Input, { type: "password", placeholder: formatMessage(usersMessages.placeholder.enterNewPassword), suffix: React.createElement(Icon, { type: "lock" }) }))),
                React.createElement(Form.Item, null, form.getFieldDecorator('passwordCheck', {
                    validateTrigger: 'onSubmit',
                    rules: [
                        {
                            required: true,
                            message: formatMessage(usersMessages.messages.confirmPassword),
                        },
                        {
                            validator: function (rule, value, callback) {
                                if (value && value !== form.getFieldValue('password')) {
                                    callback(formatMessage(usersMessages.messages.confirmPassword));
                                }
                                else {
                                    callback();
                                }
                            },
                        },
                    ],
                })(React.createElement(Input, { type: "password", placeholder: formatMessage(usersMessages.placeholder.enterNewPasswordAgain), suffix: React.createElement(Icon, { type: "lock" }) }))),
                React.createElement(Form.Item, { className: "m-0" },
                    React.createElement(Button, { htmlType: "submit", type: "primary", block: true, loading: loading }, formatMessage(commonMessages.button.confirm)))))));
};
export default Form.create()(ResetPasswordPage);
var templateObject_1, templateObject_2;
//# sourceMappingURL=ResetPasswordPage.js.map
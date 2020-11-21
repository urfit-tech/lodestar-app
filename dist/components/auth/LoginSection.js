var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon } from '@chakra-ui/react';
import { Button, Form, Input, message } from 'antd';
import React, { useContext, useState } from 'react';
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useApp } from '../../containers/common/AppContext';
import { handleError } from '../../helpers';
import { authMessages, codeMessages, commonMessages } from '../../helpers/translation';
import { useAuth } from './AuthContext';
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from './AuthModal';
import { FacebookLoginButton, GoogleLoginButton } from './SocialLoginButton';
var ForgetPassword = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 1.5rem;\n  font-size: 14px;\n  text-align: right;\n\n  a {\n    color: #9b9b9b;\n  }\n"], ["\n  margin-bottom: 1.5rem;\n  font-size: 14px;\n  text-align: right;\n\n  a {\n    color: #9b9b9b;\n  }\n"])));
var LoginSection = function (_a) {
    var form = _a.form, onAuthStateChange = _a.onAuthStateChange;
    var appId = useApp().id;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var back = useQueryParam('back', StringParam)[0];
    var login = useAuth().login;
    var setVisible = useContext(AuthModalContext).setVisible;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var handleLogin = function () {
        if (!login) {
            return;
        }
        form.validateFields(function (error, values) {
            if (error) {
                return;
            }
            setLoading(true);
            login({
                appId: appId,
                account: values.account.trim().toLowerCase(),
                password: values.password,
            })
                .then(function () {
                setVisible && setVisible(false);
                form.resetFields();
                back && history.push(back);
            })
                .catch(function (error) {
                var code = error.message;
                message.error(formatMessage(codeMessages[code]));
            })
                .catch(handleError)
                .finally(function () { return setLoading(false); });
        });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledTitle, null, formatMessage(authMessages.title.login)),
        !!process.env.REACT_APP_FACEBOOK_APP_ID && (React.createElement("div", { className: "mb-3" },
            React.createElement(FacebookLoginButton, null))),
        !!process.env.REACT_APP_GOOGLE_CLIENT_ID && (React.createElement("div", { className: "mb-3" },
            React.createElement(GoogleLoginButton, null))),
        (!!process.env.REACT_APP_FACEBOOK_APP_ID || !!process.env.REACT_APP_GOOGLE_CLIENT_ID) && (React.createElement(StyledDivider, null, formatMessage(commonMessages.defaults.or))),
        React.createElement(Form, { onSubmit: function (e) {
                e.preventDefault();
                handleLogin();
            } },
            React.createElement(Form.Item, null, form.getFieldDecorator('account', {
                rules: [
                    {
                        required: true,
                        message: formatMessage(commonMessages.form.message.usernameAndEmail),
                    },
                ],
            })(React.createElement(Input, { placeholder: formatMessage(commonMessages.form.message.usernameAndEmail), suffix: React.createElement(Icon, { as: AiOutlineUser }) }))),
            React.createElement(Form.Item, null, form.getFieldDecorator('password', {
                rules: [
                    {
                        required: true,
                        message: formatMessage(commonMessages.form.message.password),
                    },
                ],
            })(React.createElement(Input, { type: "password", placeholder: formatMessage(commonMessages.form.placeholder.password), suffix: React.createElement(Icon, { as: AiOutlineLock }) }))),
            React.createElement(ForgetPassword, null,
                React.createElement(Link, { to: "/forgot-password" }, formatMessage(authMessages.link.forgotPassword))),
            React.createElement(Form.Item, null,
                React.createElement(Button, { block: true, loading: loading, type: "primary", htmlType: "submit" }, formatMessage(commonMessages.button.login))),
            React.createElement(StyledAction, null,
                React.createElement("span", null, formatMessage(authMessages.content.noMember)),
                React.createElement(Button, { type: "link", size: "small", onClick: function () { return onAuthStateChange('register'); } }, formatMessage(commonMessages.button.signUp))))));
};
export default Form.create()(LoginSection);
var templateObject_1;
//# sourceMappingURL=LoginSection.js.map
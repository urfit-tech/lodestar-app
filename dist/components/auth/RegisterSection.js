var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon } from '@chakra-ui/react';
import { Button, Form, Input, message } from 'antd';
import React, { useContext, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { handleError } from '../../helpers';
import { authMessages, codeMessages, commonMessages } from '../../helpers/translation';
import { useAuth } from './AuthContext';
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from './AuthModal';
import { FacebookLoginButton, GoogleLoginButton } from './SocialLoginButton';
var StyledParagraph = styled.p(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n"])));
var RegisterSection = function (_a) {
    var form = _a.form, onAuthStateChange = _a.onAuthStateChange;
    var appId = useApp().id;
    var formatMessage = useIntl().formatMessage;
    var register = useAuth().register;
    var setVisible = useContext(AuthModalContext).setVisible;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var handleLogin = function () {
        if (!register) {
            return;
        }
        form.validateFields(function (error, values) {
            if (error) {
                return;
            }
            setLoading(true);
            register({
                appId: appId,
                username: values.username.trim().toLowerCase(),
                email: values.email.trim().toLowerCase(),
                password: values.password,
            })
                .then(function () {
                setVisible && setVisible(false);
                form.resetFields();
            })
                .catch(function (error) {
                var code = error.message;
                message.error(formatMessage(codeMessages[code]));
            })
                .catch(function (err) { return handleError(err); })
                .finally(function () { return setLoading(false); });
        });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledTitle, null, formatMessage(authMessages.title.signUp)),
        !!process.env.REACT_APP_FACEBOOK_APP_ID && (React.createElement("div", { className: "mb-3" },
            React.createElement(FacebookLoginButton, null))),
        !!process.env.REACT_APP_GOOGLE_CLIENT_ID && (React.createElement("div", { className: "mb-3" },
            React.createElement(GoogleLoginButton, null))),
        (!!process.env.REACT_APP_FACEBOOK_APP_ID || !!process.env.REACT_APP_GOOGLE_CLIENT_ID) && (React.createElement(StyledDivider, null, formatMessage(commonMessages.defaults.or))),
        React.createElement(Form, { onSubmit: function (e) {
                e.preventDefault();
                handleLogin();
            } },
            React.createElement(Form.Item, null, form.getFieldDecorator('username', {
                rules: [
                    {
                        required: true,
                        message: formatMessage(commonMessages.form.message.username),
                    },
                ],
            })(React.createElement(Input, { placeholder: formatMessage(commonMessages.form.placeholder.username), suffix: React.createElement(Icon, { as: AiOutlineUser }) }))),
            React.createElement(Form.Item, null, form.getFieldDecorator('email', {
                rules: [
                    {
                        required: true,
                        message: formatMessage(commonMessages.form.message.email),
                    },
                    {
                        type: 'email',
                        message: formatMessage(commonMessages.form.message.emailFormatMessage),
                    },
                ],
            })(React.createElement(Input, { placeholder: formatMessage(commonMessages.form.placeholder.email), suffix: React.createElement(Icon, { type: "mail" }) }))),
            React.createElement(Form.Item, null, form.getFieldDecorator('password', {
                rules: [
                    {
                        required: true,
                        message: formatMessage(commonMessages.form.message.password),
                    },
                ],
            })(React.createElement(Input, { type: "password", placeholder: formatMessage(commonMessages.form.placeholder.password), suffix: React.createElement(Icon, { type: "lock" }) }))),
            React.createElement(StyledParagraph, null,
                React.createElement("span", null, formatMessage(authMessages.content.registration)),
                React.createElement("a", { href: "/terms", target: "_blank", rel: "noopener noreferrer", className: "ml-1" }, formatMessage(authMessages.content.term))),
            React.createElement(Form.Item, null,
                React.createElement(Button, { type: "primary", htmlType: "submit", block: true, loading: loading }, formatMessage(commonMessages.button.signUp)))),
        React.createElement(StyledAction, null,
            React.createElement("span", null, formatMessage(authMessages.content.noMember)),
            React.createElement(Button, { type: "link", size: "small", onClick: function () { return onAuthStateChange('login'); } }, formatMessage(commonMessages.button.login)))));
};
export default Form.create()(RegisterSection);
var templateObject_1;
//# sourceMappingURL=RegisterSection.js.map
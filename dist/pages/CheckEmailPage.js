var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useAuth } from '../components/auth/AuthContext';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { handleError } from '../helpers';
import { codeMessages, commonMessages, usersMessages } from '../helpers/translation';
import CheckEmailIcon from '../images/check-email.svg';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 4rem 1rem;\n  color: #585858;\n  text-align: center;\n"], ["\n  padding: 4rem 1rem;\n  color: #585858;\n  text-align: center;\n"])));
var StyledIcon = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 2rem;\n"], ["\n  margin-bottom: 2rem;\n"])));
var StyledAction = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding-top: 1.5rem;\n  color: #9b9b9b;\n  font-size: 14px;\n"], ["\n  padding-top: 1.5rem;\n  color: #9b9b9b;\n  font-size: 14px;\n"])));
var CheckEmailPage = function () {
    var appId = useApp().id;
    var formatMessage = useIntl().formatMessage;
    var email = useQueryParam('email', StringParam)[0];
    var type = useQueryParam('type', StringParam)[0];
    var backendEndpoint = useAuth().backendEndpoint;
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var handleResendEmail = function () {
        setLoading(true);
        if (!email) {
            setTimeout(function () {
                setLoading(false);
            }, 3000);
            return;
        }
        axios
            .post(backendEndpoint + "/auth/forgot-password", {
            appId: appId,
            account: email,
        })
            .then(function (_a) {
            var code = _a.data.code;
            if (code === 'SUCCESS') {
                message.success(formatMessage(usersMessages.messages.resetPassword));
            }
            else {
                message.error(formatMessage(codeMessages[code]));
            }
        })
            .catch(handleError)
            .finally(function () { return setLoading(false); });
    };
    return (React.createElement(DefaultLayout, { noFooter: true, centeredBox: true },
        React.createElement(StyledContainer, null,
            React.createElement(StyledIcon, null,
                React.createElement(Icon, { src: CheckEmailIcon })),
            React.createElement("p", null, type === 'reset-password'
                ? formatMessage(commonMessages.content.checkEmailForSecurity)
                : formatMessage(commonMessages.content.checkEmail)),
            React.createElement("p", null, email),
            React.createElement(StyledAction, null,
                React.createElement("span", null, formatMessage(usersMessages.content.unreceivedEmail)),
                React.createElement(Button, { type: "link", size: "small", onClick: handleResendEmail, loading: loading }, formatMessage(commonMessages.button.resendEmail))))));
};
export default CheckEmailPage;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=CheckEmailPage.js.map
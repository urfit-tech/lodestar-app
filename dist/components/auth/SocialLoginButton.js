var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Button, message } from 'antd';
import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import SocialLogin from 'react-social-login';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useApp } from '../../containers/common/AppContext';
import { handleError } from '../../helpers';
import { authMessages, commonMessages } from '../../helpers/translation';
import FacebookLogoImage from '../../images/FB-logo.png';
import GoogleLogoImage from '../../images/google-logo.png';
import { useAuth } from './AuthContext';
import { AuthModalContext } from './AuthModal';
var StyledButton = styled(Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  span {\n    vertical-align: middle;\n  }\n\n  &:hover,\n  &:active,\n  &:focus {\n    border-color: transparent;\n  }\n"], ["\n  span {\n    vertical-align: middle;\n  }\n\n  &:hover,\n  &:active,\n  &:focus {\n    border-color: transparent;\n  }\n"])));
var FacebookLogo = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-right: 0.5rem;\n  height: 24px;\n  width: 24px;\n  background-image: url(", ");\n  background-size: 13px 24px;\n  background-repeat: no-repeat;\n  background-position: center;\n"], ["\n  margin-right: 0.5rem;\n  height: 24px;\n  width: 24px;\n  background-image: url(", ");\n  background-size: 13px 24px;\n  background-repeat: no-repeat;\n  background-position: center;\n"])), FacebookLogoImage);
var GoogleLogo = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-right: 0.5rem;\n  height: 24px;\n  width: 24px;\n  background-image: url(", ");\n  background-size: 24px 24px;\n  background-repeat: no-repeat;\n  background-position: center;\n"], ["\n  margin-right: 0.5rem;\n  height: 24px;\n  width: 24px;\n  background-image: url(", ");\n  background-size: 24px 24px;\n  background-repeat: no-repeat;\n  background-position: center;\n"])), GoogleLogoImage);
var WrappedSocialLoginButton = /** @class */ (function (_super) {
    __extends(WrappedSocialLoginButton, _super);
    function WrappedSocialLoginButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.render = function () {
            var _a = _this.props, triggerLogin = _a.triggerLogin, children = _a.children, restProps = __rest(_a, ["triggerLogin", "children"]);
            return (React.createElement(StyledButton, __assign({ onClick: triggerLogin }, restProps), children));
        };
        return _this;
    }
    return WrappedSocialLoginButton;
}(React.Component));
var SocialLoginButton = SocialLogin(WrappedSocialLoginButton);
export var FacebookLoginButton = function () {
    var formatMessage = useIntl().formatMessage;
    var back = useQueryParam('back', StringParam)[0];
    var host = window.location.hostname;
    return (React.createElement("a", { href: 'https://www.facebook.com/v6.0/dialog/oauth?client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&scope={{SCOPE}}&state={{STATE}}&response_type=token'
            .replace('{{CLIENT_ID}}', "" + process.env.REACT_APP_FACEBOOK_APP_ID)
            .replace('{{REDIRECT_URI}}', "https://" + host + "/oauth2")
            .replace('{{SCOPE}}', 'public_profile,email')
            .replace('{{STATE}}', JSON.stringify({
            provider: 'facebook',
            redirect: back || window.location.pathname,
        })) },
        React.createElement(StyledButton, { style: {
                border: '1px solid #3b5998',
                height: '44px',
                width: '100%',
                background: '#3b5998',
                color: '#fff',
            } },
            React.createElement(FacebookLogo, null),
            React.createElement("span", null, formatMessage(authMessages.content.loginFb)))));
};
export var GoogleLoginButton = function (_a) {
    var variant = _a.variant;
    var appId = useApp().id;
    var formatMessage = useIntl().formatMessage;
    var back = useQueryParam('back', StringParam)[0];
    var socialLogin = useAuth().socialLogin;
    var setVisible = useContext(AuthModalContext).setVisible;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var host = window.location.origin;
    var handleLoginSuccess = function (_a) {
        var _provider = _a._provider, idToken = _a._token.idToken;
        setLoading(true);
        socialLogin &&
            socialLogin({
                appId: appId,
                provider: _provider,
                providerToken: idToken,
            })
                .then(function () {
                setVisible && setVisible(false);
            })
                .catch(handleError)
                .finally(function () { return setLoading(false); });
    };
    var handleLoginFailure = function (error) {
        message.error(formatMessage(authMessages.message.googleError));
        process.env.NODE_ENV === 'development' && console.error(error);
    };
    if (variant === 'connect') {
        return (React.createElement(SocialLoginButton, { loading: loading, provider: "google", appId: process.env.REACT_APP_GOOGLE_CLIENT_ID, scope: "profile email openid", onLoginSuccess: handleLoginSuccess, onLoginFailure: handleLoginFailure }, formatMessage(commonMessages.button.socialConnect)));
    }
    return (React.createElement("a", { href: 'https://accounts.google.com/o/oauth2/v2/auth?client_id={{CLIENT_ID}}&response_type=token&scope={{SCOPE}}&access_type=online&redirect_uri={{REDIRECT_URI}}&state={{STATE}}'
            .replace('{{CLIENT_ID}}', "" + process.env.REACT_APP_GOOGLE_CLIENT_ID)
            .replace('{{REDIRECT_URI}}', host + "/oauth2")
            .replace('{{SCOPE}}', 'openid profile email')
            .replace('{{STATE}}', JSON.stringify({
            provider: 'google',
            redirect: back || window.location.pathname,
        })) },
        React.createElement(StyledButton, { style: {
                border: '1px solid #585858',
                height: '44px',
                width: '100%',
                background: '#fff',
                color: '#585858',
            } },
            React.createElement(GoogleLogo, null),
            React.createElement("span", null, formatMessage(authMessages.message.google)))));
};
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=SocialLoginButton.js.map
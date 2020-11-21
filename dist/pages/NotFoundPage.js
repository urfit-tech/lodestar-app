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
import { Button } from '@chakra-ui/react';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import DefaultLayout from '../components/layout/DefaultLayout';
import { commonMessages } from '../helpers/translation';
import routeErrorIcon from '../images/404.svg';
import errorIcon from '../images/error-2.svg';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 430px;\n  text-align: center;\n  color: var(--gray-darker);\n  padding: 0 1rem;\n"], ["\n  height: 430px;\n  text-align: center;\n  color: var(--gray-darker);\n  padding: 0 1rem;\n"])));
var StyledTitle = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-family: NotoSansCJKtc;\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.6;\n  letter-spacing: 1.5px;\n"], ["\n  font-family: NotoSansCJKtc;\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.6;\n  letter-spacing: 1.5px;\n"])));
var StyledDescription = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 1.25rem;\n  height: 3em;\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  margin-bottom: 1.25rem;\n  height: 3em;\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledButton = styled(function (props) { return React.createElement(Button, __assign({}, props)); })(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  && {\n    width: 160px;\n    height: 45px;\n    cursor: pointer;\n    background: transparent;\n    color: var(--gray-darker);\n    font-weight: 400;\n    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n    &:focus {\n      box-shadow: none;\n      outline: none;\n    }\n    &:hover {\n      background: transparent;\n      color: ", ";\n      border: 1px solid ", ";\n    }\n  }\n"], ["\n  && {\n    width: 160px;\n    height: 45px;\n    cursor: pointer;\n    background: transparent;\n    color: var(--gray-darker);\n    font-weight: 400;\n    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n    &:focus {\n      box-shadow: none;\n      outline: none;\n    }\n    &:hover {\n      background: transparent;\n      color: ", ";\n      border: 1px solid ", ";\n    }\n  }\n"])), function (props) { return props.theme['@error-color']; }, function (props) { return props.theme['@error-color']; });
var StyledErrorIcon = styled(Icon)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-top: 80px;\n  margin-bottom: 24px;\n"], ["\n  margin-top: 80px;\n  margin-bottom: 24px;\n"])));
var NotFoundPage = function (_a) {
    var error = _a.error;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var clickHandler = function () {
        if (error) {
            window.location.reload();
        }
        else {
            history.goBack();
        }
    };
    return (React.createElement(DefaultLayout, { centeredBox: true },
        React.createElement(StyledWrapper, null,
            React.createElement(StyledErrorIcon, { src: error ? errorIcon : routeErrorIcon }),
            React.createElement(StyledTitle, null, formatMessage(error ? commonMessages.title.error : commonMessages.title.routeError)),
            React.createElement(StyledDescription, null, formatMessage(error ? commonMessages.content.errorDescription : commonMessages.content.routeErrorDescription)),
            React.createElement(StyledButton, { onClick: clickHandler, variant: "outline" }, formatMessage(error ? commonMessages.button.reload : commonMessages.button.previousPage)))));
};
export default NotFoundPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=NotFoundPage.js.map
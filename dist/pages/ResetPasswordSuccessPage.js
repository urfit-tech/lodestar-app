var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DefaultLayout from '../components/layout/DefaultLayout';
import { commonMessages } from '../helpers/translation';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 4rem 1rem;\n  color: #585858;\n  text-align: center;\n"], ["\n  padding: 4rem 1rem;\n  color: #585858;\n  text-align: center;\n"])));
var ResetPasswordSuccessPage = function () {
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(DefaultLayout, { noFooter: true, centeredBox: true },
        React.createElement(StyledContainer, null,
            React.createElement("p", null, formatMessage(commonMessages.content.resetPassword)),
            React.createElement("div", null,
                React.createElement(Link, { to: "/" }, formatMessage(commonMessages.button.home))))));
};
export default ResetPasswordSuccessPage;
var templateObject_1;
//# sourceMappingURL=ResetPasswordSuccessPage.js.map
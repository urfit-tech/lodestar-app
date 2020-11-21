var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useState } from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import { useInterval } from '../../hooks/util';
import CalendarOIcon from '../../images/calendar-alt-o.svg';
import { BREAK_POINT } from './Responsive';
var StyledDiscountDown = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  @media (min-width: ", "px) {\n    &::before {\n      content: '';\n    }\n  }\n"], ["\n  @media (min-width: ", "px) {\n    &::before {\n      content: '';\n    }\n  }\n"])), BREAK_POINT);
var StyledNumberBlock = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  span:first-child {\n    display: inline-block;\n    min-width: 1.5rem;\n    text-align: center;\n  }\n  .text-primary {\n    color: ", ";\n  }\n"], ["\n  span:first-child {\n    display: inline-block;\n    min-width: 1.5rem;\n    text-align: center;\n  }\n  .text-primary {\n    color: ", ";\n  }\n"])), function (props) { return props.theme['@primary-color']; });
var CountDownTimeBlock = function (_a) {
    var text = _a.text, expiredAt = _a.expiredAt, icon = _a.icon;
    var formatMessage = useIntl().formatMessage;
    var countDown = expiredAt.getTime() - Date.now();
    var _b = useState(countDown / 1000), seconds = _b[0], setSeconds = _b[1];
    useInterval(function () { return setSeconds((expiredAt.getTime() - Date.now()) / 1000); }, 1000);
    if (countDown < 0) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        icon && React.createElement(Icon, { src: CalendarOIcon, className: "mr-2" }),
        React.createElement(StyledDiscountDown, { className: "discount-down mr-1" }, text || formatMessage(commonMessages.defaults.countdown)),
        seconds > 86400 && (React.createElement(StyledNumberBlock, null,
            React.createElement("span", { className: "text-primary" }, Math.floor(seconds / 86400)),
            React.createElement("span", null, formatMessage(commonMessages.unit.day)))),
        seconds > 3600 && (React.createElement(StyledNumberBlock, null,
            React.createElement("span", { className: "text-primary" }, Math.floor((seconds % 84600) / 3600)),
            React.createElement("span", null, formatMessage(commonMessages.unit.hour)))),
        seconds > 60 && (React.createElement(StyledNumberBlock, null,
            React.createElement("span", { className: "text-primary" }, Math.floor((seconds % 3600) / 60)),
            React.createElement("span", null, formatMessage(commonMessages.unit.min)))),
        seconds > 0 && (React.createElement(StyledNumberBlock, null,
            React.createElement("span", { className: "text-primary" }, Math.floor(seconds % 60)),
            React.createElement("span", null, formatMessage(commonMessages.unit.sec))))));
};
export default CountDownTimeBlock;
var templateObject_1, templateObject_2;
//# sourceMappingURL=CountDownTimeBlock.js.map
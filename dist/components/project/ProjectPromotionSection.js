var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button } from 'antd';
import React from 'react';
import Icon from 'react-inlinesvg';
import styled from 'styled-components';
import CalendarOIcon from '../../images/calendar-alt-o.svg';
import CountDownTimeBlock from '../common/CountDownTimeBlock';
import { BREAK_POINT } from '../common/Responsive';
var StyledView = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  z-index: 10;\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n  background-color: #323232;\n\n  p {\n    color: white;\n    margin: 0;\n    padding-right: 16px;\n    span:first-child {\n      display: none;\n    }\n  }\n\n  @media (min-width: ", "px) {\n    p span:first-child {\n      display: inline-block;\n    }\n  }\n"], ["\n  z-index: 10;\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n  background-color: #323232;\n\n  p {\n    color: white;\n    margin: 0;\n    padding-right: 16px;\n    span:first-child {\n      display: none;\n    }\n  }\n\n  @media (min-width: ", "px) {\n    p span:first-child {\n      display: inline-block;\n    }\n  }\n"])), BREAK_POINT);
var StyledWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 20px;\n"], ["\n  padding: 20px;\n"])));
var StyledSlogan = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 14px;\n  color: white;\n\n  @media (min-width: ", "px) {\n    font-size: 16px;\n  }\n"], ["\n  font-size: 14px;\n  color: white;\n\n  @media (min-width: ", "px) {\n    font-size: 16px;\n  }\n"])), BREAK_POINT);
var StyledCountDownTime = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: white;\n\n  .icon {\n    display: none;\n\n    @media (min-width: ", "px) {\n      display: inline-block;\n    }\n  }\n"], ["\n  color: white;\n\n  .icon {\n    display: none;\n\n    @media (min-width: ", "px) {\n      display: inline-block;\n    }\n  }\n"])), BREAK_POINT);
var ProjectPromotionSection = function (_a) {
    var promotions = _a.promotions, expiredAt = _a.expiredAt, button = _a.button;
    return (React.createElement(StyledView, { className: "d-flex align-items-center" },
        React.createElement(StyledWrapper, { className: "container" },
            React.createElement("div", { className: "row" },
                React.createElement(StyledSlogan, { className: "col-8 col-lg-10 d-flex flex-wrap justify-content-between align-items-center" },
                    React.createElement("div", null, promotions.map(function (promotion) { return (React.createElement("span", { key: promotion }, promotion)); })),
                    React.createElement(StyledCountDownTime, { className: "d-flex align-items-center justify-content-between" },
                        React.createElement(Icon, { src: CalendarOIcon, className: "icon mr-2" }),
                        expiredAt && React.createElement(CountDownTimeBlock, { text: "\u958B\u8AB2\u5012\u6578", expiredAt: expiredAt }))),
                React.createElement(Button, { type: "primary", className: "col-4 col-lg-2", href: button.href, target: "_blank", rel: "noopener noreferrer" },
                    React.createElement("span", null, button.label))))));
};
export default ProjectPromotionSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=ProjectPromotionSection.js.map
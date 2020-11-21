var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button } from 'antd';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import ProjectEnrollmentCounts from '../../containers/project/ProjectEnrollmentCounts';
import { commonMessages } from '../../helpers/translation';
import CalendarOIcon from '../../images/calendar-alt-o.svg';
import CountDownTimeBlock from '../common/CountDownTimeBlock';
import { BREAK_POINT } from '../common/Responsive';
var StyledJoin = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: #563952;\n  padding: 64px 0;\n  margin-bottom: 76px;\n\n  h3 {\n    position: relative;\n    margin: 0 auto;\n    width: 100%;\n    max-width: 420px;\n    font-size: 20px;\n    font-weight: bold;\n    letter-spacing: 0.77px;\n    text-align: center;\n    color: white;\n\n    &::before {\n      position: absolute;\n      bottom: 0px;\n      left: -15px;\n      content: url('https://static.kolable.com/images/xuemi/shine-01.svg');\n    }\n\n    &::after {\n      position: absolute;\n      bottom: -130px;\n      right: -10px;\n      content: url('https://static.kolable.com/images/xuemi/shine-02.svg');\n    }\n  }\n\n  @media (min-width: ", "px) {\n    padding: 80px 0;\n\n    h3 {\n      font-size: 28px;\n      max-width: 560px;\n\n      &::before {\n        bottom: 0px;\n        left: -100px;\n      }\n\n      &::after {\n        top: 15px;\n        right: -120px;\n      }\n    }\n  }\n"], ["\n  background-color: #563952;\n  padding: 64px 0;\n  margin-bottom: 76px;\n\n  h3 {\n    position: relative;\n    margin: 0 auto;\n    width: 100%;\n    max-width: 420px;\n    font-size: 20px;\n    font-weight: bold;\n    letter-spacing: 0.77px;\n    text-align: center;\n    color: white;\n\n    &::before {\n      position: absolute;\n      bottom: 0px;\n      left: -15px;\n      content: url('https://static.kolable.com/images/xuemi/shine-01.svg');\n    }\n\n    &::after {\n      position: absolute;\n      bottom: -130px;\n      right: -10px;\n      content: url('https://static.kolable.com/images/xuemi/shine-02.svg');\n    }\n  }\n\n  @media (min-width: ", "px) {\n    padding: 80px 0;\n\n    h3 {\n      font-size: 28px;\n      max-width: 560px;\n\n      &::before {\n        bottom: 0px;\n        left: -100px;\n      }\n\n      &::after {\n        top: 15px;\n        right: -120px;\n      }\n    }\n  }\n"])), BREAK_POINT);
var StyledHeader = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  > span {\n    display: block;\n    margin: 0 auto;\n    text-align: center;\n  }\n"], ["\n  > span {\n    display: block;\n    margin: 0 auto;\n    text-align: center;\n  }\n"])));
var StyledButton = styled(Button)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: block;\n  margin: 40px auto 0;\n"], ["\n  display: block;\n  margin: 40px auto 0;\n"])));
var StyledView = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  z-index: 10;\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n  background-color: #323232;\n\n  p {\n    color: white;\n    margin: 0;\n    padding-right: 16px;\n    span:first-child {\n      display: none;\n    }\n  }\n\n  @media (min-width: ", "px) {\n    p span:first-child {\n      display: inline-block;\n    }\n  }\n"], ["\n  z-index: 10;\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n  background-color: #323232;\n\n  p {\n    color: white;\n    margin: 0;\n    padding-right: 16px;\n    span:first-child {\n      display: none;\n    }\n  }\n\n  @media (min-width: ", "px) {\n    p span:first-child {\n      display: inline-block;\n    }\n  }\n"])), BREAK_POINT);
var StyledWrapper = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 20px;\n"], ["\n  padding: 20px;\n"])));
var StyledSlogan = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 14px;\n  color: white;\n\n  @media (min-width: ", "px) {\n    font-size: 16px;\n  }\n"], ["\n  font-size: 14px;\n  color: white;\n\n  @media (min-width: ", "px) {\n    font-size: 16px;\n  }\n"])), BREAK_POINT);
var StyledCountDownTime = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: white;\n\n  .icon {\n    display: none;\n\n    @media (min-width: ", "px) {\n      display: inline-block;\n    }\n  }\n"], ["\n  color: white;\n\n  .icon {\n    display: none;\n\n    @media (min-width: ", "px) {\n      display: inline-block;\n    }\n  }\n"])), BREAK_POINT);
var OnSaleCallToActionSection = function (_a) {
    var projectId = _a.projectId, updates = _a.updates, expiredAt = _a.expiredAt;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement("section", { className: "d-flex flex-column" },
        React.createElement(StyledJoin, { className: "d-flex justify-content-center align-items-center" },
            React.createElement("div", { className: "container" },
                React.createElement(StyledHeader, null, updates.headers.map(function (header) { return (React.createElement("span", { key: header }, header)); })),
                React.createElement(StyledButton, { type: "primary", onClick: function () { var _a; return (_a = document.getElementById('project-plan-section')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' }); } },
                    React.createElement("span", null,
                        "\u8207 ",
                        React.createElement(ProjectEnrollmentCounts, { projectId: projectId, numberOnly: true }),
                        " \u4EBA\u4E00\u8D77\u53C3\u8207")))),
        React.createElement(StyledView, { className: "d-flex align-items-center" },
            React.createElement(StyledWrapper, { className: "container" },
                React.createElement("div", { className: "row" },
                    React.createElement(StyledSlogan, { className: "col-8 col-lg-10 d-flex flex-wrap justify-content-between align-items-center" },
                        React.createElement("div", null,
                            updates.promotes.map(function (promote) { return (React.createElement("span", { key: promote }, promote)); }),
                            React.createElement("span", null,
                                "\u5DF2\u6709 ",
                                React.createElement(ProjectEnrollmentCounts, { projectId: projectId, numberOnly: true }),
                                " \u4EBA\u4E00\u8D77\u5B78\u7FD2")),
                        React.createElement(StyledCountDownTime, { className: "d-flex align-items-center justify-content-between" },
                            React.createElement(Icon, { src: CalendarOIcon, className: "icon mr-2" }),
                            expiredAt && React.createElement(CountDownTimeBlock, { expiredAt: expiredAt }))),
                    React.createElement(Button, { type: "primary", className: "col-4 col-lg-2", onClick: function () { var _a; return (_a = document.getElementById('project-plan-section')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' }); } },
                        React.createElement("span", null, formatMessage(commonMessages.button.viewProject))))))));
};
export default OnSaleCallToActionSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=OnSaleCallToActionSection.js.map
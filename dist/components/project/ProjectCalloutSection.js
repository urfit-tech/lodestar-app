var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { BREAK_POINT } from '../common/Responsive';
import ProjectCalloutButton from './ProjectCalloutButton';
var StyledJoin = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: #ffeae3;\n  padding: 64px 0;\n  margin-bottom: 76px;\n\n  h3 {\n    position: relative;\n    margin: 0 auto;\n    width: 100%;\n    max-width: 420px;\n    font-size: 20px;\n    font-weight: bold;\n    letter-spacing: 0.77px;\n    text-align: center;\n    color: var(--gray-darker);\n\n    &::before {\n      position: absolute;\n      bottom: 0px;\n      left: -15px;\n      content: url('https://static.kolable.com/images/xuemi/shine-01.svg');\n    }\n\n    &::after {\n      position: absolute;\n      bottom: -130px;\n      right: -10px;\n      content: url('https://static.kolable.com/images/xuemi/shine-02.svg');\n    }\n  }\n\n  @media (min-width: ", "px) {\n    padding: 80px 0;\n\n    h3 {\n      font-size: 28px;\n      max-width: 560px;\n\n      &::before {\n        bottom: 0px;\n        left: -100px;\n      }\n\n      &::after {\n        top: 15px;\n        right: -120px;\n      }\n    }\n  }\n"], ["\n  background-color: #ffeae3;\n  padding: 64px 0;\n  margin-bottom: 76px;\n\n  h3 {\n    position: relative;\n    margin: 0 auto;\n    width: 100%;\n    max-width: 420px;\n    font-size: 20px;\n    font-weight: bold;\n    letter-spacing: 0.77px;\n    text-align: center;\n    color: var(--gray-darker);\n\n    &::before {\n      position: absolute;\n      bottom: 0px;\n      left: -15px;\n      content: url('https://static.kolable.com/images/xuemi/shine-01.svg');\n    }\n\n    &::after {\n      position: absolute;\n      bottom: -130px;\n      right: -10px;\n      content: url('https://static.kolable.com/images/xuemi/shine-02.svg');\n    }\n  }\n\n  @media (min-width: ", "px) {\n    padding: 80px 0;\n\n    h3 {\n      font-size: 28px;\n      max-width: 560px;\n\n      &::before {\n        bottom: 0px;\n        left: -100px;\n      }\n\n      &::after {\n        top: 15px;\n        right: -120px;\n      }\n    }\n  }\n"])), BREAK_POINT);
var StyledHeader = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  > span {\n    display: block;\n    margin: 0 auto;\n    text-align: center;\n  }\n"], ["\n  > span {\n    display: block;\n    margin: 0 auto;\n    text-align: center;\n  }\n"])));
var ProjectCalloutSection = function (_a) {
    var title = _a.title, callout = _a.callout;
    return (React.createElement("section", { className: "d-flex flex-column" },
        React.createElement(StyledJoin, { className: "d-flex justify-content-center align-items-center" },
            React.createElement("div", { className: "container" },
                React.createElement(StyledHeader, null, title.split(';').map(function (value, idx) { return (React.createElement("span", { key: idx }, value)); })),
                React.createElement("div", { className: "pt-4 d-flex justify-content-center" }, callout && React.createElement(ProjectCalloutButton, { href: callout.href, label: callout.label }))))));
};
export default ProjectCalloutSection;
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProjectCalloutSection.js.map
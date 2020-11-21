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
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { productMessages } from '../../helpers/translation';
import { BREAK_POINT } from '../common/Responsive';
import ProjectPlanCard from './ProjectPlanCard';
var StyledSection = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: var(--gray-lighter);\n"], ["\n  background-color: var(--gray-lighter);\n"])));
var StyledWrapper = styled.section(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 60px 20px;\n  > h3 {\n    text-align: center;\n    font-size: 28px;\n    font-weight: bold;\n    letter-spacing: 0.23px;\n    color: var(--gray-darker);\n  }\n  > p {\n    margin: 0 auto;\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n    text-align: center;\n    color: var(--gray-darker);\n    width: 100%;\n    max-width: 320px;\n    padding-bottom: 40px;\n  }\n  @media (min-width: ", "px) {\n    padding: 120px 0;\n    > h3 {\n      font-size: 40px;\n      letter-spacing: 1px;\n      color: var(--gray-darker);\n    }\n    > p {\n      width: 100%;\n      padding-bottom: 64px;\n    }\n  }\n"], ["\n  padding: 60px 20px;\n  > h3 {\n    text-align: center;\n    font-size: 28px;\n    font-weight: bold;\n    letter-spacing: 0.23px;\n    color: var(--gray-darker);\n  }\n  > p {\n    margin: 0 auto;\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n    text-align: center;\n    color: var(--gray-darker);\n    width: 100%;\n    max-width: 320px;\n    padding-bottom: 40px;\n  }\n  @media (min-width: ", "px) {\n    padding: 120px 0;\n    > h3 {\n      font-size: 40px;\n      letter-spacing: 1px;\n      color: var(--gray-darker);\n    }\n    > p {\n      width: 100%;\n      padding-bottom: 64px;\n    }\n  }\n"])), BREAK_POINT);
var StyledContainer = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0 auto;\n  max-width: 348px;\n\n  > div {\n    padding-bottom: 20px;\n  }\n\n  @media (min-width: ", "px) {\n    width: 100%;\n    max-width: 700px;\n  }\n"], ["\n  margin: 0 auto;\n  max-width: 348px;\n\n  > div {\n    padding-bottom: 20px;\n  }\n\n  @media (min-width: ", "px) {\n    width: 100%;\n    max-width: 700px;\n  }\n"])), BREAK_POINT);
var OnSaleProjectPlanSection = function (_a) {
    var projectPlans = _a.projectPlans;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(StyledSection, { id: "project-plan-section" },
        React.createElement(StyledWrapper, null,
            React.createElement("h3", null, formatMessage(productMessages.project.title.intro)),
            React.createElement("p", null, formatMessage(productMessages.project.paragraph.intro)),
            React.createElement(StyledContainer, { className: "row" }, projectPlans.map(function (projectPlan) { return (React.createElement("div", { key: projectPlan.id, className: "col-lg-6 col-12" },
                React.createElement(ProjectPlanCard, __assign({}, projectPlan)))); })))));
};
export default OnSaleProjectPlanSection;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=OnSaleProjectPlanSection.js.map
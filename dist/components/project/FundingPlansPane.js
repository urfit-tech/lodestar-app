var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { BREAK_POINT } from '../common/Responsive';
import ProjectPlanCollection from './ProjectPlanCollection';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  > * {\n    width: 100%;\n  }\n\n  @media (min-width: 768px) {\n    > * {\n      width: 50%;\n      padding: 0 1em;\n    }\n  }\n\n  @media (min-width: ", "px) {\n    > * {\n      width: calc(100% / 3);\n      padding: 0 1em;\n    }\n  }\n"], ["\n  > * {\n    width: 100%;\n  }\n\n  @media (min-width: 768px) {\n    > * {\n      width: 50%;\n      padding: 0 1em;\n    }\n  }\n\n  @media (min-width: ", "px) {\n    > * {\n      width: calc(100% / 3);\n      padding: 0 1em;\n    }\n  }\n"])), BREAK_POINT);
var FundingPlansPane = function (_a) {
    var projectPlans = _a.projectPlans;
    return (React.createElement("div", { className: "container mb-5", id: "funding-plans" },
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12" },
                React.createElement(StyledWrapper, { className: "d-flex align-items-start justify-content-start flex-wrap" },
                    React.createElement(ProjectPlanCollection, { projectPlans: projectPlans }))))));
};
export default FundingPlansPane;
var templateObject_1;
//# sourceMappingURL=FundingPlansPane.js.map
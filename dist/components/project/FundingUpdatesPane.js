var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Timeline, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import ProjectPlanCollection from './ProjectPlanCollection';
var StyledTimeline = styled(Timeline)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ant-timeline-item-content {\n    margin-left: 3rem;\n  }\n\n  img {\n    margin-bottom: 1.25rem;\n    width: 100%;\n  }\n"], ["\n  .ant-timeline-item-content {\n    margin-left: 3rem;\n  }\n\n  img {\n    margin-bottom: 1.25rem;\n    width: 100%;\n  }\n"])));
var StyledTitle = styled(Typography.Title)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    margin-bottom: 0.5rem;\n    font-size: 20px;\n  }\n"], ["\n  && {\n    margin-bottom: 0.5rem;\n    font-size: 20px;\n  }\n"])));
var StyledMeta = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 1rem;\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 14px;\n"], ["\n  margin-bottom: 1rem;\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 14px;\n"])));
var StyledParagraph = styled(Typography.Paragraph)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  && {\n    color: #585858;\n    font-size: 14px;\n    text-align: justify;\n  }\n"], ["\n  && {\n    color: #585858;\n    font-size: 14px;\n    text-align: justify;\n  }\n"])));
var FundingUpdatesPane = function (_a) {
    var updates = _a.updates, projectPlans = _a.projectPlans;
    return (React.createElement("div", { className: "container" },
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12 col-lg-8 mb-5" },
                React.createElement(StyledTimeline, null, updates.map(function (update, index) { return (React.createElement(Timeline.Item, { key: index },
                    React.createElement(StyledTitle, { level: 2 }, update.title),
                    React.createElement(StyledMeta, null, update.date),
                    update.cover && React.createElement("img", { src: update.cover, alt: update.title }),
                    React.createElement(StyledParagraph, null, update.description))); }))),
            React.createElement("div", { className: "col-12 col-lg-4 mb-5" },
                React.createElement(ProjectPlanCollection, { projectPlans: projectPlans })))));
};
export default FundingUpdatesPane;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=FundingUpdatesPane.js.map
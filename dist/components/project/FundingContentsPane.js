var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Collapse, Icon, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import ProjectPlanCollection from './ProjectPlanCollection';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 3.5rem;\n"], ["\n  margin-bottom: 3.5rem;\n"])));
var StyledHeader = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 2rem;\n  padding-left: 1rem;\n  border-left: 5px solid ", ";\n"], ["\n  margin-bottom: 2rem;\n  padding-left: 1rem;\n  border-left: 5px solid ", ";\n"])), function (props) { return props.theme['@primary-color']; });
var StyledTitle = styled(Typography.Title)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    margin-bottom: 0.25rem;\n    font-size: 20px;\n  }\n"], ["\n  && {\n    margin-bottom: 0.25rem;\n    font-size: 20px;\n  }\n"])));
var StyledMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 12px;\n"], ["\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 12px;\n"])));
var StyledCollapse = styled(Collapse)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  && {\n    border: none;\n    background: none;\n\n    > div {\n      margin-bottom: 0.75rem;\n      padding: 0;\n      border: none;\n      background: #f7f8f8;\n    }\n    .ant-collapse-header {\n      font-weight: bold;\n      padding: 1.25rem;\n    }\n    .ant-collapse-content {\n      border: none;\n    }\n    .ant-collapse-content-box {\n      padding: 1rem 2rem;\n    }\n  }\n"], ["\n  && {\n    border: none;\n    background: none;\n\n    > div {\n      margin-bottom: 0.75rem;\n      padding: 0;\n      border: none;\n      background: #f7f8f8;\n    }\n    .ant-collapse-header {\n      font-weight: bold;\n      padding: 1.25rem;\n    }\n    .ant-collapse-content {\n      border: none;\n    }\n    .ant-collapse-content-box {\n      padding: 1rem 2rem;\n    }\n  }\n"])));
var FundingContentsPane = function (_a) {
    var contents = _a.contents, projectPlans = _a.projectPlans;
    return (React.createElement("div", { className: "container" },
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12 col-lg-8 mb-5" }, contents.map(function (content) { return (React.createElement(StyledWrapper, { key: content.title },
                React.createElement(StyledHeader, null,
                    React.createElement(StyledTitle, { level: 2 }, content.title),
                    React.createElement(StyledMeta, null, content.subtitle)),
                React.createElement(StyledCollapse, { accordion: true, expandIconPosition: "right", expandIcon: function (_a) {
                        var isActive = _a.isActive;
                        return React.createElement(Icon, { type: "caret-right", rotate: isActive ? 90 : 0 });
                    } }, content.contents.map(function (content, index) { return (React.createElement(Collapse.Panel, { header: content.title, key: content.title + index },
                    React.createElement("div", { dangerouslySetInnerHTML: { __html: content.description } }))); })))); })),
            React.createElement("div", { className: "col-12 col-lg-4 mb-5" },
                React.createElement(ProjectPlanCollection, { projectPlans: projectPlans })))));
};
export default FundingContentsPane;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=FundingContentsPane.js.map
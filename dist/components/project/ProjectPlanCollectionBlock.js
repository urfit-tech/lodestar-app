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
import { Divider, Tag } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import { BraftContent } from '../common/StyledBraftEditor';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 2rem;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);\n"], ["\n  padding: 2rem;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);\n"])));
var StyledProjectTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledTag = styled(Tag)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    border-color: #cdcdcd;\n    color: #9b9b9b;\n    background: #f7f8f8;\n  }\n  &&.active {\n    border-color: ", ";\n    color: ", ";\n    background: ", ";\n  }\n"], ["\n  && {\n    border-color: #cdcdcd;\n    color: #9b9b9b;\n    background: #f7f8f8;\n  }\n  &&.active {\n    border-color: ", ";\n    color: ", ";\n    background: ", ";\n  }\n"])), function (props) { return props.theme['@primary-color']; }, function (props) { return props.theme['@primary-color']; }, function (props) { return props.theme['@processing-color']; });
var StyledProjectPlanTitle = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledDescription = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 14px;\n"], ["\n  font-size: 14px;\n"])));
var ProjectPlanCollectionBlock = function (_a) {
    var projectPlans = _a.projectPlans;
    return (React.createElement("div", { className: "container py-3" },
        React.createElement("div", { className: "row" }, projectPlans.map(function (projectPlan) { return (React.createElement("div", { key: projectPlan.id, className: "col-12 mb-4 col-sm-6 col-md-4" },
            React.createElement(Link, { to: "/projects/" + projectPlan.project.id },
                React.createElement(ProjectPlanBlock, __assign({}, projectPlan))))); }))));
};
var ProjectPlanBlock = function (_a) {
    var title = _a.title, description = _a.description, project = _a.project;
    var formatMessage = useIntl().formatMessage;
    var isExpired = project.expiredAt && project.expiredAt.getTime() < Date.now();
    return (React.createElement(StyledWrapper, null,
        React.createElement(StyledProjectTitle, { className: "mb-4" }, project.title),
        React.createElement(StyledTag, { className: isExpired ? '' : 'active' }, isExpired ? formatMessage(commonMessages.status.projectFinished) : formatMessage(commonMessages.status.onSale)),
        React.createElement(Divider, null),
        React.createElement(StyledProjectPlanTitle, { className: "mb-3" }, title),
        React.createElement(StyledDescription, null,
            React.createElement(BraftContent, null, description))));
};
export default ProjectPlanCollectionBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=ProjectPlanCollectionBlock.js.map
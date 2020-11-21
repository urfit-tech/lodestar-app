var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { AvatarImage } from '../common/Image';
import ProjectPlanCollection from './ProjectPlanCollection';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 2.5rem;\n  font-size: 14px;\n"], ["\n  margin-bottom: 2.5rem;\n  font-size: 14px;\n"])));
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 0.5rem;\n  font-size: 16px;\n  font-weight: bold;\n"], ["\n  margin-bottom: 0.5rem;\n  font-size: 16px;\n  font-weight: bold;\n"])));
var StyledDescription = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding-left: 4rem;\n  color: #585858;\n  text-align: justify;\n  line-height: 1.5;\n  letter-spacing: 0.18px;\n"], ["\n  padding-left: 4rem;\n  color: #585858;\n  text-align: justify;\n  line-height: 1.5;\n  letter-spacing: 0.18px;\n"])));
var FundingCommentsPane = function (_a) {
    var comments = _a.comments, projectPlans = _a.projectPlans;
    return (React.createElement("div", { className: "container" },
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12 col-lg-8 mb-5" }, comments.map(function (comment, index) { return (React.createElement(StyledWrapper, { key: index },
                React.createElement("div", { className: "d-flex align-items-center" },
                    React.createElement(AvatarImage, { src: comment.avatar, size: 48, background: "white" }),
                    React.createElement("span", { className: "ml-3" }, comment.name)),
                React.createElement(StyledDescription, null,
                    !!comment.title && React.createElement(StyledTitle, null, comment.title),
                    React.createElement("p", null, comment.description)))); })),
            React.createElement("div", { className: "col-12 col-lg-4 mb-5" },
                React.createElement(ProjectPlanCollection, { projectPlans: projectPlans })))));
};
export default FundingCommentsPane;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=FundingCommentsPane.js.map
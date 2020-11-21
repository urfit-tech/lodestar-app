var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon } from 'antd';
import React from 'react';
import styled from 'styled-components';
import FundingProgressBlock from '../../components/project/FundingProgressBlock';
import ProjectEnrollmentCounts from '../../containers/project/ProjectEnrollmentCounts';
import CountDownTimeBlock from '../common/CountDownTimeBlock';
import { BREAK_POINT } from '../common/Responsive';
var StyledFundingSummaryBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1.5rem 15px;\n  color: var(--gray-darker);\n\n  @media (min-width: ", "px) {\n    padding: 0 15px;\n  }\n"], ["\n  padding: 1.5rem 15px;\n  color: var(--gray-darker);\n\n  @media (min-width: ", "px) {\n    padding: 0 15px;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    color: var(--gray-darker);\n    font-size: 24px;\n    font-weight: 600;\n    line-height: 1.35;\n    letter-spacing: 0.3px;\n  }\n\n  @media (min-width: ", "px) {\n    && {\n      font-size: 40px;\n    }\n  }\n"], ["\n  && {\n    color: var(--gray-darker);\n    font-size: 24px;\n    font-weight: 600;\n    line-height: 1.35;\n    letter-spacing: 0.3px;\n  }\n\n  @media (min-width: ", "px) {\n    && {\n      font-size: 40px;\n    }\n  }\n"])), BREAK_POINT);
var StyledDescription = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    color: var(--gray-darker);\n    font-size: 14px;\n    font-weight: 500;\n  }\n"], ["\n  && {\n    color: var(--gray-darker);\n    font-size: 14px;\n    font-weight: 500;\n  }\n"])));
var StyledCountDownBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  background: #f8f8f8;\n"], ["\n  background: #f8f8f8;\n"])));
var FundingSummaryBlock = function (_a) {
    var projectId = _a.projectId, title = _a.title, description = _a.description, targetAmount = _a.targetAmount, targetUnit = _a.targetUnit, expiredAt = _a.expiredAt, type = _a.type, isParticipantsVisible = _a.isParticipantsVisible, isCountdownTimerVisible = _a.isCountdownTimerVisible, totalSales = _a.totalSales, enrollmentCount = _a.enrollmentCount;
    return (React.createElement(StyledFundingSummaryBlock, null,
        React.createElement(StyledTitle, null, title),
        React.createElement(StyledDescription, { className: "mb-3" }, description),
        type === 'funding' && (React.createElement(React.Fragment, null,
            React.createElement(FundingProgressBlock, { targetAmount: targetAmount, targetUnit: targetUnit, totalSales: totalSales, enrollmentCount: enrollmentCount }),
            expiredAt && (React.createElement(StyledDescription, null, isCountdownTimerVisible && React.createElement(CountDownTimeBlock, { expiredAt: expiredAt }))))),
        type === 'pre-order' && expiredAt && (React.createElement(React.Fragment, null,
            isCountdownTimerVisible && (React.createElement(StyledCountDownBlock, { className: "mb-3 p-4" },
                React.createElement(Icon, { type: "calendar", className: "mr-2" }),
                React.createElement(CountDownTimeBlock, { expiredAt: expiredAt }))),
            React.createElement(StyledDescription, null, isParticipantsVisible && React.createElement(ProjectEnrollmentCounts, { projectId: projectId }))))));
};
export default FundingSummaryBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=FundingSummaryBlock.js.map
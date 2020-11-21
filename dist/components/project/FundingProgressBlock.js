var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Progress } from 'antd';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { commonMessages, productMessages, projectMessages } from '../../helpers/translation';
import PriceLabel from '../common/PriceLabel';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  margin-bottom: 1rem;\n  padding: 1.5rem;\n  background: #f8f8f8;\n"], ["\n  position: relative;\n  margin-bottom: 1rem;\n  padding: 1.5rem;\n  background: #f8f8f8;\n"])));
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: ", ";\n  font-weight: bold;\n  letter-spacing: 0.3px;\n"], ["\n  font-size: ", ";\n  font-weight: bold;\n  letter-spacing: 0.3px;\n"])), function (props) { return (props.variant === 'participants' ? '18px' : '24px'); });
var StyledMeta = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 12px;\n"], ["\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 12px;\n"])));
var StyledDescription = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-top: 1.25rem;\n  font-size: 14px;\n  font-weight: bold;\n"], ["\n  margin-top: 1.25rem;\n  font-size: 14px;\n  font-weight: bold;\n"])));
var StyledGoalAchievedBlock = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  width: 48px;\n  height: 48px;\n  background-color: var(--warning);\n  box-shadow: 2px 2px 8px 0 rgba(222, 186, 96, 0.3);\n  color: white;\n  font-size: 12px;\n  line-height: 1.17;\n  letter-spacing: 0.58px;\n  transform: rotate(9deg);\n  border-radius: 50%;\n\n  div {\n    position: relative;\n  }\n\n  ::before {\n    display: block;\n    position: absolute;\n    left: 10px;\n    bottom: 0;\n    width: 16px;\n    height: 16px;\n    content: ' ';\n    background-color: var(--warning);\n    transform: rotate(80deg) skew(10deg, 10deg);\n  }\n"], ["\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  width: 48px;\n  height: 48px;\n  background-color: var(--warning);\n  box-shadow: 2px 2px 8px 0 rgba(222, 186, 96, 0.3);\n  color: white;\n  font-size: 12px;\n  line-height: 1.17;\n  letter-spacing: 0.58px;\n  transform: rotate(9deg);\n  border-radius: 50%;\n\n  div {\n    position: relative;\n  }\n\n  ::before {\n    display: block;\n    position: absolute;\n    left: 10px;\n    bottom: 0;\n    width: 16px;\n    height: 16px;\n    content: ' ';\n    background-color: var(--warning);\n    transform: rotate(80deg) skew(10deg, 10deg);\n  }\n"])));
var StyleProgress = styled(Progress)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  &.ant-progress-zero {\n    & .ant-progress-text {\n      color: #ececec;\n    }\n  }\n  & span.ant-progress-text {\n    color: #585858;\n  }\n  &.ant-progress-status-success {\n    & span.ant-progress-text {\n      color: #585858;\n    }\n  }\n"], ["\n  &.ant-progress-zero {\n    & .ant-progress-text {\n      color: #ececec;\n    }\n  }\n  & span.ant-progress-text {\n    color: #585858;\n  }\n  &.ant-progress-status-success {\n    & span.ant-progress-text {\n      color: #585858;\n    }\n  }\n"])));
var FundingProgressBlock = function (_a) {
    var targetAmount = _a.targetAmount, targetUnit = _a.targetUnit, totalSales = _a.totalSales, enrollmentCount = _a.enrollmentCount;
    var theme = useContext(ThemeContext);
    var formatMessage = useIntl().formatMessage;
    var percent = !targetAmount
        ? 0
        : Math.floor(((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount);
    return (React.createElement(StyledWrapper, { className: "d-flex justify-content-between align-items-center" },
        targetUnit === 'participants' ? (React.createElement("div", null,
            React.createElement(StyledTitle, { variant: "participants" }, formatMessage(projectMessages.text.totalParticipants, { count: enrollmentCount })),
            React.createElement(StyledMeta, null,
                formatMessage(productMessages.project.paragraph.goal),
                " ",
                targetAmount,
                ' ',
                formatMessage(commonMessages.unit.people)))) : (React.createElement("div", null,
            React.createElement(StyledTitle, null,
                React.createElement(PriceLabel, { listPrice: totalSales })),
            React.createElement(StyledMeta, null,
                formatMessage(productMessages.project.paragraph.goal),
                " ",
                React.createElement(PriceLabel, { listPrice: targetAmount })),
            React.createElement(StyledDescription, null,
                formatMessage(productMessages.project.paragraph.numberOfParticipants),
                " ",
                enrollmentCount,
                ' ',
                formatMessage(commonMessages.unit.people)))),
        React.createElement(StyleProgress, { type: "circle", className: !targetAmount || (targetUnit === 'participants' ? enrollmentCount === 0 : totalSales === 0)
                ? 'ant-progress-zero'
                : '', percent: percent, format: function () {
                return !targetAmount
                    ? 0
                    : Math.floor(((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount) + "%";
            }, status: "normal", width: 70, strokeColor: theme['@primary-color'], strokeWidth: 10 }),
        percent >= 100 && (React.createElement(StyledGoalAchievedBlock, { className: "d-flex align-items-center justify-content-center" },
            React.createElement("div", null,
                "\u52DF\u8CC7",
                React.createElement("br", null),
                "\u9054\u6A19")))));
};
export default FundingProgressBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=FundingProgressBlock.js.map
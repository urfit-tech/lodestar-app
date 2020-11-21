var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Progress } from 'antd';
import moment from 'moment';
import React, { useContext } from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { CustomRatioImage } from '../../components/common/Image';
import PriceLabel from '../../components/common/PriceLabel';
import { projectMessages } from '../../helpers/translation';
import CalendarAltOIcon from '../../images/calendar-alt-o.svg';
import EmptyCover from '../../images/empty-cover.png';
import UserOIcon from '../../images/user-o.svg';
var messages = defineMessages({
    people: { id: 'common.unit.people', defaultMessage: '{count} {count, plural, one {人} other {人}}' },
    onSaleCountDownDays: {
        id: 'project.label.onSaleCountDownDays',
        defaultMessage: '促銷倒數 {days} {days, plural, one {天} other {天}}',
    },
    isExpired: { id: 'project.label.isExpired', defaultMessage: '已結束' },
    isExpiredFunding: { id: 'project.label.isExpiredFunding', defaultMessage: '募資結束' },
});
var StyledCard = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow: hidden;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);\n"], ["\n  overflow: hidden;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);\n"])));
var StyledCardBody = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 1.5rem 1.25rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  text-align: justify;\n  line-height: 1.5rem;\n"], ["\n  padding: 1.5rem 1.25rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  text-align: justify;\n  line-height: 1.5rem;\n"])));
var StyledCardTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  height: 3rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  text-align: justify;\n  line-height: 1.5rem;\n"], ["\n  margin-bottom: 0.75rem;\n  height: 3rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  text-align: justify;\n  line-height: 1.5rem;\n"])));
var StyledCardDescription = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-bottom: 3.5rem;\n  height: 3rem;\n  overflow: hidden;\n"], ["\n  margin-bottom: 3.5rem;\n  height: 3rem;\n  overflow: hidden;\n"])));
var StyledCardMeta = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  min-height: 1.5rem;\n"], ["\n  min-height: 1.5rem;\n"])));
var StyledLabel = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), function (props) { return props.theme['@primary-color']; });
var StyleProgress = styled(Progress)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  &.ant-progress-zero {\n    & .ant-progress-text {\n      color: #ececec;\n    }\n  }\n  & span.ant-progress-text {\n    color: #585858;\n  }\n  &.ant-progress-status-success {\n    & span.ant-progress-text {\n      color: #585858;\n    }\n  }\n"], ["\n  &.ant-progress-zero {\n    & .ant-progress-text {\n      color: #ececec;\n    }\n  }\n  & span.ant-progress-text {\n    color: #585858;\n  }\n  &.ant-progress-status-success {\n    & span.ant-progress-text {\n      color: #585858;\n    }\n  }\n"])));
var ProjectIntroCard = function (_a) {
    var type = _a.type, title = _a.title, coverUrl = _a.coverUrl, previewUrl = _a.previewUrl, description = _a.description, targetAmount = _a.targetAmount, targetUnit = _a.targetUnit, expiredAt = _a.expiredAt, isParticipantsVisible = _a.isParticipantsVisible, isCountdownTimerVisible = _a.isCountdownTimerVisible, totalSales = _a.totalSales, enrollmentCount = _a.enrollmentCount;
    var formatMessage = useIntl().formatMessage;
    var theme = useContext(ThemeContext);
    return (React.createElement(StyledCard, null,
        React.createElement(CustomRatioImage, { ratio: 0.56, width: "100%", src: previewUrl || coverUrl || EmptyCover }),
        React.createElement(StyledCardBody, null,
            React.createElement(StyledCardTitle, null, title),
            React.createElement(StyledCardDescription, null, description),
            React.createElement(StyledCardMeta, { className: "d-flex align-items-end justify-content-between" },
                React.createElement("div", null, type === 'funding' ? (React.createElement(StyleProgress, { className: !targetAmount || (targetUnit === 'participants' ? enrollmentCount === 0 : totalSales === 0)
                        ? 'ant-progress-zero'
                        : '', type: "circle", percent: !targetAmount
                        ? 0
                        : Math.floor(((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount), width: 50, strokeWidth: 12, strokeColor: theme['@primary-color'], format: function () {
                        return (!targetAmount
                            ? 0
                            : Math.floor(((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount)) + "%";
                    } })) : isParticipantsVisible ? (React.createElement(React.Fragment, null,
                    React.createElement(Icon, { src: UserOIcon, className: "mr-1" }),
                    formatMessage(messages.people, { count: enrollmentCount }))) : null),
                React.createElement("div", { className: "text-right" },
                    type === 'funding' && (React.createElement(StyledLabel, null, targetUnit === 'participants' ? (formatMessage(projectMessages.text.totalParticipants, { count: enrollmentCount })) : (React.createElement(PriceLabel, { listPrice: totalSales || 0 })))),
                    isCountdownTimerVisible && expiredAt && (React.createElement(React.Fragment, null, moment().isAfter(expiredAt) ? (React.createElement("div", null,
                        React.createElement(Icon, { src: CalendarAltOIcon, className: "mr-1" }),
                        type === 'funding' ? formatMessage(messages.isExpiredFunding) : formatMessage(messages.isExpired))) : (React.createElement(StyledLabel, null,
                        React.createElement(Icon, { src: CalendarAltOIcon, className: "mr-1" }),
                        formatMessage(messages.onSaleCountDownDays, {
                            days: moment(expiredAt).diff(new Date(), 'days'),
                        }))))))))));
};
export default ProjectIntroCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=ProjectIntroCard.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Divider, Tag } from 'antd';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { dateRangeFormatter } from '../../helpers';
import { commonMessages, productMessages } from '../../helpers/translation';
import UserOIcon from '../../images/user-o.svg';
import PriceLabel from '../common/PriceLabel';
import { BraftContent } from '../common/StyledBraftEditor';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1.5rem;\n  background-color: white;\n  color: var(--gray-darker);\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n"], ["\n  padding: 1.5rem;\n  background-color: white;\n  color: var(--gray-darker);\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n"])));
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledLabel = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n\n  &::before {\n    display: block;\n    position: absolute;\n    top: 5px;\n    left: -18px;\n    width: 10px;\n    height: 10px;\n    background-color: ", ";\n    content: '';\n    border-radius: 50%;\n  }\n"], ["\n  position: relative;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n\n  &::before {\n    display: block;\n    position: absolute;\n    top: 5px;\n    left: -18px;\n    width: 10px;\n    height: 10px;\n    background-color: ", ";\n    content: '';\n    border-radius: 50%;\n  }\n"])), function (props) { return (props.active ? 'var(--success)' : 'var(--gray)'); });
var StyledPrice = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledSubTitle = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-top: 1.25rem;\n  margin-bottom: 0.5rem;\n  color: var(--gray-darker);\n  font-size: 14px;\n  font-weight: bold;\n  letter-spacing: 0.4px;\n"], ["\n  margin-top: 1.25rem;\n  margin-bottom: 0.5rem;\n  color: var(--gray-darker);\n  font-size: 14px;\n  font-weight: bold;\n  letter-spacing: 0.4px;\n"])));
var StyledTag = styled(Tag)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  && {\n    padding: 0.25rem 0.75rem;\n  }\n"], ["\n  && {\n    padding: 0.25rem 0.75rem;\n  }\n"])));
var StyledDescription = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  font-size: 14px;\n"], ["\n  font-size: 14px;\n"])));
var StyledMeta = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  letter-spacing: 0px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  letter-spacing: 0px;\n"])));
var StyledExtraAdmin = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  margin-top: 1.25rem;\n  color: var(--gray-darker);\n  font-size: 16px;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"], ["\n  margin-top: 1.25rem;\n  color: var(--gray-darker);\n  font-size: 16px;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"])));
var ActivityTicket = function (_a) {
    var title = _a.title, description = _a.description, price = _a.price, count = _a.count, startedAt = _a.startedAt, endedAt = _a.endedAt, isPublished = _a.isPublished, activitySessionTickets = _a.activitySessionTickets, participants = _a.participants, variant = _a.variant, extra = _a.extra;
    var formatMessage = useIntl().formatMessage;
    var status = !isPublished || Date.now() < startedAt.getTime()
        ? formatMessage(commonMessages.button.unreleased)
        : participants >= count
            ? formatMessage(commonMessages.button.soldOut)
            : Date.now() > endedAt.getTime()
                ? formatMessage(commonMessages.button.cutoff)
                : formatMessage(commonMessages.button.onSale);
    return (React.createElement(StyledWrapper, null,
        React.createElement(StyledTitle, { className: "d-flex align-items-start justify-content-between mb-3" },
            React.createElement("span", null, title),
            variant === 'admin' && React.createElement(StyledLabel, { active: status === '販售中' }, status)),
        React.createElement(StyledPrice, null,
            React.createElement(PriceLabel, { listPrice: price })),
        React.createElement(Divider, null),
        React.createElement(StyledSubTitle, null, formatMessage(productMessages.activity.title.sessions)),
        activitySessionTickets.map(function (sessionTicket) { return (React.createElement(StyledTag, { key: sessionTicket.id, color: "#585858", className: "mb-2" }, sessionTicket.activitySession.title)); }),
        !!description && (React.createElement(StyledDescription, null,
            React.createElement(StyledSubTitle, null, formatMessage(productMessages.activity.title.remark)),
            React.createElement(BraftContent, null, description))),
        React.createElement(StyledSubTitle, null, formatMessage(productMessages.activity.title.release)),
        React.createElement(StyledMeta, null, dateRangeFormatter({ startedAt: startedAt, endedAt: endedAt })),
        variant === 'admin' && (React.createElement(StyledExtraAdmin, { className: "d-flex align-items-center justify-content-between" },
            React.createElement("div", null,
                React.createElement(Icon, { src: UserOIcon, className: "mr-2" }),
                React.createElement("span", null, participants + " / " + count)),
            extra)),
        typeof variant === 'undefined' && extra && React.createElement("div", { className: "mt-3" }, extra)));
};
export default ActivityTicket;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=ActivityTicket.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon } from '@chakra-ui/react';
import { Skeleton } from 'antd';
import moment from 'moment';
import React from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { dateRangeFormatter } from '../../helpers';
import { commonMessages } from '../../helpers/translation';
import { useActivityTicket } from '../../hooks/activity';
import EmptyCover from '../../images/empty-cover.png';
import { BREAK_POINT } from '../common/Responsive';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1.5rem;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n\n  @media (min-width: ", "px) {\n    display: flex;\n    align-items: flex-start;\n    justify-content: space-between;\n  }\n"], ["\n  padding: 1.5rem;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n\n  @media (min-width: ", "px) {\n    display: flex;\n    align-items: flex-start;\n    justify-content: space-between;\n  }\n"])), BREAK_POINT);
var StyledDescription = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  overflow: hidden;\n  white-space: nowrap;\n\n  @media (min-width: ", "px) {\n    margin-right: 1rem;\n  }\n"], ["\n  overflow: hidden;\n  white-space: nowrap;\n\n  @media (min-width: ", "px) {\n    margin-right: 1rem;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: ", ";\n  font-size: 16px;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  white-space: normal;\n\n  > div:last-child {\n    margin-left: 1.5rem;\n  }\n\n  @media (min-width: ", "px) {\n    display: flex;\n    align-items: center;\n    justify-content: flex-start;\n\n    > div:last-child {\n      margin-left: 0;\n    }\n  }\n"], ["\n  margin-bottom: 0.75rem;\n  color: ", ";\n  font-size: 16px;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  white-space: normal;\n\n  > div:last-child {\n    margin-left: 1.5rem;\n  }\n\n  @media (min-width: ", "px) {\n    display: flex;\n    align-items: center;\n    justify-content: flex-start;\n\n    > div:last-child {\n      margin-left: 0;\n    }\n  }\n"])), function (props) { return (props.active ? 'var(--gray-darker)' : 'var(--gray)'); }, BREAK_POINT);
var StyledCover = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding-top: ", "%;\n  width: 100%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n\n  @media (min-width: ", "px) {\n    padding-top: 68px;\n    width: 120px;\n  }\n"], ["\n  padding-top: ", "%;\n  width: 100%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n\n  @media (min-width: ", "px) {\n    padding-top: 68px;\n    width: 120px;\n  }\n"])), (68 * 100) / 120, function (props) { return props.src; }, BREAK_POINT);
var StyledBadge = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n"], ["\n  color: ", ";\n  font-size: 14px;\n"])), function (props) { return props.theme['@primary-color']; });
var ActivityTicketItem = function (_a) {
    var ticketId = _a.ticketId;
    var _b = useActivityTicket(ticketId), loadingTicket = _b.loadingTicket, errorTicket = _b.errorTicket, ticket = _b.ticket;
    var formatMessage = useIntl().formatMessage;
    if (loadingTicket) {
        return (React.createElement(StyledWrapper, null,
            React.createElement(Skeleton, { active: true, avatar: true })));
    }
    if (errorTicket || !ticket) {
        return React.createElement(StyledWrapper, null, formatMessage(commonMessages.status.loadingError));
    }
    var activity = ticket.activity;
    var activitySessions = ticket.sessionTickets.map(function (sessionTicket) { return sessionTicket.session; });
    return (React.createElement(StyledWrapper, null,
        React.createElement(StyledDescription, { className: "flex-grow-1" },
            React.createElement(StyledTitle, { className: "mb-3" }, activity.title),
            activitySessions.map(function (session) {
                var now = moment();
                return (React.createElement(StyledMeta, { key: session.id, active: Date.now() < session.endedAt.getTime() },
                    React.createElement("div", null,
                        React.createElement(Icon, { as: AiOutlineCalendar }),
                        React.createElement(Icon, { as: AiOutlineCalendar }),
                        React.createElement("span", { className: "ml-2 mr-2" }, session.title)),
                    React.createElement("div", null,
                        React.createElement("span", { className: "mr-2" }, dateRangeFormatter({ startedAt: session.startedAt, endedAt: session.endedAt })),
                        now.isBefore(session.startedAt) && now.diff(session.startedAt, 'days', true) > -7 && (React.createElement(StyledBadge, null, formatMessage(commonMessages.status.coming))),
                        now.isBetween(session.startedAt, session.endedAt) && (React.createElement(StyledBadge, null, formatMessage(commonMessages.status.activityStart))))));
            })),
        React.createElement(StyledCover, { className: "flex-shrink-0", src: activity.coverUrl || EmptyCover })));
};
export default ActivityTicketItem;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ActivityTicketItem.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Icon, Skeleton } from 'antd';
import QRCode from 'qrcode.react';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ActivityBanner from '../components/activity/ActivityBanner';
import ActivitySessionItem from '../components/activity/ActivitySessionItem';
import { useAuth } from '../components/auth/AuthContext';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { handleError } from '../helpers';
import { commonMessages, productMessages } from '../helpers/translation';
import { useActivityAttendance, useActivityTicket, useAttendSession } from '../hooks/activity';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 2.5rem 15px 5rem;\n"], ["\n  padding: 2.5rem 15px 5rem;\n"])));
var StyledLink = styled(Link)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: block;\n  width: 100%;\n  max-width: 15rem;\n  margin: 0 auto;\n"], ["\n  display: block;\n  width: 100%;\n  max-width: 15rem;\n  margin: 0 auto;\n"])));
var StyledTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  line-height: 1.69;\n  letter-spacing: 0.2px;\n  text-align: justify;\n\n  > div {\n    margin-bottom: 0.5rem;\n  }\n"], ["\n  color: var(--gray-darker);\n  line-height: 1.69;\n  letter-spacing: 0.2px;\n  text-align: justify;\n\n  > div {\n    margin-bottom: 0.5rem;\n  }\n"])));
var messages = defineMessages({
    attended: { id: 'activity.ui.attended', defaultMessage: '已簽到' },
    attendNow: { id: 'activity.ui.attendNow', defaultMessage: '立即簽到' },
});
var ActivityTicketPage = function (_a) {
    var activityTicketId = _a.activityTicketId, memberId = _a.memberId, orderProductId = _a.orderProductId, invoice = _a.invoice;
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), currentMemberId = _b.currentMemberId, currentUserRole = _b.currentUserRole;
    var enabledModules = useApp().enabledModules;
    var _c = useActivityTicket(activityTicketId), loadingTicket = _c.loadingTicket, errorTicket = _c.errorTicket, ticket = _c.ticket;
    var _d = useActivityAttendance(memberId, activityTicketId), loadingAttendance = _d.loadingAttendance, attendance = _d.attendance, refetchAttendance = _d.refetchAttendance;
    var _e = useAttendSession(), attendActivitySession = _e.attendActivitySession, leaveActivitySession = _e.leaveActivitySession;
    var _f = useState(false), loading = _f[0], setLoading = _f[1];
    if (loadingTicket) {
        return (React.createElement(DefaultLayout, { noFooter: true, white: true },
            React.createElement(Skeleton, { active: true })));
    }
    if (errorTicket || !ticket) {
        return React.createElement(Redirect, { to: "/members/" + currentMemberId });
    }
    return (React.createElement(DefaultLayout, { noFooter: true, white: true },
        React.createElement(ActivityBanner, { activityCategories: ticket.activity.categories, activityTitle: ticket.activity.title, coverImage: ticket.activity.coverUrl || '' }, enabledModules.qrcode && currentUserRole === 'general-member' && (React.createElement(QRCode, { value: window.location.href, size: 256 }))),
        React.createElement(StyledContainer, { className: "container" },
            React.createElement("div", { className: "text-center mb-5" },
                React.createElement(StyledTitle, null, invoice.name),
                React.createElement("div", { className: "d-flex justify-content-center" },
                    React.createElement(StyledMeta, null,
                        typeof invoice.email === 'string' && (React.createElement("div", null,
                            formatMessage(productMessages.activity.content.email),
                            invoice.email)),
                        typeof invoice.phone === 'string' && (React.createElement("div", null,
                            formatMessage(productMessages.activity.content.phone),
                            invoice.phone)),
                        React.createElement("div", null,
                            formatMessage(productMessages.activity.content.orderNo),
                            orderProductId.split('-', 1)[0])))),
            React.createElement("div", { className: "row justify-content-center" },
                React.createElement("div", { className: "col-12 col-lg-8" },
                    React.createElement("div", { className: "mb-5" }, ticket.sessionTickets.map(function (sessionTicket) { return (React.createElement("div", { key: sessionTicket.session.id, className: "mb-4" },
                        React.createElement(ActivitySessionItem, { activitySessionId: sessionTicket.session.id, renderAttend: enabledModules.qrcode &&
                                currentUserRole === 'app-owner' &&
                                !loadingAttendance &&
                                (attendance[sessionTicket.session.id] ? (React.createElement(Button, { block: true, loading: loading, onClick: function () {
                                        setLoading(true);
                                        leaveActivitySession({
                                            variables: {
                                                orderProductId: orderProductId,
                                                activitySessionId: sessionTicket.session.id,
                                            },
                                        })
                                            .then(function () { return refetchAttendance(); })
                                            .catch(function (error) { return handleError(error); })
                                            .finally(function () { return setLoading(false); });
                                    } },
                                    React.createElement(Icon, { type: "check" }),
                                    " ",
                                    formatMessage(messages.attended))) : (React.createElement(Button, { type: "primary", block: true, loading: loading, onClick: function () {
                                        setLoading(true);
                                        attendActivitySession({
                                            variables: {
                                                orderProductId: orderProductId,
                                                activitySessionId: sessionTicket.session.id,
                                            },
                                        })
                                            .then(function () { return refetchAttendance(); })
                                            .catch(function (error) { return handleError(error); })
                                            .finally(function () { return setLoading(false); });
                                    } }, formatMessage(messages.attendNow)))) }))); })),
                    React.createElement(StyledLink, { to: "/activities/" + ticket.activity.id, target: "_blank" },
                        React.createElement(Button, { type: "link", block: true },
                            React.createElement("span", null, formatMessage(commonMessages.link.more)),
                            React.createElement(Icon, { type: "right" }))))))));
};
export default ActivityTicketPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=ActivityTicketPage.js.map
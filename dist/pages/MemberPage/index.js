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
import { Skeleton, Tabs, Typography } from 'antd';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Redirect, useParams } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';
import { useAuth } from '../../components/auth/AuthContext';
import MemberAvatar from '../../components/common/MemberAvatar';
import DefaultLayout from '../../components/layout/DefaultLayout';
import MerchandiseOrderCollectionBlock from '../../components/merchandise/MerchandiseOrderCollectionBlock';
import ProgramPackageCollectionBlock from '../../components/package/ProgramPackageCollectionBlock';
import EnrolledProgramCollectionBlock from '../../containers/program/EnrolledProgramCollectionBlock';
import ProjectPlanCollectionBlock from '../../containers/project/ProjectPlanCollectionBlock';
import { commonMessages } from '../../helpers/translation';
import { useEnrolledActivityTickets } from '../../hooks/activity';
import { useEnrolledAppointmentCollection } from '../../hooks/appointment';
import { usePublicMember } from '../../hooks/member';
import { useOrderLogsWithMerchandiseSpec } from '../../hooks/merchandise';
import { useEnrolledPodcastPrograms } from '../../hooks/podcast';
import { useEnrolledProgramPackagePlanIds } from '../../hooks/programPackage';
import { useEnrolledProjectPlanIds } from '../../hooks/project';
import ActivityTicketCollectionBlock from './ActivityTicketCollectionBlock';
import AppointmentPlanCollectionBlock from './AppointmentPlanCollectionBlock';
import PodcastProgramCollectionBlock from './PodcastProgramCollectionBlock';
var messages = defineMessages({
    merchandiseOrderLog: { id: 'product.merchandise.tab.orderLog', defaultMessage: '商品紀錄' },
});
var MemberPage = function () {
    var formatMessage = useIntl().formatMessage;
    var memberId = useParams().memberId;
    var _a = useAuth(), isAuthenticated = _a.isAuthenticated, currentMemberId = _a.currentMemberId, currentUserRole = _a.currentUserRole;
    var member = usePublicMember(memberId).member;
    var _b = useEnrolledProgramPackagePlanIds(memberId), loadingProgramPackageIds = _b.loadingProgramPackageIds, enrolledProgramPackagePlanIds = _b.enrolledProgramPackagePlanIds;
    var _c = useEnrolledProjectPlanIds(memberId), loadingEnrolledProjectPlanIds = _c.loadingEnrolledProjectPlanIds, enrolledProjectPlanIds = _c.enrolledProjectPlanIds;
    var _d = useEnrolledActivityTickets(memberId), loadingTickets = _d.loadingTickets, enrolledActivityTickets = _d.enrolledActivityTickets;
    var _e = useEnrolledPodcastPrograms(memberId), loadingPodcastProgramIds = _e.loadingPodcastProgramIds, enrolledPodcastPrograms = _e.enrolledPodcastPrograms;
    var _f = useEnrolledAppointmentCollection(memberId), loadingEnrolledAppointments = _f.loadingEnrolledAppointments, enrolledAppointments = _f.enrolledAppointments;
    var _g = useOrderLogsWithMerchandiseSpec(memberId), loadingOrderLogs = _g.loadingOrderLogs, orderLogs = _g.orderLogs;
    var _h = useQueryParam('tabkey', StringParam), activeKey = _h[0], setActiveKey = _h[1];
    if (memberId === 'currentMemberId' && isAuthenticated) {
        return React.createElement(Redirect, { to: "/members/" + currentMemberId });
    }
    return (React.createElement(DefaultLayout, null,
        React.createElement("div", { className: " py-4 py-sm-5", style: { background: 'white' } }, !member ? (React.createElement(Skeleton, { active: true })) : (React.createElement("div", { className: "container d-flex flex-column flex-sm-row align-items-center" },
            React.createElement(MemberAvatar, { memberId: memberId || '', withName: false, size: 128 }),
            React.createElement("div", { className: "d-flex flex-column align-items-center align-items-sm-start flex-sm-grow-1 ml-sm-4" },
                React.createElement(Typography.Title, { level: 4 }, member && member.name),
                React.createElement(Typography.Paragraph, { style: { whiteSpace: 'pre-wrap' } }, member && React.createElement("p", null, member.abstract)))))),
        !currentMemberId ||
            loadingProgramPackageIds ||
            loadingEnrolledProjectPlanIds ||
            loadingTickets ||
            loadingPodcastProgramIds ||
            loadingEnrolledAppointments ||
            loadingOrderLogs ? (React.createElement(Skeleton, { active: true })) : (React.createElement(Tabs, { activeKey: activeKey || 'program', onChange: function (key) { return setActiveKey(key); }, renderTabBar: function (tabsProps, DefaultTabBar) { return (React.createElement("div", { style: { background: 'white' } },
                React.createElement("div", { className: "container" },
                    React.createElement(DefaultTabBar, __assign({}, tabsProps))))); } },
            (currentMemberId === memberId || currentUserRole === 'app-owner') && (React.createElement(Tabs.TabPane, { key: "program", tab: formatMessage(commonMessages.tab.course) },
                React.createElement(EnrolledProgramCollectionBlock, { memberId: memberId }),
                enrolledProgramPackagePlanIds.length > 0 && React.createElement(ProgramPackageCollectionBlock, { memberId: memberId }))),
            (currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledProjectPlanIds.length > 0 && (React.createElement(Tabs.TabPane, { key: "project-plan", tab: formatMessage(commonMessages.tab.project) },
                React.createElement(ProjectPlanCollectionBlock, { memberId: memberId }))),
            (currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledActivityTickets.length > 0 && (React.createElement(Tabs.TabPane, { key: "activity-ticket", tab: formatMessage(commonMessages.tab.activity) },
                React.createElement(ActivityTicketCollectionBlock, { memberId: memberId }))),
            (currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledPodcastPrograms.length > 0 && (React.createElement(Tabs.TabPane, { key: "podcast", tab: formatMessage(commonMessages.tab.podcast) },
                React.createElement(PodcastProgramCollectionBlock, { memberId: memberId }))),
            (currentMemberId === memberId || currentUserRole === 'app-owner') && enrolledAppointments.length > 0 && (React.createElement(Tabs.TabPane, { key: "appointment", tab: formatMessage(commonMessages.tab.appointment) },
                React.createElement(AppointmentPlanCollectionBlock, { memberId: memberId }))),
            (currentMemberId === memberId || currentUserRole === 'app-owner') && orderLogs.length > 0 && (React.createElement(Tabs.TabPane, { key: "merchandise-order", tab: formatMessage(messages.merchandiseOrderLog) },
                React.createElement(MerchandiseOrderCollectionBlock, { memberId: memberId })))))));
};
export default MemberPage;
//# sourceMappingURL=index.js.map
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
import { Button, Skeleton, Tabs } from 'antd';
import BraftEditor from 'braft-editor';
import moment from 'moment';
import { render } from 'mustache';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import AppointmentCollectionTabs from '../components/appointment/AppointmentCollectionTabs';
import { useAuth } from '../components/auth/AuthContext';
import { AuthModalContext } from '../components/auth/AuthModal';
import PostItemCollection from '../components/blog/PostItemCollection';
import CreatorIntroBlock from '../components/common/CreatorIntroBlock';
import OverviewBlock from '../components/common/OverviewBlock';
import { BraftContent } from '../components/common/StyledBraftEditor';
import DefaultLayout from '../components/layout/DefaultLayout';
import PodcastProgramCard from '../components/podcast/PodcastProgramCard';
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover';
import ProgramCard from '../components/program/ProgramCard';
import CheckoutPodcastPlanModal from '../containers/checkout/CheckoutPodcastPlanModal';
import { useApp } from '../containers/common/AppContext';
import PodcastProgramTimeline from '../containers/podcast/PodcastProgramTimeline';
import { desktopViewMixin } from '../helpers';
import { commonMessages, usersMessages } from '../helpers/translation';
import { useAppointmentPlanCollection } from '../hooks/appointment';
import { usePostPreviewCollection } from '../hooks/blog';
import { useMember, usePublicMember } from '../hooks/member';
import { useEnrolledPodcastPlansCreators, usePodcastPlanIds, usePodcastProgramCollection } from '../hooks/podcast';
import { usePublishedProgramCollection } from '../hooks/program';
import NotFoundPage from './NotFoundPage';
var StyledDescription = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledCallToSubscription = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 1.5rem;\n  background-color: var(--gray-lighter);\n\n  .row > div:first-child {\n    margin-bottom: 1.25rem;\n  }\n\n  ", "\n"], ["\n  padding: 1.5rem;\n  background-color: var(--gray-lighter);\n\n  .row > div:first-child {\n    margin-bottom: 1.25rem;\n  }\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    .row > div:first-child {\n      margin-bottom: 0;\n    }\n    .row > div:last-child {\n      text-align: right;\n    }\n  "], ["\n    .row > div:first-child {\n      margin-bottom: 0;\n    }\n    .row > div:last-child {\n      text-align: right;\n    }\n  "])))));
var CreatorPage = function () {
    var creatorId = useParams().creatorId;
    var currentMemberId = useAuth().currentMemberId;
    var _a = useMember(currentMemberId || ''), loadingMember = _a.loadingMember, member = _a.member;
    var _b = usePublicMember(creatorId), creator = _b.member, loadingCreator = _b.loadingMember;
    if (loadingMember || loadingCreator) {
        return (React.createElement(DefaultLayout, { white: true },
            React.createElement(Skeleton, { active: true })));
    }
    if (!creator || !['content-creator', 'app-owner'].includes(creator.role)) {
        return React.createElement(NotFoundPage, null);
    }
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(CreatorIntroBlock, { avatarUrl: creator === null || creator === void 0 ? void 0 : creator.pictureUrl, title: (creator === null || creator === void 0 ? void 0 : creator.name) || (creator === null || creator === void 0 ? void 0 : creator.username) || '', subTitle: "", description: (creator === null || creator === void 0 ? void 0 : creator.abstract) || '', tags: (creator === null || creator === void 0 ? void 0 : creator.tags) || null }),
        React.createElement(CheckoutPodcastPlanModal, { renderTrigger: function (_a) {
                var setVisible = _a.setVisible;
                return (React.createElement(CreatorTabs, { creatorId: creatorId, member: creator, setCheckoutModalVisible: function () { return setVisible(); } }));
            }, paymentType: "subscription", creatorId: creatorId, member: member })));
};
var CreatorTabs = function (_a) {
    var _b;
    var creatorId = _a.creatorId, member = _a.member, setCheckoutModalVisible = _a.setCheckoutModalVisible;
    var formatMessage = useIntl().formatMessage;
    var setAuthModalVisible = useContext(AuthModalContext).setVisible;
    var _c = useApp(), enabledModules = _c.enabledModules, settings = _c.settings;
    var _d = useAuth(), currentMemberId = _d.currentMemberId, isAuthenticated = _d.isAuthenticated;
    var programs = usePublishedProgramCollection({ instructorId: creatorId, isPrivate: false }).programs;
    var posts = usePostPreviewCollection({ authorId: creatorId }).posts;
    var podcastPlanIds = usePodcastPlanIds(creatorId).podcastPlanIds;
    var enrolledPodcastPlansCreators = useEnrolledPodcastPlansCreators(currentMemberId || '').enrolledPodcastPlansCreators;
    var podcastPrograms = usePodcastProgramCollection(creatorId).podcastPrograms;
    var appointmentPlans = useAppointmentPlanCollection(creatorId, moment().endOf('minute').toDate()).appointmentPlans;
    var _e = useQueryParam('tabkey', StringParam), activeKey = _e[0], setActiveKey = _e[1];
    var isEnrolledPodcastPlan = enrolledPodcastPlansCreators
        .map(function (enrolledPodcastPlansCreator) { return enrolledPodcastPlansCreator.id; })
        .includes(creatorId);
    var seoMeta;
    try {
        seoMeta = (_b = JSON.parse(settings['seo.meta'])) === null || _b === void 0 ? void 0 : _b.CreatorPage;
    }
    catch (error) { }
    var siteTitle = seoMeta &&
        seoMeta.title &&
        render(seoMeta.title, {
            creatorName: (member === null || member === void 0 ? void 0 : member.name) || '',
            appointmentPlanTitles: enabledModules.appointment && appointmentPlans.length !== 0
                ? appointmentPlans
                    .map(function (appointmentPlan) { return appointmentPlan.title; })
                    .slice(0, 3)
                    .join('、')
                : '',
        });
    var siteDescription = (member === null || member === void 0 ? void 0 : member.abstract) || settings['open_graph.description'];
    var siteImage = (member === null || member === void 0 ? void 0 : member.pictureUrl) || settings['open_graph.image'];
    var ldData = JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: siteTitle,
        image: siteImage,
        description: siteDescription,
        url: window.location.href,
        brand: {
            '@type': 'Brand',
            name: settings['seo.name'],
            description: settings['open_graph.description'],
        },
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Helmet, null,
            React.createElement("title", null, siteTitle),
            React.createElement("meta", { name: "description", content: siteDescription }),
            React.createElement("meta", { property: "og:type", content: "website" }),
            React.createElement("meta", { property: "og:title", content: siteTitle }),
            React.createElement("meta", { property: "og:url", content: window.location.href }),
            React.createElement("meta", { property: "og:image", content: siteImage }),
            React.createElement("meta", { property: "og:description", content: siteDescription }),
            React.createElement("script", { type: "application/ld+json" }, ldData)),
        React.createElement(Tabs, { activeKey: activeKey || (enabledModules.appointment && appointmentPlans.length !== 0 ? 'appointments' : 'introduction'), onChange: function (key) { return setActiveKey(key); }, renderTabBar: function (tabsProps, DefaultTabBar) { return (React.createElement("div", { className: "container" },
                React.createElement(DefaultTabBar, __assign({}, tabsProps)))); } },
            !!member && (React.createElement(Tabs.TabPane, { tab: formatMessage(usersMessages.tab.intro), key: "introduction" },
                React.createElement("div", { className: "container py-4" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-lg-8 col-12 mb-4" }, member.description && !BraftEditor.createEditorState(member.description).isEmpty() ? (React.createElement(BraftContent, null, member.description)) : (React.createElement(StyledDescription, { className: "ml-3" }, formatMessage(commonMessages.content.noIntroduction)))),
                        React.createElement("div", { className: "col-lg-4 col-12" },
                            React.createElement(OverviewBlock, { programs: programs, podcastPrograms: podcastPrograms, onChangeTab: function (key) { return setActiveKey(key); }, onSubscribe: function () {
                                    return isAuthenticated
                                        ? setCheckoutModalVisible && setCheckoutModalVisible()
                                        : setAuthModalVisible && setAuthModalVisible(true);
                                } })))))),
            React.createElement(Tabs.TabPane, { tab: formatMessage(usersMessages.tab.addPrograms), key: "programs" },
                React.createElement("div", { className: "container py-4" },
                    React.createElement("div", { className: "row" }, programs.length === 0 ? (React.createElement(StyledDescription, { className: "ml-3" }, formatMessage(commonMessages.content.noProgram))) : (programs.map(function (program) { return (React.createElement("div", { key: program.id, className: "col-12 col-lg-4 mb-4" },
                        React.createElement(ProgramCard, { program: program }))); }))))),
            enabledModules.blog && (React.createElement(Tabs.TabPane, { tab: formatMessage(usersMessages.tab.mediaPost), key: "posts" },
                React.createElement("div", { className: "container py-4" }, posts.length === 0 ? (React.createElement(StyledDescription, { className: "ml-3" }, formatMessage(commonMessages.content.noPost))) : (React.createElement(PostItemCollection, { posts: posts }))))),
            enabledModules.podcast && (React.createElement(Tabs.TabPane, { tab: formatMessage(usersMessages.tab.podcasts), key: "podcasts" },
                React.createElement("div", { className: "container py-4" },
                    podcastPrograms.length === 0 && (React.createElement(StyledDescription, { className: "ml-3" }, formatMessage(commonMessages.content.noPodcast))),
                    podcastPlanIds.length > 0 && !isEnrolledPodcastPlan && (React.createElement(StyledCallToSubscription, { className: "mb-5" },
                        React.createElement("div", { className: "row align-items-center" },
                            React.createElement("div", { className: "col-12 col-lg-6" }, formatMessage(usersMessages.tab.podcasts)),
                            React.createElement("div", { className: "col-12 col-lg-6" },
                                React.createElement(Button, { icon: "plus", size: "large", onClick: function () {
                                        return isAuthenticated
                                            ? setCheckoutModalVisible && setCheckoutModalVisible()
                                            : setAuthModalVisible && setAuthModalVisible(true);
                                    } }, formatMessage(commonMessages.button.subscribe)))))),
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-12 col-lg-8 mb-3" },
                            React.createElement(PodcastProgramTimeline, { memberId: currentMemberId, podcastPrograms: podcastPrograms, renderItem: function (_a) {
                                    var podcastProgram = _a.podcastProgram, isEnrolled = _a.isEnrolled, isSubscribed = _a.isSubscribed;
                                    var elem = (React.createElement(PodcastProgramCard, { coverUrl: podcastProgram.coverUrl, title: podcastProgram.title, instructor: podcastProgram.instructor, salePrice: podcastProgram.salePrice, listPrice: podcastProgram.listPrice, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, isEnrolled: isEnrolled }));
                                    if (isEnrolledPodcastPlan) {
                                        return React.createElement(Link, { to: "/podcasts/" + podcastProgram.id }, elem);
                                    }
                                    return (React.createElement(PodcastProgramPopover, { key: podcastProgram.id, isEnrolled: isEnrolled, isSubscribed: isSubscribed, podcastProgramId: podcastProgram.id, title: podcastProgram.title, listPrice: podcastProgram.listPrice, salePrice: podcastProgram.salePrice, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, description: podcastProgram.description, categories: podcastProgram.categories, instructor: podcastProgram.instructor, onSubscribe: function () {
                                            return isAuthenticated
                                                ? setCheckoutModalVisible && setCheckoutModalVisible()
                                                : setAuthModalVisible && setAuthModalVisible(true);
                                        } }, elem));
                                } })))))),
            enabledModules.appointment && (React.createElement(Tabs.TabPane, { tab: formatMessage(usersMessages.tab.appointments), key: "appointments" },
                React.createElement("div", { className: "container py-4" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-lg-8 col-12 mb-3" }, appointmentPlans.length === 0 ? (React.createElement(StyledDescription, { className: "ml-3" }, formatMessage(commonMessages.content.noAppointment))) : (React.createElement(AppointmentCollectionTabs, { appointmentPlans: appointmentPlans }))),
                        React.createElement("div", { className: "col-lg-4 col-12" },
                            React.createElement(OverviewBlock, { programs: programs, podcastPrograms: podcastPrograms, onChangeTab: function (key) { return setActiveKey(key); }, onSubscribe: function () {
                                    isAuthenticated
                                        ? setCheckoutModalVisible && setCheckoutModalVisible()
                                        : setAuthModalVisible && setAuthModalVisible(true);
                                } })))))))));
};
export default CreatorPage;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=CreatorPage.js.map
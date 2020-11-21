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
import { useQuery } from '@apollo/react-hooks';
import { Skeleton, Tabs } from 'antd';
import gql from 'graphql-tag';
import { max, min } from 'lodash';
import { sum } from 'ramda';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import Activity from '../components/activity/Activity';
import CreatorBriefCard from '../components/appointment/CreatorBriefCard';
import { useAuth } from '../components/auth/AuthContext';
import { BREAK_POINT } from '../components/common/Responsive';
import { StyledBanner } from '../components/layout';
import DefaultLayout from '../components/layout/DefaultLayout';
import MerchandiseCard from '../components/merchandise/MerchandiseCard';
import PodcastProgramBriefCard from '../components/podcast/PodcastProgramBriefCard';
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover';
import ProgramCard from '../components/program/ProgramCard';
import ProjectIntroCard from '../components/project/ProjectIntroCard';
import CheckoutPodcastPlanModal from '../containers/checkout/CheckoutPodcastPlanModal';
import { useApp } from '../containers/common/AppContext';
import { notEmpty } from '../helpers';
import { useMember } from '../hooks/member';
import SearchIcon from '../images/search.svg';
var messages = defineMessages({
    noTagContent: { id: 'common.text.noTagContent', defaultMessage: '找不到關於這個標籤的內容' },
    noSearchResult: { id: 'common.text.noSearchResult', defaultMessage: '找不到相關內容' },
    program: { id: 'common.product.program', defaultMessage: '線上課程' },
    activity: { id: 'common.product.activity', defaultMessage: '線下實體' },
    podcast: { id: 'common.product.podcast', defaultMessage: '廣播' },
    creator: { id: 'common.product.creator', defaultMessage: '大師' },
    merchandise: { id: 'common.product.merchandise', defaultMessage: '商品' },
    project: { id: 'common.product.project', defaultMessage: '專案' },
});
var StyledTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  text-align: center;\n  font-weight: bold;\n  font-size: 20px;\n  letter-spacing: 0.8px;\n\n  @media (min-width: ", "px) {\n    text-align: left;\n    font-size: 24px;\n    letter-spacing: 0.2px;\n  }\n"], ["\n  color: var(--gray-darker);\n  text-align: center;\n  font-weight: bold;\n  font-size: 20px;\n  letter-spacing: 0.8px;\n\n  @media (min-width: ", "px) {\n    text-align: left;\n    font-size: 24px;\n    letter-spacing: 0.2px;\n  }\n"])), BREAK_POINT);
var StyledContent = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  height: calc(60vh);\n"], ["\n  height: calc(60vh);\n"])));
var StyledTabBarWrapper = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background-color: var(--gray-lighter);\n\n  .ant-tabs-nav-wrap {\n    justify-content: center;\n  }\n"], ["\n  background-color: var(--gray-lighter);\n\n  .ant-tabs-nav-wrap {\n    justify-content: center;\n  }\n"])));
var SearchPage = function () {
    var title = useQueryParam('q', StringParam)[0];
    var tag = useQueryParam('tag', StringParam)[0];
    var _a = useAuth(), isAuthenticating = _a.isAuthenticating, currentMemberId = _a.currentMemberId;
    var _b = useApp(), loading = _b.loading, enabledModules = _b.enabledModules;
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(StyledBanner, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledTitle, null,
                    title && (React.createElement(React.Fragment, null,
                        React.createElement(Icon, { src: SearchIcon, className: "mr-2" }),
                        React.createElement("span", null, title))),
                    tag && React.createElement("span", null,
                        "#",
                        tag)))),
        isAuthenticating || loading ? (React.createElement(Skeleton, { active: true })) : (React.createElement(SearchResultBlock, { memberId: currentMemberId, title: enabledModules.search ? title : undefined, tag: tag }))));
};
var SearchResultBlock = function (_a) {
    var memberId = _a.memberId, title = _a.title, tag = _a.tag;
    var formatMessage = useIntl().formatMessage;
    var _b = useQueryParam('tab', StringParam), tab = _b[0], setTab = _b[1];
    var _c = useMember(memberId || ''), loadingMember = _c.loadingMember, member = _c.member;
    var _d = useSearchProductCollection(memberId, {
        title: title,
        tag: tag,
    }), loadingSearchResults = _d.loadingSearchResults, errorSearchResults = _d.errorSearchResults, searchResults = _d.searchResults;
    useEffect(function () {
        var _a, _b;
        if (searchResults) {
            var index = 1;
            for (var _i = 0, _c = searchResults.programs; _i < _c.length; _i++) {
                var program = _c[_i];
                var listPrice = program.isSubscription && program.plans.length > 0 ? program.plans[0].listPrice : program.listPrice || 0;
                var salePrice = program.isSubscription && program.plans.length > 0 && (((_a = program.plans[0].soldAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) > Date.now()
                    ? program.plans[0].salePrice
                    : (((_b = program.soldAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0) > Date.now()
                        ? program.salePrice
                        : undefined;
                ReactGA.plugin.execute('ec', 'addImpression', {
                    id: program.id,
                    name: program.title,
                    category: 'Program',
                    price: "" + (salePrice || listPrice),
                    position: index,
                });
                index += 1;
                if (index % 20 === 0)
                    ReactGA.ga('send', 'pageview');
            }
            for (var _d = 0, _e = searchResults.activities; _d < _e.length; _d++) {
                var activity = _e[_d];
                if (activity.tickets) {
                    for (var _f = 0, _g = activity.tickets; _f < _g.length; _f++) {
                        var activityTicket = _g[_f];
                        ReactGA.plugin.execute('ec', 'addImpression', {
                            id: activityTicket.id,
                            name: activity.title + " - " + activityTicket.title,
                            category: 'ActivityTicket',
                            price: "" + activityTicket.price,
                            position: index,
                        });
                        index += 1;
                        if (index % 20 === 0)
                            ReactGA.ga('send', 'pageview');
                    }
                }
            }
            for (var _h = 0, _j = searchResults.podcastPrograms; _h < _j.length; _h++) {
                var podcastProgram = _j[_h];
                ReactGA.plugin.execute('ec', 'addImpression', {
                    id: podcastProgram.id,
                    name: podcastProgram.title,
                    category: 'PodcastProgram',
                    price: "" + podcastProgram.listPrice,
                    position: index,
                });
                index += 1;
                if (index % 20 === 0)
                    ReactGA.ga('send', 'pageview');
            }
            for (var _k = 0, _l = searchResults.merchandises; _k < _l.length; _k++) {
                var merchandise = _l[_k];
                for (var _m = 0, _o = merchandise.specs; _m < _o.length; _m++) {
                    var merchandiseSpec = _o[_m];
                    ReactGA.plugin.execute('ec', 'addImpression', {
                        id: merchandiseSpec.id,
                        name: merchandise.title + " - " + merchandiseSpec.title,
                        category: 'MerchandiseSpec',
                        price: "" + merchandiseSpec.listPrice,
                        position: index,
                    });
                    index += 1;
                    if (index % 20 === 0)
                        ReactGA.ga('send', 'pageview');
                }
            }
            for (var _p = 0, _q = searchResults.projects; _p < _q.length; _p++) {
                var project = _q[_p];
                if (project.projectPlans) {
                    for (var _r = 0, _s = project.projectPlans; _r < _s.length; _r++) {
                        var projectPlan = _s[_r];
                        ReactGA.plugin.execute('ec', 'addImpression', {
                            id: projectPlan.id,
                            name: project.title + " - " + projectPlan.title,
                            category: 'ProjectPlan',
                            price: "" + projectPlan.listPrice,
                            position: index,
                        });
                        index += 1;
                        if (index % 20 === 0)
                            ReactGA.ga('send', 'pageview');
                    }
                }
            }
            ReactGA.ga('send', 'pageview');
        }
    }, [searchResults]);
    if (loadingMember || loadingSearchResults) {
        return React.createElement(Skeleton, { active: true });
    }
    if (errorSearchResults || sum(Object.values(searchResults).map(function (value) { return value.length; })) === 0) {
        return (React.createElement(StyledContent, { className: "d-flex align-items-center justify-content-center" }, formatMessage(messages.noSearchResult)));
    }
    var defaultActiveKey = Object.keys(searchResults).find(function (key) { var _a; return ((_a = searchResults[key]) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    return (React.createElement(Tabs, { activeKey: tab || defaultActiveKey, onChange: function (key) { return setTab(key); }, renderTabBar: function (props, DefaultTabBar) { return (React.createElement(StyledTabBarWrapper, null,
            React.createElement("div", { className: "container" },
                React.createElement(DefaultTabBar, __assign({}, props, { className: "mb-0" }))))); } },
        searchResults.programs.length > 0 && (React.createElement(Tabs.TabPane, { key: "programs", tab: formatMessage(messages.program) + " (" + searchResults.programs.length + ")" },
            React.createElement("div", { className: "container py-5" },
                React.createElement("div", { className: "row" }, searchResults.programs.map(function (program) { return (React.createElement("div", { key: program.id, className: "col-12 col-md-6 col-lg-4 mb-4" },
                    React.createElement(ProgramCard, { program: program, withMeta: true }))); }))))),
        searchResults.activities.length > 0 && (React.createElement(Tabs.TabPane, { key: "activities", tab: formatMessage(messages.activity) + " (" + searchResults.activities.length + ")" },
            React.createElement("div", { className: "container py-5" },
                React.createElement("div", { className: "row" }, searchResults.activities.map(function (activity) { return (React.createElement("div", { key: activity.id, className: "col-12 col-md-6 col-lg-4 mb-4" },
                    React.createElement(Activity, __assign({}, activity)))); }))))),
        searchResults.podcastPrograms.length > 0 && (React.createElement(Tabs.TabPane, { key: "podcastPrograms", tab: formatMessage(messages.podcast) + " (" + searchResults.podcastPrograms.length + ")" },
            React.createElement("div", { className: "container py-5" },
                React.createElement("div", { className: "row" }, searchResults.podcastPrograms.map(function (podcastProgram) {
                    var _a;
                    return (React.createElement("div", { key: podcastProgram.id, className: "col-6 col-md-3 mb-4" },
                        React.createElement(CheckoutPodcastPlanModal, { renderTrigger: function (_a) {
                                var setVisible = _a.setVisible;
                                return (React.createElement(PodcastProgramPopover, { key: podcastProgram.id, podcastProgramId: podcastProgram.id, title: podcastProgram.title, listPrice: podcastProgram.listPrice, salePrice: podcastProgram.salePrice, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, description: podcastProgram.description, categories: podcastProgram.categories, instructor: podcastProgram.instructor, isEnrolled: podcastProgram.isEnrolled, isSubscribed: podcastProgram.isSubscribed, onSubscribe: function () { return setVisible(); } },
                                    React.createElement(PodcastProgramBriefCard, { coverUrl: podcastProgram.coverUrl, title: podcastProgram.title, listPrice: podcastProgram.listPrice, salePrice: podcastProgram.salePrice, soldAt: podcastProgram.soldAt })));
                            }, paymentType: "subscription", creatorId: ((_a = podcastProgram.instructor) === null || _a === void 0 ? void 0 : _a.id) || '', member: member })));
                }))))),
        searchResults.creators.length > 0 && (React.createElement(Tabs.TabPane, { key: "creators", tab: formatMessage(messages.creator) + " (" + searchResults.creators.length + ")" },
            React.createElement("div", { className: "container py-5" },
                React.createElement("div", { className: "row" }, searchResults.creators.map(function (creator) { return (React.createElement("div", { key: creator.id, className: "col-6 col-lg-3" },
                    React.createElement(Link, { to: "/creators/" + creator.id + "?tabkey=appointments" },
                        React.createElement(CreatorBriefCard, { imageUrl: creator.avatarUrl, title: creator.name, meta: creator.abstract })))); }))))),
        searchResults.merchandises.length > 0 && (React.createElement(Tabs.TabPane, { key: "merchandises", tab: formatMessage(messages.merchandise) + " (" + searchResults.merchandises.length + ")" },
            React.createElement("div", { className: "container py-5" },
                React.createElement("div", { className: "row" }, searchResults.merchandises.map(function (merchandise) { return (React.createElement("div", { key: merchandise.id, className: "col-12 col-lg-3 mb-4" },
                    React.createElement(Link, { to: "/merchandises/" + merchandise.id },
                        React.createElement(MerchandiseCard, __assign({}, merchandise))))); }))))),
        searchResults.projects.length > 0 && (React.createElement(Tabs.TabPane, { key: "projects", tab: formatMessage(messages.project) + " (" + searchResults.projects.length + ")" },
            React.createElement("div", { className: "container py-5" },
                React.createElement("div", { className: "row" }, searchResults.projects.map(function (project) { return (React.createElement("div", { key: project.id, className: "col-12 col-lg-4 mb-5" },
                    React.createElement(Link, { to: "/projects/" + project.id },
                        React.createElement(ProjectIntroCard, __assign({}, project))))); })))))));
};
var useSearchProductCollection = function (memberId, filter) {
    var _a = useQuery(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      query SEARCH_PRODUCT_COLLECTION($memberId: String, $title: String, $tag: String) {\n        program(\n          where: {\n            published_at: { _is_null: false }\n            is_private: { _eq: false }\n            is_deleted: { _eq: false }\n            _or: [{ title: { _ilike: $title } }, { program_tags: { tag_name: { _eq: $tag } } }]\n          }\n        ) {\n          id\n          cover_url\n          title\n          abstract\n          published_at\n          is_subscription\n          list_price\n          sale_price\n          sold_at\n          program_content_sections {\n            id\n            program_contents {\n              id\n              duration\n            }\n          }\n          program_plans(where: { published_at: { _is_null: false } }, limit: 1) {\n            id\n            type\n            title\n            description\n            gains\n            currency {\n              id\n              label\n              unit\n              name\n            }\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            period_amount\n            period_type\n            started_at\n            ended_at\n            is_participants_visible\n            published_at\n          }\n          program_roles(where: { name: { _eq: \"instructor\" } }, limit: 1) {\n            id\n            member {\n              id\n              picture_url\n              username\n              name\n            }\n          }\n          program_enrollments(where: { member_id: { _eq: $memberId } }) {\n            member_id\n          }\n        }\n        activity(where: { published_at: { _is_null: false }, _or: [{ title: { _ilike: $title } }] }) {\n          id\n          cover_url\n          title\n          published_at\n          is_participants_visible\n          organizer_id\n          support_locales\n          activity_categories {\n            id\n            category {\n              id\n              name\n            }\n          }\n          activity_enrollments_aggregate {\n            aggregate {\n              count\n            }\n          }\n          activity_sessions_aggregate {\n            aggregate {\n              min {\n                started_at\n              }\n              max {\n                ended_at\n              }\n            }\n          }\n          activity_tickets_aggregate {\n            nodes {\n              id\n              count\n              description\n              started_at\n              is_published\n              ended_at\n              price\n              title\n            }\n            aggregate {\n              sum {\n                count\n              }\n            }\n          }\n        }\n        podcast_program(\n          where: {\n            published_at: { _is_null: false }\n            _or: [{ title: { _ilike: $title } }, { podcast_program_tags: { tag_name: { _eq: $tag } } }]\n          }\n        ) {\n          id\n          cover_url\n          title\n          abstract\n          duration\n          duration_second\n          published_at\n          list_price\n          sale_price\n          sold_at\n          podcast_program_roles(where: { name: { _eq: \"instructor\" } }, limit: 1) {\n            id\n            member {\n              id\n              picture_url\n              username\n              name\n            }\n          }\n          podcast_program_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          podcast_program_enrollments(where: { member_id: { _eq: $memberId } }) {\n            member_id\n          }\n        }\n        podcast_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          podcast_plan_id\n          podcast_plan {\n            id\n            creator_id\n          }\n        }\n        member_public(\n          where: {\n            role: { _eq: \"content-creator\" }\n            _or: [{ name: { _ilike: $title } }, { username: { _ilike: $title } }, { tag_names: { _has_key: $tag } }]\n          }\n        ) {\n          id\n          picture_url\n          name\n          username\n          abstract\n        }\n        merchandise(\n          where: {\n            published_at: { _is_null: false }\n            is_deleted: { _eq: false }\n            _or: [{ title: { _ilike: $title } }, { merchandise_tags: { tag_name: { _eq: $tag } } }]\n          }\n        ) {\n          id\n          title\n          sold_at\n          merchandise_tags(order_by: { position: asc }) {\n            tag_name\n          }\n          merchandise_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          merchandise_imgs(where: { type: { _eq: \"cover\" } }, limit: 1) {\n            id\n            url\n          }\n          merchandise_specs {\n            id\n            title\n            list_price\n            sale_price\n          }\n        }\n        project(\n          where: {\n            type: { _in: [\"on-sale\", \"pre-order\", \"funding\"] }\n            published_at: { _is_null: false }\n            _or: [{ title: { _ilike: $title } }]\n          }\n        ) {\n          id\n          type\n          title\n          cover_type\n          cover_url\n          preview_url\n          abstract\n          description\n          target_unit\n          target_amount\n          expired_at\n          is_participants_visible\n          is_countdown_timer_visible\n\n          project_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          project_sales {\n            total_sales\n          }\n          project_plans {\n            id\n            cover_url\n            title\n            description\n            is_subscription\n            period_amount\n            period_type\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            created_at\n            is_participants_visible\n            is_physical\n            is_limited\n            project_plan_enrollments_aggregate {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query SEARCH_PRODUCT_COLLECTION($memberId: String, $title: String, $tag: String) {\n        program(\n          where: {\n            published_at: { _is_null: false }\n            is_private: { _eq: false }\n            is_deleted: { _eq: false }\n            _or: [{ title: { _ilike: $title } }, { program_tags: { tag_name: { _eq: $tag } } }]\n          }\n        ) {\n          id\n          cover_url\n          title\n          abstract\n          published_at\n          is_subscription\n          list_price\n          sale_price\n          sold_at\n          program_content_sections {\n            id\n            program_contents {\n              id\n              duration\n            }\n          }\n          program_plans(where: { published_at: { _is_null: false } }, limit: 1) {\n            id\n            type\n            title\n            description\n            gains\n            currency {\n              id\n              label\n              unit\n              name\n            }\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            period_amount\n            period_type\n            started_at\n            ended_at\n            is_participants_visible\n            published_at\n          }\n          program_roles(where: { name: { _eq: \"instructor\" } }, limit: 1) {\n            id\n            member {\n              id\n              picture_url\n              username\n              name\n            }\n          }\n          program_enrollments(where: { member_id: { _eq: $memberId } }) {\n            member_id\n          }\n        }\n        activity(where: { published_at: { _is_null: false }, _or: [{ title: { _ilike: $title } }] }) {\n          id\n          cover_url\n          title\n          published_at\n          is_participants_visible\n          organizer_id\n          support_locales\n          activity_categories {\n            id\n            category {\n              id\n              name\n            }\n          }\n          activity_enrollments_aggregate {\n            aggregate {\n              count\n            }\n          }\n          activity_sessions_aggregate {\n            aggregate {\n              min {\n                started_at\n              }\n              max {\n                ended_at\n              }\n            }\n          }\n          activity_tickets_aggregate {\n            nodes {\n              id\n              count\n              description\n              started_at\n              is_published\n              ended_at\n              price\n              title\n            }\n            aggregate {\n              sum {\n                count\n              }\n            }\n          }\n        }\n        podcast_program(\n          where: {\n            published_at: { _is_null: false }\n            _or: [{ title: { _ilike: $title } }, { podcast_program_tags: { tag_name: { _eq: $tag } } }]\n          }\n        ) {\n          id\n          cover_url\n          title\n          abstract\n          duration\n          duration_second\n          published_at\n          list_price\n          sale_price\n          sold_at\n          podcast_program_roles(where: { name: { _eq: \"instructor\" } }, limit: 1) {\n            id\n            member {\n              id\n              picture_url\n              username\n              name\n            }\n          }\n          podcast_program_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          podcast_program_enrollments(where: { member_id: { _eq: $memberId } }) {\n            member_id\n          }\n        }\n        podcast_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          podcast_plan_id\n          podcast_plan {\n            id\n            creator_id\n          }\n        }\n        member_public(\n          where: {\n            role: { _eq: \"content-creator\" }\n            _or: [{ name: { _ilike: $title } }, { username: { _ilike: $title } }, { tag_names: { _has_key: $tag } }]\n          }\n        ) {\n          id\n          picture_url\n          name\n          username\n          abstract\n        }\n        merchandise(\n          where: {\n            published_at: { _is_null: false }\n            is_deleted: { _eq: false }\n            _or: [{ title: { _ilike: $title } }, { merchandise_tags: { tag_name: { _eq: $tag } } }]\n          }\n        ) {\n          id\n          title\n          sold_at\n          merchandise_tags(order_by: { position: asc }) {\n            tag_name\n          }\n          merchandise_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          merchandise_imgs(where: { type: { _eq: \"cover\" } }, limit: 1) {\n            id\n            url\n          }\n          merchandise_specs {\n            id\n            title\n            list_price\n            sale_price\n          }\n        }\n        project(\n          where: {\n            type: { _in: [\"on-sale\", \"pre-order\", \"funding\"] }\n            published_at: { _is_null: false }\n            _or: [{ title: { _ilike: $title } }]\n          }\n        ) {\n          id\n          type\n          title\n          cover_type\n          cover_url\n          preview_url\n          abstract\n          description\n          target_unit\n          target_amount\n          expired_at\n          is_participants_visible\n          is_countdown_timer_visible\n\n          project_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          project_sales {\n            total_sales\n          }\n          project_plans {\n            id\n            cover_url\n            title\n            description\n            is_subscription\n            period_amount\n            period_type\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            created_at\n            is_participants_visible\n            is_physical\n            is_limited\n            project_plan_enrollments_aggregate {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n      }\n    "]))), {
        variables: {
            memberId: memberId || '',
            title: (filter === null || filter === void 0 ? void 0 : filter.title) && filter.title.length > 1 ? "%" + filter.title.replace(/_/g, '\\_') + "%" : '',
            tag: (filter === null || filter === void 0 ? void 0 : filter.tag) || '',
        },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var searchResults = {
        programs: (data === null || data === void 0 ? void 0 : data.program.map(function (program) { return ({
            id: program.id,
            coverUrl: program.cover_url,
            title: program.title,
            abstract: program.abstract,
            publishedAt: new Date(program.published_at),
            isSubscription: program.is_subscription,
            listPrice: program.list_price,
            salePrice: program.sale_price,
            soldAt: program.sold_at && new Date(program.sold_at),
            isPrivate: false,
            totalDuration: sum(program.program_content_sections.map(function (section) {
                return sum(section.program_contents.map(function (content) { return content.duration; }));
            })),
            roles: program.program_roles.map(function (programRole) {
                var _a;
                return ({
                    id: programRole.id,
                    name: 'instructor',
                    memberId: ((_a = programRole.member) === null || _a === void 0 ? void 0 : _a.id) || '',
                });
            }),
            plans: program.program_plans.map(function (programPlan) { return ({
                id: programPlan.id,
                type: programPlan.type === 1 ? 'subscribeFromNow' : programPlan.type === 2 ? 'subscribeAll' : 'unknown',
                title: programPlan.title,
                description: programPlan.description,
                gains: programPlan.gains,
                currency: {
                    id: programPlan.currency.id,
                    label: programPlan.currency.label,
                    unit: programPlan.currency.unit,
                    name: programPlan.currency.name,
                },
                listPrice: programPlan.list_price,
                salePrice: programPlan.sale_price,
                soldAt: programPlan.sold_at && new Date(programPlan.sold_at),
                discountDownPrice: programPlan.discount_down_price,
                periodAmount: programPlan.period_amount,
                periodType: programPlan.period_type,
                startedAt: programPlan.started_at && new Date(programPlan.started_at),
                endedAt: programPlan.ended_at && new Date(programPlan.ended_at),
                isParticipantsVisible: programPlan.is_participants_visible,
                publishedAt: new Date(programPlan.published_at),
            }); }),
            isEnrolled: program.program_enrollments.length > 0,
        }); })) || [],
        activities: (data === null || data === void 0 ? void 0 : data.activity.filter(function (activity) {
            var _a, _b, _c;
            return ((_b = (_a = activity.activity_sessions_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.max) === null || _b === void 0 ? void 0 : _b.ended_at) &&
                new Date((_c = activity.activity_sessions_aggregate.aggregate.max) === null || _c === void 0 ? void 0 : _c.ended_at).getTime() < Date.now();
        }).map(function (activity) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return ({
                id: activity.id,
                coverUrl: activity.cover_url,
                title: activity.title,
                isParticipantsVisible: activity.is_participants_visible,
                publishedAt: new Date(activity.published_at),
                startedAt: ((_b = (_a = activity.activity_sessions_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.min) === null || _b === void 0 ? void 0 : _b.started_at) ? new Date(activity.activity_sessions_aggregate.aggregate.min.started_at)
                    : null,
                endedAt: ((_d = (_c = activity.activity_sessions_aggregate.aggregate) === null || _c === void 0 ? void 0 : _c.max) === null || _d === void 0 ? void 0 : _d.ended_at) ? new Date(activity.activity_sessions_aggregate.aggregate.max.ended_at)
                    : null,
                organizerId: activity.organizer_id,
                supportLocales: activity.support_locales,
                categories: activity.activity_categories.map(function (activityCategory) { return ({
                    id: activityCategory.category.id,
                    name: activityCategory.category.name,
                }); }),
                participantCount: ((_e = activity.activity_enrollments_aggregate.aggregate) === null || _e === void 0 ? void 0 : _e.count) || 0,
                totalSeats: ((_g = (_f = activity.activity_tickets_aggregate.aggregate) === null || _f === void 0 ? void 0 : _f.sum) === null || _g === void 0 ? void 0 : _g.count) || 0,
                tickets: (_j = (_h = activity.activity_tickets_aggregate) === null || _h === void 0 ? void 0 : _h.nodes) === null || _j === void 0 ? void 0 : _j.map(function (ticket) { return ({
                    id: ticket.id,
                    title: ticket.title,
                    startedAt: new Date(ticket.started_at),
                    endedAt: new Date(ticket.ended_at),
                    price: ticket.price,
                    count: ticket.count,
                    description: ticket.description,
                    isPublished: ticket.is_published,
                }); }),
            });
        })) || [],
        podcastPrograms: (data === null || data === void 0 ? void 0 : data.podcast_program.map(function (podcastProgram) {
            var _a, _b, _c, _d, _e;
            return ({
                id: podcastProgram.id,
                coverUrl: podcastProgram.cover_url,
                title: podcastProgram.title,
                listPrice: podcastProgram.list_price,
                salePrice: podcastProgram.sale_price,
                soldAt: podcastProgram.sold_at && new Date(podcastProgram.sold_at),
                duration: podcastProgram.duration,
                durationSecond: podcastProgram.duration_second,
                description: podcastProgram.abstract,
                categories: podcastProgram.podcast_program_categories.map(function (podcastProgramCategory) { return ({
                    id: podcastProgramCategory.category.id,
                    name: podcastProgramCategory.category.name,
                }); }),
                instructor: podcastProgram.podcast_program_roles[0]
                    ? {
                        id: ((_a = podcastProgram.podcast_program_roles[0].member) === null || _a === void 0 ? void 0 : _a.id) || '',
                        avatarUrl: ((_b = podcastProgram.podcast_program_roles[0].member) === null || _b === void 0 ? void 0 : _b.picture_url) || null,
                        name: ((_c = podcastProgram.podcast_program_roles[0].member) === null || _c === void 0 ? void 0 : _c.name) || ((_d = podcastProgram.podcast_program_roles[0].member) === null || _d === void 0 ? void 0 : _d.username) ||
                            '',
                    }
                    : null,
                isEnrolled: podcastProgram.podcast_program_enrollments.length > 0,
                isSubscribed: data.podcast_plan_enrollment
                    .map(function (podcastPlanEnrollment) { var _a; return (_a = podcastPlanEnrollment.podcast_plan) === null || _a === void 0 ? void 0 : _a.creator_id; })
                    .filter(notEmpty)
                    .includes(((_e = podcastProgram.podcast_program_roles[0].member) === null || _e === void 0 ? void 0 : _e.id) || ''),
            });
        })) || [],
        creators: (data === null || data === void 0 ? void 0 : data.member_public.map(function (member) { return ({
            id: member.id || '',
            avatarUrl: member.picture_url,
            name: member.name || member.username || '',
            abstract: member.abstract,
        }); })) || [],
        merchandises: (data === null || data === void 0 ? void 0 : data.merchandise.map(function (merchandise) { return ({
            id: merchandise.id,
            title: merchandise.title,
            soldAt: merchandise.sold_at ? new Date(merchandise.sold_at) : null,
            minPrice: min(merchandise.merchandise_specs.map(function (spec) {
                return merchandise.sold_at && typeof spec.sale_price === 'number' ? spec.sale_price : spec.list_price || 0;
            })),
            maxPrice: max(merchandise.merchandise_specs.map(function (spec) {
                return merchandise.sold_at && typeof spec.sale_price === 'number' ? spec.sale_price : spec.list_price || 0;
            })),
            tags: merchandise.merchandise_tags.map(function (v) { return v.tag_name; }),
            categories: merchandise.merchandise_categories.map(function (v) { return ({
                id: v.category.id,
                name: v.category.name,
            }); }),
            images: merchandise.merchandise_imgs.map(function (v) { return ({
                id: v.id,
                url: v.url,
                isCover: true,
            }); }),
            specs: merchandise.merchandise_specs.map(function (spec) { return ({
                id: spec.id,
                title: spec.title,
                listPrice: spec.list_price,
                salePrice: spec.sale_price,
            }); }),
        }); })) || [],
        projects: (data === null || data === void 0 ? void 0 : data.project.map(function (project) {
            var _a;
            return ({
                id: project.id,
                type: project.type,
                title: project.title,
                coverType: project.cover_type,
                coverUrl: project.cover_url,
                previewUrl: project.preview_url,
                abstract: project.abstract,
                description: project.description,
                targetAmount: project.target_amount,
                targetUnit: project.target_unit,
                expiredAt: project.expired_at ? new Date(project.expired_at) : null,
                isParticipantsVisible: project.is_participants_visible,
                isCountdownTimerVisible: project.is_countdown_timer_visible,
                totalSales: (_a = project.project_sales) === null || _a === void 0 ? void 0 : _a.total_sales,
                categories: project.project_categories.map(function (projectCategory) { return ({
                    id: projectCategory.category.id,
                    name: projectCategory.category.name,
                }); }),
                enrollmentCount: sum(project.project_plans.map(function (projectPlan) { var _a; return ((_a = projectPlan.project_plan_enrollments_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 0; })),
                projectPlans: project.project_plans.map(function (project_plan) { return ({
                    id: project_plan.id,
                    coverUrl: project_plan.cover_url,
                    title: project_plan.title,
                    description: project_plan.description,
                    isSubscription: project_plan.is_subscription,
                    periodAmount: project_plan.period_amount,
                    periodType: project_plan.period_type,
                    listPrice: project_plan.list_price,
                    salePrice: project_plan.sale_price,
                    soldAt: project_plan.sold_at ? new Date(project_plan.sold_at) : null,
                    discountDownPrice: project_plan.discount_down_price,
                    createdAt: new Date(project_plan.created_at),
                    createAt: new Date(project_plan.created_at),
                }); }),
            });
        })) || [],
    };
    return {
        loadingSearchResults: loading,
        errorSearchResults: error,
        searchResults: searchResults,
        refetchSearchResults: refetch,
    };
};
export default SearchPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=SearchPage.js.map
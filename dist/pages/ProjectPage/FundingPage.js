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
import { Affix, Button, Tabs } from 'antd';
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { BREAK_POINT } from '../../components/common/Responsive';
import DefaultLayout from '../../components/layout/DefaultLayout';
import FundingCommentsPane from '../../components/project/FundingCommentsPane';
import FundingContentsPane from '../../components/project/FundingContentsPane';
import FundingCoverBlock from '../../components/project/FundingCoverBlock';
import FundingIntroductionPane from '../../components/project/FundingIntroductionPane';
import FundingPlansPane from '../../components/project/FundingPlansPane';
import FundingSummaryBlock from '../../components/project/FundingSummaryBlock';
import FundingUpdatesPane from '../../components/project/FundingUpdatesPane';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages, productMessages } from '../../helpers/translation';
var StyledCover = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-top: 2.5rem;\n"], ["\n  padding-top: 2.5rem;\n"])));
var StyledTabs = styled(Tabs)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  .ant-tabs-bar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    flex-wrap: wrap;\n    margin: 0;\n    border: 0;\n\n    .ant-tabs-extra-content {\n      float: none !important;\n      order: 1;\n      padding-left: 18px;\n      width: 33.333333%;\n    }\n\n    .ant-tabs-tab.ant-tabs-tab {\n      padding: 1.5rem 1rem;\n    }\n  }\n  .ant-tabs-content {\n    padding-top: 2.5rem;\n  }\n"], ["\n  .ant-tabs-bar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    flex-wrap: wrap;\n    margin: 0;\n    border: 0;\n\n    .ant-tabs-extra-content {\n      float: none !important;\n      order: 1;\n      padding-left: 18px;\n      width: 33.333333%;\n    }\n\n    .ant-tabs-tab.ant-tabs-tab {\n      padding: 1.5rem 1rem;\n    }\n  }\n  .ant-tabs-content {\n    padding-top: 2.5rem;\n  }\n"])));
var StyledSupportButtonWrapper = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  @media (max-width: ", "px) {\n    z-index: 1000;\n    position: fixed;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    padding: 0.25rem 0.75rem;\n    background: white;\n  }\n"], ["\n  @media (max-width: ", "px) {\n    z-index: 1000;\n    position: fixed;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    padding: 0.25rem 0.75rem;\n    background: white;\n  }\n"])), BREAK_POINT - 1);
var StyledTabBarWrapper = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  border-bottom: 1px solid #e8e8e8;\n  background: white;\n"], ["\n  border-bottom: 1px solid #e8e8e8;\n  background: white;\n"])));
var StyledBadge = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n\n  ::after {\n    display: block;\n    position: absolute;\n    top: -12px;\n    right: -16px;\n    color: ", ";\n    content: '", "';\n    font-size: 14px;\n    font-weight: normal;\n  }\n"], ["\n  position: relative;\n\n  ::after {\n    display: block;\n    position: absolute;\n    top: -12px;\n    right: -16px;\n    color: ", ";\n    content: '", "';\n    font-size: 14px;\n    font-weight: normal;\n  }\n"])), function (props) { return props.theme['@primary-color']; }, function (props) { return props.count; });
var FundingPage = function (_a) {
    var id = _a.id, type = _a.type, expiredAt = _a.expiredAt, coverType = _a.coverType, coverUrl = _a.coverUrl, title = _a.title, description = _a.description, targetAmount = _a.targetAmount, targetUnit = _a.targetUnit, introduction = _a.introduction, projectSections = _a.projectSections, projectPlans = _a.projectPlans, isParticipantsVisible = _a.isParticipantsVisible, isCountdownTimerVisible = _a.isCountdownTimerVisible, totalSales = _a.totalSales, enrollmentCount = _a.enrollmentCount;
    var formatMessage = useIntl().formatMessage;
    var _b = useQueryParam('tabkey', StringParam), activeKey = _b[0], setActiveKey = _b[1];
    var settings = useApp().settings;
    var tabRef = useRef(null);
    var handleTabsChange = function (activeKey) {
        tabRef.current && tabRef.current.scrollIntoView();
        setActiveKey(activeKey);
    };
    var seoMeta;
    try {
        seoMeta = JSON.parse(settings['seo.meta']).ProjectPage["" + id];
    }
    catch (error) { }
    var siteTitle = (seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title) || title;
    var siteDescription = (seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.description) || description;
    var ldData = JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: siteTitle,
        image: coverUrl,
        description: siteDescription,
        url: window.location.href,
        brand: {
            '@type': 'Brand',
            name: siteTitle,
            description: siteDescription,
        },
    });
    return (React.createElement(DefaultLayout, { white: true, noFooter: true },
        React.createElement(Helmet, null,
            React.createElement("title", null, siteTitle),
            React.createElement("meta", { name: "description", content: siteDescription }),
            React.createElement("meta", { property: "og:type", content: "website" }),
            React.createElement("meta", { property: "og:title", content: siteTitle }),
            React.createElement("meta", { property: "og:url", content: window.location.href }),
            React.createElement("meta", { property: "og:image", content: coverUrl }),
            React.createElement("meta", { property: "og:description", content: siteDescription }),
            React.createElement("script", { type: "application/ld+json" }, ldData)),
        React.createElement(StyledCover, { className: "container mb-4" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-12 col-lg-8" },
                    React.createElement(FundingCoverBlock, { coverType: coverType, coverUrl: coverUrl })),
                React.createElement("div", { className: "col-12 col-lg-4" },
                    React.createElement(FundingSummaryBlock, { projectId: id, title: title, description: description, targetAmount: targetAmount, targetUnit: targetUnit, expiredAt: expiredAt, type: type, isParticipantsVisible: isParticipantsVisible, isCountdownTimerVisible: isCountdownTimerVisible, totalSales: totalSales, enrollmentCount: enrollmentCount })))),
        React.createElement("div", { ref: tabRef },
            React.createElement(StyledTabs, { activeKey: activeKey || 'introduction', onChange: handleTabsChange, size: "large", tabBarExtraContent: React.createElement(StyledSupportButtonWrapper, null, expiredAt && expiredAt.getTime() < Date.now() ? (React.createElement(Button, { size: "large", block: true, disabled: true }, formatMessage(commonMessages.button.cutoff))) : (React.createElement(Button, { type: "primary", size: "large", block: true, onClick: function () { return handleTabsChange('plans'); } }, formatMessage(commonMessages.button.pledge)))), renderTabBar: function (props, DefaultTabBar) {
                    var TabBar = DefaultTabBar;
                    return (React.createElement(Affix, { target: function () { return document.getElementById('layout-content'); } },
                        React.createElement(StyledTabBarWrapper, null,
                            React.createElement("div", { className: "container" },
                                React.createElement(TabBar, __assign({}, props))))));
                } },
                React.createElement(Tabs.TabPane, { tab: formatMessage(productMessages.project.tab.intro), key: "introduction" }, projectPlans && React.createElement(FundingIntroductionPane, { introduction: introduction, projectPlans: projectPlans })),
                projectSections &&
                    projectSections.map(function (projectSection) {
                        return projectSection.type === 'funding_contents' ? (React.createElement(Tabs.TabPane, { tab: projectSection.options.title, key: "contents" },
                            React.createElement(FundingContentsPane, { contents: projectSection.options.items, projectPlans: projectPlans || [] }))) : projectSection.type === 'funding_updates' ? (React.createElement(Tabs.TabPane, { tab: React.createElement(StyledBadge, { count: projectSection.options.items.length }, projectSection.options.title), key: "updates" },
                            React.createElement(FundingUpdatesPane, { updates: projectSection.options.items, projectPlans: projectPlans || [] }))) : projectSection.type === 'funding_comments' ? (React.createElement(Tabs.TabPane, { tab: projectSection.options.title, key: "comments" },
                            React.createElement(FundingCommentsPane, { comments: projectSection.options.items, projectPlans: projectPlans || [] }))) : null;
                    }),
                React.createElement(Tabs.TabPane, { tab: formatMessage(productMessages.project.tab.project), key: "plans" },
                    React.createElement(FundingPlansPane, { projectPlans: projectPlans || [] }))))));
};
export default FundingPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=FundingPage.js.map
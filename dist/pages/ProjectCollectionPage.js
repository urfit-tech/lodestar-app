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
import { Button, Icon as AntdIcon } from 'antd';
import { flatten, uniqBy } from 'ramda';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params';
import { StyledBannerTitle } from '../components/layout';
import DefaultLayout from '../components/layout/DefaultLayout';
import ProjectIntroCard from '../components/project/ProjectIntroCard';
import { notEmpty } from '../helpers';
import { commonMessages } from '../helpers/translation';
import { useNav } from '../hooks/data';
import { useProjectIntroCollection } from '../hooks/project';
import FundraisingIcon from '../images/fundraising.svg';
import PreOrderIcon from '../images/pre-order.svg';
import PromotionIcon from '../images/promotion.svg';
var messages = defineMessages({
    exploreProjects: { id: 'project.label.exploreProjects', defaultMessage: '探索專案' },
    onSaleProject: { id: 'project.label.onSaleProject', defaultMessage: '促銷專案' },
    preOrderProject: { id: 'project.label.preOrderProject', defaultMessage: '預購專案' },
    fundingProject: { id: 'project.label.fundingProject', defaultMessage: '募資專案' },
    onSale: { id: 'project.text.onSale', defaultMessage: '促銷' },
    preOrder: { id: 'project.text.preOrder', defaultMessage: '預購' },
    funding: { id: 'project.text.funding', defaultMessage: '募資' },
    people: {
        id: 'common.unit.people',
        defaultMessage: '{projectType} {count, plural, one {人} other {人}}',
    },
    onSaleCountDownDays: {
        id: 'project.label.onSaleCountDownDays',
        defaultMessage: '{projectType}倒數 {days} {days, plural, one {天} other {天}}',
    },
    isExpired: { id: 'project.label.isExpired', defaultMessage: '已結束' },
    isExpiredFunding: { id: 'project.label.isExpiredFunding', defaultMessage: '募資結束' },
});
var StyledCoverSection = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 3.5rem 0;\n  background-color: var(--gray-lighter);\n"], ["\n  padding: 3.5rem 0;\n  background-color: var(--gray-lighter);\n"])));
var StyledContentSection = styled.section(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 5rem 0;\n"], ["\n  padding: 5rem 0;\n"])));
var StyledTitle = styled.h2(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 28px;\n  font-weight: bold;\n\n  i {\n    color: ", ";\n  }\n"], ["\n  color: var(--gray-darker);\n  font-size: 28px;\n  font-weight: bold;\n\n  i {\n    color: ", ";\n  }\n"])), function (props) { return props.theme['@primary-color']; });
var ProjectCollectionPage = function () {
    var formatMessage = useIntl().formatMessage;
    var defaultActive = useQueryParam('active', StringParam)[0];
    var noSelector = useQueryParam('noSelector', BooleanParam)[0];
    var title = useQueryParam('title', StringParam)[0];
    var noSubtitle = useQueryParam('noSubtitle', BooleanParam)[0];
    var projects = useProjectIntroCollection({ categoryId: defaultActive || undefined }).projects;
    var pageTitle = useNav().pageTitle;
    var _a = useState(defaultActive || null), selectedCategoryId = _a[0], setSelectedCategoryId = _a[1];
    var categories = uniqBy(function (category) { return category.id; }, flatten(projects.map(function (project) { return project.categories; }).filter(notEmpty)));
    useEffect(function () {
        if (projects) {
            var index = 1;
            for (var _i = 0, projects_1 = projects; _i < projects_1.length; _i++) {
                var project = projects_1[_i];
                if (project.projectPlans) {
                    for (var _a = 0, _b = project.projectPlans; _a < _b.length; _a++) {
                        var projectPlan = _b[_a];
                        ReactGA.plugin.execute('ec', 'addImpression', {
                            id: projectPlan.id,
                            name: project.title + " - " + projectPlan.title,
                            category: 'ProjectPlan',
                            price: "" + projectPlan.listPrice,
                            position: index,
                        });
                        index += 1;
                    }
                }
            }
            ReactGA.ga('send', 'pageview');
        }
    }, [projects]);
    var projectSections = [
        {
            id: 'funding',
            icon: React.createElement(Icon, { src: FundraisingIcon }),
            title: formatMessage(messages.fundingProject),
        },
        {
            id: 'pre-order',
            icon: React.createElement(Icon, { src: PreOrderIcon }),
            title: formatMessage(messages.preOrderProject),
        },
        {
            id: 'on-sale',
            icon: React.createElement(Icon, { src: PromotionIcon }),
            title: formatMessage(messages.onSaleProject),
        },
    ];
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(StyledCoverSection, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledBannerTitle, null,
                    React.createElement(AntdIcon, { type: "appstore", theme: "filled", className: "mr-2" }),
                    React.createElement("span", null, title || pageTitle || formatMessage(messages.exploreProjects))),
                !noSelector && (React.createElement(Button, { type: selectedCategoryId === null ? 'primary' : 'default', shape: "round", className: "mb-2", onClick: function () { return setSelectedCategoryId(null); } }, formatMessage(commonMessages.button.allCategory))),
                !noSelector &&
                    categories.map(function (category) { return (React.createElement(Button, { key: category.id, type: selectedCategoryId === category.id ? 'primary' : 'default', shape: "round", className: "ml-2 mb-2", onClick: function () { return setSelectedCategoryId(category.id); } }, category.name)); }))),
        React.createElement(StyledContentSection, null,
            React.createElement("div", { className: "container" }, defaultActive ? (React.createElement("div", { className: "row" }, projects
                .filter(function (project) {
                return !selectedCategoryId || project.categories.some(function (category) { return category.id === selectedCategoryId; });
            })
                .map(function (project) { return (React.createElement("div", { key: project.id, className: "col-12 col-lg-4 mb-5" },
                React.createElement(Link, { to: "/projects/" + project.id },
                    React.createElement(ProjectIntroCard, __assign({}, project))))); }))) : (projectSections
                .filter(function (projectSection) {
                return projects.filter(function (project) {
                    return project.type === projectSection.id &&
                        (!selectedCategoryId || project.categories.some(function (category) { return category.id === selectedCategoryId; }));
                }).length;
            })
                .map(function (projectSection) { return (React.createElement("div", { key: projectSection.id, className: "mb-4" },
                !noSubtitle && (React.createElement(StyledTitle, { className: "mb-5" },
                    React.createElement(AntdIcon, { component: function () { return projectSection.icon; }, className: "mr-2" }),
                    React.createElement("span", null, projectSection.title))),
                React.createElement("div", { className: "row" }, projects
                    .filter(function (project) {
                    return project.type === projectSection.id &&
                        (!selectedCategoryId ||
                            project.categories.some(function (category) { return category.id === selectedCategoryId; }));
                })
                    .map(function (project) { return (React.createElement("div", { key: project.id, className: "col-12 col-lg-4 mb-5" },
                    React.createElement(Link, { to: "/projects/" + project.id },
                        React.createElement(ProjectIntroCard, __assign({}, project))))); })))); }))))));
};
export default ProjectCollectionPage;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ProjectCollectionPage.js.map
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
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ModularBriefFooter from '../../components/common/Footer/ModularBriefFooter';
import DefaultLayout from '../../components/layout/DefaultLayout';
import MessengerChat from '../../components/project/MessengerChat';
import ProjectBannerSection from '../../components/project/ProjectBannerSection';
import ProjectCalloutSection from '../../components/project/ProjectCalloutSection';
import ProjectCardSection from '../../components/project/ProjectCardSection';
import ProjectCommentSection from '../../components/project/ProjectCommentSection';
import ProjectComparisonSection from '../../components/project/ProjectComparisonSection';
import ProjectInstructorSection from '../../components/project/ProjectInstructorSection';
import ProjectProgramCollectionSection from '../../components/project/ProjectProgramCollectionSection';
import ProjectProgramSearchSection from '../../components/project/ProjectProgramSearchSection';
import ProjectPromotionSection from '../../components/project/ProjectPromotionSection';
import ProjectStaticSection from '../../components/project/ProjectStaticSection';
import ProjectStatisticsSection from '../../components/project/ProjectStatisticsSection';
import ProjectSwitchDisplaySection from '../../components/project/ProjectSwitchDisplaySection';
import ProjectTourSection from '../../components/project/ProjectTourSection';
import { useApp } from '../../containers/common/AppContext';
import { useProject } from '../../hooks/project';
import LoadingPage from '../LoadingPage';
var ModularPage = function (_a) {
    var projectId = _a.projectId;
    var settings = useApp().settings;
    var project = useProject(projectId).project;
    var _b = useState((project === null || project === void 0 ? void 0 : project.projectSections.map(function (projectSection) { return projectSection.type; })) || []), displaySectionTypes = _b[0], setDisplaySectionTypes = _b[1];
    useEffect(function () {
        return function () {
            var element = document.getElementById('fb-root');
            element && element.remove();
        };
    }, []);
    if (!project) {
        return React.createElement(LoadingPage, null);
    }
    var seoMeta;
    try {
        seoMeta = JSON.parse(settings['seo.meta']).ProjectPage["" + projectId];
    }
    catch (error) { }
    var siteTitle = (seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title) || (project === null || project === void 0 ? void 0 : project.title);
    var siteDescription = (seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.description) || (project === null || project === void 0 ? void 0 : project.description);
    var siteImage = (project === null || project === void 0 ? void 0 : project.previewUrl) || (project === null || project === void 0 ? void 0 : project.coverUrl);
    var ldData = JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: siteTitle,
        image: siteImage,
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
            React.createElement("meta", { property: "og:image", content: siteImage }),
            React.createElement("meta", { property: "og:image:url", content: siteImage }),
            React.createElement("meta", { property: "og:image:secure_url", content: siteImage }),
            React.createElement("meta", { property: "og:description", content: siteDescription }),
            React.createElement("script", { type: "application/ld+json" }, ldData)),
        project.projectSections
            .filter(function (projectSection) {
            return displaySectionTypes.find(function (displaySectionType) { return projectSection.type === displaySectionType; });
        })
            .map(function (projectSection) {
            switch (projectSection.type) {
                case 'switchDisplay':
                    return (React.createElement(ProjectSwitchDisplaySection, { key: projectSection.id, projectId: project.id, onDisplayProjectSectionTypesSet: setDisplaySectionTypes }));
                case 'messenger':
                    return (process.env.REACT_APP_FACEBOOK_APP_ID && (React.createElement(MessengerChat, __assign({ key: projectSection.id, appId: process.env.REACT_APP_FACEBOOK_APP_ID }, projectSection.options))));
                case 'banner':
                    return (React.createElement(ProjectBannerSection, { key: projectSection.id, title: project.title, abstract: project.abstract, description: project.description, url: project.coverUrl, type: project.coverType, expiredAt: project.expiredAt, callout: projectSection.options.callout, backgroundImage: projectSection.options.backgroundImage }));
                case 'statistics':
                    return (React.createElement(ProjectStatisticsSection, { key: projectSection.id, title: projectSection.options.title, subtitle: projectSection.options.subtitle, items: projectSection.options.items }));
                case 'static':
                    return React.createElement(ProjectStaticSection, { key: projectSection.id, html: projectSection.options.html });
                case 'card':
                    return (React.createElement(ProjectCardSection, { key: projectSection.id, title: projectSection.options.title, subtitle: projectSection.options.subtitle, items: projectSection.options.items }));
                case 'tour':
                    return React.createElement(ProjectTourSection, { key: projectSection.id, trips: projectSection.options.trips });
                case 'comparison':
                    return React.createElement(ProjectComparisonSection, { key: projectSection.id, items: projectSection.options.items });
                case 'promotion':
                    return (React.createElement(ProjectPromotionSection, { key: projectSection.id, expiredAt: project.expiredAt, promotions: projectSection.options.promotions, button: projectSection.options.button }));
                case 'comment':
                    return (React.createElement(ProjectCommentSection, { key: projectSection.id, items: projectSection.options.items }, projectSection.options.items.map(function (item, idx) {
                        return React.createElement("div", { key: idx }, JSON.stringify(item));
                    })));
                case 'callout':
                    return (React.createElement(ProjectCalloutSection, { key: projectSection.id, title: projectSection.options.title, callout: projectSection.options.callout }));
                case 'instructor':
                    return (React.createElement(ProjectInstructorSection, { key: projectSection.id, title: projectSection.options.title, items: projectSection.options.items, callout: projectSection.options.callout }));
                case 'programSearch':
                    return (React.createElement(ProjectProgramSearchSection, { key: projectSection.id, projectId: projectId, coverUrl: projectSection.options.coverUrl, category: projectSection.options.programCategory }));
                case 'programCollection':
                    return (React.createElement(ProjectProgramCollectionSection, { key: projectSection.id, projectId: projectId, programCategory: projectSection.options.programCategory }));
                case 'modularBriefFooter':
                    return React.createElement(ModularBriefFooter, { key: projectSection.id, navs: projectSection.options.navs });
                default:
                    return React.createElement("div", { key: projectSection.id }, JSON.stringify(projectSection));
            }
        })));
};
export default ModularPage;
//# sourceMappingURL=ModularPage.js.map
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
import React from 'react';
import { Helmet } from 'react-helmet';
import DefaultLayout from '../../components/layout/DefaultLayout';
import OnSaleCallToActionSection from '../../components/project/OnSaleCallToActionSection';
import OnSaleCommentSection from '../../components/project/OnSaleCommentSection';
import OnSaleComparisonSection from '../../components/project/OnSaleComparisonSection';
import OnSaleCoverSection from '../../components/project/OnSaleCoverSection';
import OnSaleIntroductionSection from '../../components/project/OnSaleIntroductionSection';
import OnSaleProjectPlanSection from '../../components/project/OnSaleProjectPlanSection';
import OnSaleRoadmapSection from '../../components/project/OnSaleRoadmapSection';
import OnSaleSkillSection from '../../components/project/OnSaleSkillSection';
import OnSaleTrialSection from '../../components/project/OnSaleTrialSection';
import { useApp } from '../../containers/common/AppContext';
var OnSalePage = function (_a) {
    var id = _a.id, expiredAt = _a.expiredAt, coverType = _a.coverType, coverUrl = _a.coverUrl, title = _a.title, abstract = _a.abstract, description = _a.description, introduction = _a.introduction, contents = _a.contents, updates = _a.updates, comments = _a.comments, projectPlans = _a.projectPlans;
    var settings = useApp().settings;
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
        React.createElement(OnSaleCoverSection, __assign({ cover: { title: title, abstract: abstract, description: description, url: coverUrl, type: coverType }, expiredAt: expiredAt }, contents.slogan)),
        React.createElement(OnSaleIntroductionSection, { introduction: introduction }),
        React.createElement(OnSaleSkillSection, __assign({}, contents.skill)),
        React.createElement(OnSaleRoadmapSection, { roadmaps: contents.roadmaps }),
        React.createElement(OnSaleTrialSection, __assign({}, contents.trial)),
        React.createElement(OnSaleComparisonSection, { comparisons: contents.comparisons }),
        React.createElement(OnSaleProjectPlanSection, { projectPlans: projectPlans || [] }),
        React.createElement(OnSaleCommentSection, { comments: comments }),
        React.createElement(OnSaleCallToActionSection, { updates: updates, expiredAt: expiredAt, projectId: id })));
};
export default OnSalePage;
//# sourceMappingURL=OnSalePage.js.map
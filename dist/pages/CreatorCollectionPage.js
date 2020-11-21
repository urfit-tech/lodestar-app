var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon, Skeleton } from 'antd';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import CreatorBriefCard from '../components/appointment/CreatorBriefCard';
import { BREAK_POINT } from '../components/common/Responsive';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { desktopViewMixin } from '../helpers';
import { commonMessages, usersMessages } from '../helpers/translation';
import { useNav } from '../hooks/data';
import { useCreatorCollection } from '../hooks/member';
var StyledSection = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: #f7f8f8;\n"], ["\n  background: #f7f8f8;\n"])));
var StyledCollectionBlock = styled.section(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background: white;\n  padding: 2rem 0;\n\n  @media (min-width: ", "px) {\n    padding: 56px;\n  }\n"], ["\n  background: white;\n  padding: 2rem 0;\n\n  @media (min-width: ", "px) {\n    padding: 56px;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.h1(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 32px;\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n\n  @media (min-width: ", "px) {\n    margin-bottom: 40px;\n  }\n"], ["\n  margin-bottom: 32px;\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n\n  @media (min-width: ", "px) {\n    margin-bottom: 40px;\n  }\n"])), BREAK_POINT);
var StyledCreatorBlock = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: 50%;\n\n  ", "\n"], ["\n  width: 50%;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    width: 20%;\n  "], ["\n    width: 20%;\n  "])))));
var CreatorCollectionPage = function () {
    var _a;
    var formatMessage = useIntl().formatMessage;
    var settings = useApp().settings;
    var pageTitle = useNav().pageTitle;
    var _b = useCreatorCollection(), loadingCreators = _b.loadingCreators, errorCreators = _b.errorCreators, creators = _b.creators;
    var seoMeta;
    try {
        seoMeta = (_a = JSON.parse(settings['seo.meta'])) === null || _a === void 0 ? void 0 : _a.CreatorCollectionPage;
    }
    catch (error) { }
    var ldData = JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title,
        description: seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.description,
        url: window.location.href,
        brand: {
            '@type': 'Brand',
            name: settings['seo.name'],
            description: settings['open_graph.description'],
        },
    });
    return (React.createElement(DefaultLayout, null,
        React.createElement(Helmet, null,
            React.createElement("title", null, seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title),
            React.createElement("meta", { name: "description", content: seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.description }),
            React.createElement("meta", { property: "og:type", content: "website" }),
            React.createElement("meta", { property: "og:title", content: seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title }),
            React.createElement("meta", { property: "og:url", content: window.location.href }),
            React.createElement("meta", { property: "og:description", content: seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.description }),
            React.createElement("script", { type: "application/ld+json" }, ldData)),
        React.createElement(StyledSection, null,
            React.createElement("div", { className: "py-5 container" },
                React.createElement(StyledTitle, null,
                    React.createElement(Icon, { type: "appstore", theme: "filled", className: "mr-3" }),
                    React.createElement("span", null, pageTitle || formatMessage(usersMessages.content.creatorList))))),
        React.createElement(StyledCollectionBlock, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledTitle, null, formatMessage(usersMessages.content.recommend)),
                loadingCreators ? (React.createElement(Skeleton, { avatar: true, active: true })) : !!errorCreators ? (React.createElement("div", null, formatMessage(commonMessages.status.readingError))) : (React.createElement("div", { className: "row" }, creators.slice(0, 4).map(function (creator) { return (React.createElement("div", { key: creator.id, className: "col-6 col-lg-3 mb-4 p-4" },
                    React.createElement(Link, { to: "/creators/" + creator.id },
                        React.createElement(CreatorBriefCard, { variant: "featuring", imageUrl: creator.avatarUrl, title: creator.name, meta: creator.title, description: creator.abstract })))); }))),
                React.createElement(StyledTitle, null, formatMessage(usersMessages.content.allCreators)),
                loadingCreators ? (React.createElement(Skeleton, { avatar: true, active: true })) : !!errorCreators ? (React.createElement("div", null, formatMessage(commonMessages.status.readingError))) : (React.createElement("div", { className: "row" }, creators.map(function (creator) { return (React.createElement(StyledCreatorBlock, { key: creator.id, className: "mb-4 p-4" },
                    React.createElement(Link, { to: "/creators/" + creator.id },
                        React.createElement(CreatorBriefCard, { imageUrl: creator.avatarUrl, title: creator.name, meta: creator.abstract })))); })))))));
};
export default CreatorCollectionPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=CreatorCollectionPage.js.map
import { Button, Icon, Skeleton } from 'antd';
import { flatten, uniqBy } from 'ramda';
import React, { useContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params';
import { useAuth } from '../components/auth/AuthContext';
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout';
import DefaultLayout from '../components/layout/DefaultLayout';
import ProgramCard from '../components/program/ProgramCard';
import ProgramCollectionBanner from '../components/program/ProgramCollectionBanner';
import { useApp } from '../containers/common/AppContext';
import LanguageContext from '../contexts/LanguageContext';
import { notEmpty } from '../helpers';
import { commonMessages, productMessages } from '../helpers/translation';
import { useNav } from '../hooks/data';
import { useEnrolledProgramIds, usePublishedProgramCollection } from '../hooks/program';
var ProgramCollectionPage = function () {
    var formatMessage = useIntl().formatMessage;
    var defaultActive = useQueryParam('active', StringParam)[0];
    var type = useQueryParam('type', StringParam)[0];
    var title = useQueryParam('title', StringParam)[0];
    var noPrice = useQueryParam('noPrice', BooleanParam)[0];
    var noMeta = useQueryParam('noMeta', BooleanParam)[0];
    var noSelector = useQueryParam('noSelector', BooleanParam)[0];
    var noBanner = useQueryParam('noBanner', BooleanParam)[0];
    var permitted = useQueryParam('permitted', BooleanParam)[0];
    var currentMemberId = useAuth().currentMemberId;
    var settings = useApp().settings;
    var pageTitle = useNav().pageTitle;
    var currentLanguage = useContext(LanguageContext).currentLanguage;
    var _a = usePublishedProgramCollection({
        isPrivate: permitted ? undefined : false,
        categoryId: defaultActive || undefined,
    }), loadingPrograms = _a.loadingPrograms, errorPrograms = _a.errorPrograms, programs = _a.programs;
    var enrolledProgramIds = useEnrolledProgramIds(currentMemberId || '').enrolledProgramIds;
    var _b = useState(defaultActive || null), selectedCategoryId = _b[0], setSelectedCategoryId = _b[1];
    var categories = uniqBy(function (category) { return category.id; }, flatten(programs.map(function (program) { return program.categories; }).filter(notEmpty)));
    useEffect(function () {
        if (programs) {
            programs.forEach(function (program, index) {
                var _a, _b;
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
                    position: index + 1,
                });
            });
            ReactGA.ga('send', 'pageview');
        }
    }, [programs]);
    var seoMeta;
    try {
        seoMeta = JSON.parse(settings['seo.meta']).ProgramCollectionPage;
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
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(Helmet, null,
            React.createElement("title", null, seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title),
            React.createElement("meta", { name: "description", content: seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.description }),
            React.createElement("meta", { property: "og:type", content: "website" }),
            React.createElement("meta", { property: "og:title", content: seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title }),
            React.createElement("meta", { property: "og:url", content: window.location.href }),
            React.createElement("meta", { property: "og:description", content: seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.description }),
            React.createElement("script", { type: "application/ld+json" }, ldData)),
        React.createElement(StyledBanner, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledBannerTitle, null,
                    React.createElement(Icon, { type: "appstore", theme: "filled", className: "mr-3" }),
                    React.createElement("span", null, title || pageTitle || formatMessage(productMessages.program.title.explore))),
                !noSelector && (React.createElement(Button, { type: selectedCategoryId === null ? 'primary' : 'default', shape: "round", className: "mb-2", onClick: function () { return setSelectedCategoryId(null); } }, formatMessage(commonMessages.button.allCategory))),
                !noSelector &&
                    categories.map(function (category) { return (React.createElement(Button, { key: category.id, type: selectedCategoryId === category.id ? 'primary' : 'default', shape: "round", className: "ml-2 mb-2", onClick: function () { return setSelectedCategoryId(category.id); } }, category.name)); }))),
        React.createElement(StyledCollection, null,
            React.createElement("div", { className: "container" },
                !noBanner && settings['program_collection_banner.enabled'] === 'true' && (React.createElement(ProgramCollectionBanner, { link: settings['program_collection_banner.link'], imgUrls: {
                        0: settings['program_collection_banner.img_url@0'],
                        425: settings['program_collection_banner.img_url@425'],
                    } })),
                React.createElement("div", { className: "row" }, loadingPrograms ? (React.createElement(Skeleton, { active: true })) : !!errorPrograms ? (React.createElement("div", null, formatMessage(commonMessages.status.readingFail))) : (programs
                    .filter(function (program) {
                    var _a;
                    return (!selectedCategoryId || ((_a = program.categories) === null || _a === void 0 ? void 0 : _a.some(function (category) { return category.id === selectedCategoryId; }))) &&
                        (!program.supportLocales || program.supportLocales.find(function (locale) { return locale === currentLanguage; }));
                })
                    .map(function (program) { return (React.createElement("div", { key: program.id, className: "col-12 col-md-6 col-lg-4 mb-4" },
                    React.createElement(ProgramCard, { program: program, programType: type, isEnrolled: enrolledProgramIds.includes(program.id), noPrice: !!noPrice, withMeta: !noMeta }))); })))))));
};
export default ProgramCollectionPage;
//# sourceMappingURL=ProgramCollectionPage.js.map
import { Button, Icon } from 'antd';
import { flatten, uniqBy } from 'ramda';
import React, { useContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useAuth } from '../components/auth/AuthContext';
import { AuthModalContext } from '../components/auth/AuthModal';
import { StyledBanner, StyledBannerTitle } from '../components/layout';
import DefaultLayout from '../components/layout/DefaultLayout';
import PodcastProgramCard from '../components/podcast/PodcastProgramCard';
import PodcastProgramPopover from '../components/podcast/PodcastProgramPopover';
import CheckoutPodcastPlanModal from '../containers/checkout/CheckoutPodcastPlanModal';
import { useApp } from '../containers/common/AppContext';
import PodcastProgramTimeline from '../containers/podcast/PodcastProgramTimeline';
import PopularPodcastCollection from '../containers/podcast/PopularPodcastCollection';
import LanguageContext from '../contexts/LanguageContext';
import { commonMessages, productMessages } from '../helpers/translation';
import { useNav } from '../hooks/data';
import { useMember } from '../hooks/member';
import { usePodcastProgramCollection } from '../hooks/podcast';
var PodcastProgramCollectionPage = function () {
    var _a;
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), currentMemberId = _b.currentMemberId, isAuthenticated = _b.isAuthenticated;
    var settings = useApp().settings;
    var pageTitle = useNav().pageTitle;
    var currentLanguage = useContext(LanguageContext).currentLanguage;
    var podcastPrograms = usePodcastProgramCollection().podcastPrograms;
    var member = useMember(currentMemberId || '').member;
    var _c = useState(null), selectedCategoryId = _c[0], setSelectedCategoryId = _c[1];
    var categories = uniqBy(function (category) { return category.id; }, flatten(podcastPrograms.map(function (podcastProgram) { return podcastProgram.categories; })));
    var seoMeta;
    try {
        seoMeta = (_a = JSON.parse(settings['seo.meta'])) === null || _a === void 0 ? void 0 : _a.PodcastProgramCollectionPage;
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
    useEffect(function () {
        if (podcastPrograms) {
            podcastPrograms.forEach(function (podcastProgram, index) {
                ReactGA.plugin.execute('ec', 'addProduct', {
                    id: podcastProgram.id,
                    name: podcastProgram.title,
                    category: 'PodcastProgram',
                    price: "" + podcastProgram.listPrice,
                    quantity: '1',
                    currency: 'TWD',
                });
                ReactGA.plugin.execute('ec', 'addImpression', {
                    id: podcastProgram.id,
                    name: podcastProgram.title,
                    category: 'PodcastProgram',
                    price: "" + podcastProgram.listPrice,
                    position: index + 1,
                });
            });
            ReactGA.plugin.execute('ec', 'setAction', 'detail');
            ReactGA.ga('send', 'pageview');
        }
    }, [podcastPrograms]);
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
                    React.createElement("span", null, pageTitle || formatMessage(productMessages.podcast.title.broadcast))),
                React.createElement(Button, { type: selectedCategoryId === null ? 'primary' : 'default', shape: "round", onClick: function () { return setSelectedCategoryId(null); }, className: "mb-2" }, formatMessage(commonMessages.button.allCategory)),
                categories.map(function (category) { return (React.createElement(Button, { key: category.id, type: selectedCategoryId === category.id ? 'primary' : 'default', shape: "round", className: "ml-2 mb-2", onClick: function () { return setSelectedCategoryId(category.id); } }, category.name)); }))),
        React.createElement(AuthModalContext.Consumer, null, function (_a) {
            var setAuthModalVisible = _a.setVisible;
            return (React.createElement("div", { className: "container py-5" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-12 col-lg-8 mb-5" },
                        React.createElement(PodcastProgramTimeline, { memberId: currentMemberId, podcastPrograms: podcastPrograms
                                .filter(function (podcastProgram) {
                                return !selectedCategoryId ||
                                    podcastProgram.categories.some(function (category) { return category.id === selectedCategoryId; });
                            })
                                .filter(function (podcastProgram) {
                                return !podcastProgram.supportLocales ||
                                    podcastProgram.supportLocales.find(function (locale) { return locale === currentLanguage; });
                            }), renderItem: function (_a) {
                                var _b;
                                var podcastProgram = _a.podcastProgram, isEnrolled = _a.isEnrolled, isSubscribed = _a.isSubscribed;
                                return (React.createElement(CheckoutPodcastPlanModal, { renderTrigger: function (_a) {
                                        var setCheckoutModalVisible = _a.setVisible;
                                        return (React.createElement(PodcastProgramPopover, { key: podcastProgram.id, isEnrolled: isEnrolled, isSubscribed: isSubscribed, podcastProgramId: podcastProgram.id, title: podcastProgram.title, listPrice: podcastProgram.listPrice, salePrice: podcastProgram.salePrice, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, description: podcastProgram.description, categories: podcastProgram.categories, instructor: podcastProgram.instructor, onSubscribe: function () {
                                                return isAuthenticated
                                                    ? setCheckoutModalVisible()
                                                    : setAuthModalVisible && setAuthModalVisible(true);
                                            } },
                                            React.createElement(PodcastProgramCard, { coverUrl: podcastProgram.coverUrl, title: podcastProgram.title, instructor: podcastProgram.instructor, salePrice: podcastProgram.salePrice, listPrice: podcastProgram.listPrice, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, isEnrolled: isEnrolled })));
                                    }, paymentType: "subscription", creatorId: ((_b = podcastProgram.instructor) === null || _b === void 0 ? void 0 : _b.id) || '', member: member }));
                            } })),
                    React.createElement("div", { className: "col-12 col-lg-4 pl-4" },
                        React.createElement(PopularPodcastCollection, null)))));
        })));
};
export default PodcastProgramCollectionPage;
//# sourceMappingURL=PodcastProgramCollectionPage.js.map
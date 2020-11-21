var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Button, Divider, Skeleton } from 'antd';
import BraftEditor from 'braft-editor';
import gql from 'graphql-tag';
import { render } from 'mustache';
import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ActivityBanner from '../components/activity/ActivityBanner';
import ActivitySessionItem from '../components/activity/ActivitySessionItem';
import ActivityTicket from '../components/activity/ActivityTicket';
import { useAuth } from '../components/auth/AuthContext';
import { AuthModalContext } from '../components/auth/AuthModal';
import CreatorCard from '../components/common/CreatorCard';
import { BREAK_POINT } from '../components/common/Responsive';
import { BraftContent } from '../components/common/StyledBraftEditor';
import DefaultLayout from '../components/layout/DefaultLayout';
import CheckoutProductModal from '../containers/checkout/CheckoutProductModal';
import { useApp } from '../containers/common/AppContext';
import { commonMessages, productMessages } from '../helpers/translation';
import { useMember, usePublicMember } from '../hooks/member';
var ActivityContent = styled(Container)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    padding-top: 56px;\n  }\n"], ["\n  && {\n    padding-top: 56px;\n  }\n"])));
var ActivityOrganizer = styled(Col)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  @media (min-width: 320px) and (max-width: ", "px) {\n    text-align: center;\n    h3 {\n      padding-top: 24px;\n    }\n    p {\n      text-align: left;\n    }\n  }\n"], ["\n  @media (min-width: 320px) and (max-width: ", "px) {\n    text-align: center;\n    h3 {\n      padding-top: 24px;\n    }\n    p {\n      text-align: left;\n    }\n  }\n"])), BREAK_POINT);
var ActivityPage = function () {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var activityId = useParams().activityId;
    var _a = useAuth(), isAuthenticated = _a.isAuthenticated, currentMemberId = _a.currentMemberId;
    var _b = useApp(), settings = _b.settings, appId = _b.id;
    var _c = useMember(currentMemberId || ''), loadingMember = _c.loadingMember, member = _c.member;
    var _d = useQuery(GET_ACTIVITY, {
        variables: {
            activityId: activityId,
            memberId: currentMemberId || '',
        },
    }), loading = _d.loading, error = _d.error, data = _d.data;
    useEffect(function () {
        if (data === null || data === void 0 ? void 0 : data.activity_by_pk) {
            data.activity_by_pk.activity_tickets.forEach(function (activityTicket, index) {
                var _a, _b;
                ReactGA.plugin.execute('ec', 'addProduct', {
                    id: activityTicket.id,
                    name: ((_a = data.activity_by_pk) === null || _a === void 0 ? void 0 : _a.title) + " - " + activityTicket.title,
                    category: 'ActivityTicket',
                    price: "" + activityTicket.price,
                    quantity: '1',
                    currency: 'TWD',
                });
                ReactGA.plugin.execute('ec', 'addImpression', {
                    id: activityTicket.id,
                    name: ((_b = data.activity_by_pk) === null || _b === void 0 ? void 0 : _b.title) + " - " + activityTicket.title,
                    category: 'ActivityTicket',
                    price: "" + activityTicket.price,
                    position: index + 1,
                });
            });
            if (data.activity_by_pk.activity_tickets.length > 0) {
                ReactGA.plugin.execute('ec', 'setAction', 'detail');
            }
            ReactGA.ga('send', 'pageview');
        }
    }, [data]);
    if (loading || loadingMember) {
        return (React.createElement(DefaultLayout, { white: true },
            React.createElement(Skeleton, { active: true })));
    }
    if (error || !data || !data.activity_by_pk) {
        return React.createElement(DefaultLayout, { white: true }, formatMessage(commonMessages.status.readingError));
    }
    var seoMeta;
    try {
        seoMeta = JSON.parse(settings['seo.meta']).ActivityPage;
    }
    catch (error) { }
    var siteTitle = data.activity_by_pk.title
        ? (seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title) ? "" + render(seoMeta.title, { activityTitle: data.activity_by_pk.title })
            : data.activity_by_pk.title
        : appId;
    var siteDescription = BraftEditor.createEditorState(data.activity_by_pk.description)
        .toHTML()
        .replace(/(<([^>]+)>)/gi, '')
        .substr(0, 50);
    var ldData = JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: siteTitle,
        image: data.activity_by_pk.cover_url,
        description: siteDescription,
        url: window.location.href,
        brand: {
            '@type': 'Brand',
            name: siteTitle,
            description: siteDescription,
        },
    });
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(Helmet, null,
            React.createElement("title", null, siteTitle),
            React.createElement("meta", { name: "description", content: siteDescription }),
            React.createElement("meta", { property: "og:type", content: "website" }),
            React.createElement("meta", { property: "og:title", content: siteTitle }),
            React.createElement("meta", { property: "og:url", content: window.location.href }),
            React.createElement("meta", { property: "og:image", content: data.activity_by_pk.cover_url || '' }),
            React.createElement("meta", { property: "og:description", content: siteDescription }),
            React.createElement("script", { type: "application/ld+json" }, ldData)),
        React.createElement(ActivityBanner, { coverImage: data.activity_by_pk.cover_url || '', activityTitle: data.activity_by_pk.title, activityCategories: data.activity_by_pk.activity_categories }),
        React.createElement(ActivityContent, null,
            React.createElement(Row, null,
                React.createElement(Col, { xs: 12, lg: 8 },
                    React.createElement("div", { className: "mb-5" },
                        React.createElement(BraftContent, null, data.activity_by_pk.description)),
                    React.createElement("h2", { className: "mb-0" }, formatMessage(productMessages.activity.title.event)),
                    React.createElement(Divider, { className: "mt-0" }),
                    data.activity_by_pk.activity_sessions.map(function (session, i) { return (React.createElement("div", { key: i, className: "mb-4" },
                        React.createElement(ActivitySessionItem, { activitySessionId: session.id }))); })),
                React.createElement(Col, { xs: 12, lg: 4 },
                    React.createElement(AuthModalContext.Consumer, null, function (_a) {
                        var _b;
                        var setAuthModalVisible = _a.setVisible;
                        return (_b = data.activity_by_pk) === null || _b === void 0 ? void 0 : _b.activity_tickets.map(function (ticket) {
                            var participants = ticket.activity_ticket_enrollments_aggregate.aggregate
                                ? ticket.activity_ticket_enrollments_aggregate.aggregate.count || 0
                                : 0;
                            return (React.createElement("div", { key: ticket.id, className: "mb-4" },
                                React.createElement(ActivityTicket, { id: ticket.id, title: ticket.title, description: ticket.description, price: ticket.price, count: ticket.count, startedAt: new Date(ticket.started_at), endedAt: new Date(ticket.ended_at), isPublished: ticket.is_published, activitySessionTickets: ticket.activity_session_tickets.map(function (sessionTicket) { return ({
                                        id: sessionTicket.id,
                                        activitySession: sessionTicket.activity_session,
                                    }); }), participants: participants, extra: !data.activity_by_pk ||
                                        !data.activity_by_pk.published_at ||
                                        new Date(data.activity_by_pk.published_at).getTime() > Date.now() ||
                                        new Date(ticket.started_at).getTime() > Date.now() ? (React.createElement(Button, { block: true, disabled: true }, formatMessage(commonMessages.button.unreleased))) : ticket.activity_ticket_enrollments.length > 0 ? (React.createElement(Button, { block: true, onClick: function () {
                                            return history.push("/orders/" + ticket.activity_ticket_enrollments[0].order_log_id + "/products/" + ticket.activity_ticket_enrollments[0].order_product_id);
                                        } }, formatMessage(commonMessages.button.ticket))) : participants >= ticket.count ? (React.createElement(Button, { block: true, disabled: true }, formatMessage(commonMessages.button.soldOut))) : new Date(ticket.ended_at).getTime() < Date.now() ? (React.createElement(Button, { block: true, disabled: true }, formatMessage(commonMessages.button.cutoff))) : isAuthenticated ? (React.createElement(CheckoutProductModal, { renderTrigger: function (_a) {
                                            var setVisible = _a.setVisible;
                                            return (React.createElement(Button, { type: "primary", block: true, onClick: function () {
                                                    var _a;
                                                    ReactGA.plugin.execute('ec', 'addProduct', {
                                                        id: ticket.id,
                                                        name: ((_a = data.activity_by_pk) === null || _a === void 0 ? void 0 : _a.title) + " - " + ticket.title,
                                                        category: 'ActivityTicket',
                                                        price: "" + ticket.price,
                                                        quantity: '1',
                                                        currency: 'TWD',
                                                    });
                                                    ReactGA.plugin.execute('ec', 'setAction', 'add');
                                                    ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart');
                                                    setVisible();
                                                } }, formatMessage(commonMessages.button.register)));
                                        }, paymentType: "perpetual", defaultProductId: "ActivityTicket_" + ticket.id, member: member })) : (React.createElement(Button, { type: "primary", block: true, onClick: function () { return setAuthModalVisible && setAuthModalVisible(true); } }, formatMessage(commonMessages.button.register))) })));
                        });
                    }))),
            React.createElement(Row, { className: "mb-5" },
                React.createElement(ActivityOrganizer, { xs: 12, lg: 8 },
                    React.createElement("h2", { className: "mb-0" }, formatMessage(productMessages.activity.title.organizer)),
                    React.createElement(Divider, { className: "mt-0" }),
                    React.createElement(ActivityOrganizerIntro, { memberId: data.activity_by_pk.organizer_id }))))));
};
var ActivityOrganizerIntro = function (_a) {
    var memberId = _a.memberId;
    var member = usePublicMember(memberId).member;
    if (!member) {
        return null;
    }
    return (React.createElement(CreatorCard, { id: memberId, avatarUrl: member.pictureUrl, title: member.name || member.username, jobTitle: member.title, description: member.abstract, noPadding: true }));
};
var GET_ACTIVITY = gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  query GET_ACTIVITY($activityId: uuid!, $memberId: String!) {\n    activity_by_pk(id: $activityId) {\n      id\n      organizer_id\n      cover_url\n      title\n      description\n      published_at\n      activity_categories {\n        id\n        category {\n          id\n          name\n        }\n      }\n      activity_sessions(order_by: { started_at: asc }) {\n        id\n      }\n      activity_tickets(where: { is_published: { _eq: true } }, order_by: { started_at: asc }) {\n        id\n        count\n        description\n        started_at\n        is_published\n        ended_at\n        price\n        title\n        activity_session_tickets {\n          id\n          activity_session {\n            id\n            title\n          }\n        }\n        activity_ticket_enrollments_aggregate {\n          aggregate {\n            count\n          }\n        }\n        activity_ticket_enrollments(where: { member_id: { _eq: $memberId } }) {\n          order_log_id\n          order_product_id\n        }\n      }\n    }\n  }\n"], ["\n  query GET_ACTIVITY($activityId: uuid!, $memberId: String!) {\n    activity_by_pk(id: $activityId) {\n      id\n      organizer_id\n      cover_url\n      title\n      description\n      published_at\n      activity_categories {\n        id\n        category {\n          id\n          name\n        }\n      }\n      activity_sessions(order_by: { started_at: asc }) {\n        id\n      }\n      activity_tickets(where: { is_published: { _eq: true } }, order_by: { started_at: asc }) {\n        id\n        count\n        description\n        started_at\n        is_published\n        ended_at\n        price\n        title\n        activity_session_tickets {\n          id\n          activity_session {\n            id\n            title\n          }\n        }\n        activity_ticket_enrollments_aggregate {\n          aggregate {\n            count\n          }\n        }\n        activity_ticket_enrollments(where: { member_id: { _eq: $memberId } }) {\n          order_log_id\n          order_product_id\n        }\n      }\n    }\n  }\n"])));
export default ActivityPage;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ActivityPage.js.map
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useQuery } from '@apollo/react-hooks';
import { SettingsIcon } from '@chakra-ui/icons';
import { Menu } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages } from '../../helpers/translation';
import { useEnrolledMembershipCardIds } from '../../hooks/card';
import { useSocialCardCollection } from '../../hooks/member';
import BookIcon from '../../images/book.svg';
import ClipboardListIcon from '../../images/clipboard-list.svg';
import CoinIcon from '../../images/coin.svg';
import CommentsIcon from '../../images/comments.svg';
import GiftIcon from '../../images/gift.svg';
import IdentityIcon from '../../images/identity.svg';
import MemberCardIcon from '../../images/membercard.svg';
import TicketIcon from '../../images/ticket.svg';
import UserIcon from '../../images/user.svg';
import { routesProps } from '../../Routes';
import { useAuth } from '../auth/AuthContext';
var StyledMenu = styled(Menu)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    border-right: none;\n  }\n\n  & .ant-menu-item-selected.creatorManagementSystem {\n    background: none !important;\n  }\n"], ["\n  && {\n    border-right: none;\n  }\n\n  & .ant-menu-item-selected.creatorManagementSystem {\n    background: none !important;\n  }\n"])));
var AdminMenu = function (_a) {
    var children = _a.children, menuProps = __rest(_a, ["children"]);
    var appId = useApp().id;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var managementDomain = useManagementDomain(appId).managementDomain;
    var handleClick = function (_a) {
        var key = _a.key, item = _a.item;
        if (key.startsWith('_blank')) {
            window.open(item.props['data-href']);
        }
        else if (key.startsWith('creator_management_system')) {
            window.open("//" + (managementDomain === null || managementDomain === void 0 ? void 0 : managementDomain.domain[0]));
        }
        else {
            var route = routesProps[key];
            route ? history.push(route.path) : alert(formatMessage(commonMessages.alert.noPath));
        }
    };
    return (React.createElement(StyledMenu, __assign({}, menuProps, { mode: "inline", onClick: handleClick }), children));
};
export var MemberAdminMenu = function (_a) {
    var props = __rest(_a, []);
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), currentMemberId = _b.currentMemberId, currentUserRole = _b.currentUserRole;
    var _c = useApp(), enabledModules = _c.enabledModules, settings = _c.settings;
    var enrolledMembershipCardIds = useEnrolledMembershipCardIds(currentMemberId || '').enrolledMembershipCardIds;
    var socialCards = useSocialCardCollection().socialCards;
    return (React.createElement(AdminMenu, __assign({}, props, { style: { background: 'transparent', border: 'none' } }),
        currentUserRole === 'content-creator' && (React.createElement(Menu.Item, { key: "creator_management_system", className: "creatorManagementSystem" },
            React.createElement(SettingsIcon, { className: "mr-2" }),
            formatMessage(commonMessages.content.creatorManagementSystem))),
        React.createElement(Menu.Item, { key: "member_profile_admin" },
            React.createElement(Icon, { src: UserIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.personalSettings)),
        React.createElement(Menu.Item, { key: "member_program_issues_admin" },
            React.createElement(Icon, { src: BookIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.courseProblem)),
        React.createElement(Menu.Item, { key: "member_orders_admin" },
            React.createElement(Icon, { src: ClipboardListIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.orderHistory)),
        enabledModules.contract && (React.createElement(Menu.Item, { key: "member_contracts_admin" },
            React.createElement(Icon, { src: ClipboardListIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.contracts))),
        enabledModules.coin && (React.createElement(Menu.Item, { key: "member_coins_admin" },
            React.createElement(Icon, { src: CoinIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.coinsAdmin))),
        enabledModules.social_connect && socialCards.length && (React.createElement(Menu.Item, { key: "member_social_cards" },
            React.createElement(Icon, { src: IdentityIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.socialCard))),
        React.createElement(Menu.Item, { key: "member_coupons_admin" },
            React.createElement(Icon, { src: TicketIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.coupon)),
        enabledModules.voucher && (React.createElement(Menu.Item, { key: "member_voucher_admin" },
            React.createElement(Icon, { src: GiftIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.voucher))),
        enabledModules.member_card && enrolledMembershipCardIds.length > 0 && (React.createElement(Menu.Item, { key: "member_cards_admin" },
            React.createElement(Icon, { src: MemberCardIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.memberCard))),
        React.createElement(Menu.Item, { key: "_blank", "data-href": settings['customer_support_link'] },
            React.createElement(Icon, { src: CommentsIcon, className: "mr-2" }),
            formatMessage(commonMessages.content.contact))));
};
var useManagementDomain = function (appId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_MANAGEMENT_DOMAIN($appId: String) {\n        app_admin(where: { app_id: { _eq: $appId } }, limit: 1, order_by: { position: asc }) {\n          host\n        }\n      }\n    "], ["\n      query GET_MANAGEMENT_DOMAIN($appId: String) {\n        app_admin(where: { app_id: { _eq: $appId } }, limit: 1, order_by: { position: asc }) {\n          host\n        }\n      }\n    "]))), { variables: { appId: appId } }), loading = _a.loading, error = _a.error, data = _a.data;
    var managementDomain = loading || error || !data ? null : { domain: data.app_admin.map(function (data) { return data.host; }) };
    return { loading: loading, error: error, managementDomain: managementDomain };
};
var templateObject_1, templateObject_2;
//# sourceMappingURL=AdminMenu.js.map
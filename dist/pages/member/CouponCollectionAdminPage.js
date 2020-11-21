import { Tabs, Typography } from 'antd';
import { reverse } from 'ramda';
import React, { useState } from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { useAuth } from '../../components/auth/AuthContext';
import CouponAdminCard from '../../components/checkout/CouponAdminCard';
import CouponInsertionCard from '../../components/checkout/CouponInsertionCard';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import { usersMessages } from '../../helpers/translation';
import { useCouponCollection } from '../../hooks/data';
import TicketIcon from '../../images/ticket.svg';
var CouponCollectionAdminPage = function () {
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var coupons = useCouponCollection(currentMemberId || '').coupons;
    var _a = useState('available'), activeKey = _a[0], setActiveKey = _a[1];
    var tabContents = [
        {
            key: 'available',
            tab: formatMessage(usersMessages.tab.available),
            coupons: coupons.filter(function (coupon) { return !coupon.status.outdated && !coupon.status.used; }),
        },
        {
            key: 'notYet',
            tab: formatMessage(usersMessages.tab.notYet),
            coupons: coupons.filter(function (coupon) {
                return coupon.couponCode.couponPlan.startedAt &&
                    coupon.couponCode.couponPlan.startedAt.getTime() > Date.now() &&
                    !coupon.status.used;
            }),
        },
        {
            key: 'expired',
            tab: formatMessage(usersMessages.tab.expired),
            coupons: coupons.filter(function (coupon) {
                return (coupon.couponCode.couponPlan.endedAt && coupon.couponCode.couponPlan.endedAt.getTime() < Date.now()) ||
                    coupon.status.used;
            }),
        },
    ];
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: TicketIcon, className: "mr-3" }),
            React.createElement("span", null, formatMessage(usersMessages.title.coupon))),
        React.createElement("div", { className: "mb-5" },
            React.createElement(CouponInsertionCard, { onInsert: function () { return window.location.reload(); } })),
        React.createElement(Tabs, { activeKey: activeKey || 'available', onChange: function (key) { return setActiveKey(key); } }, tabContents.map(function (tabContent) { return (React.createElement(Tabs.TabPane, { key: tabContent.key, tab: tabContent.tab },
            React.createElement("div", { className: "row" }, reverse(tabContent.coupons).map(function (coupon) { return (React.createElement("div", { className: "mb-3 col-12 col-md-6", key: coupon.id },
                React.createElement(CouponAdminCard, { coupon: coupon, outdated: coupon.status.outdated }))); })))); }))));
};
export default CouponCollectionAdminPage;
//# sourceMappingURL=CouponCollectionAdminPage.js.map
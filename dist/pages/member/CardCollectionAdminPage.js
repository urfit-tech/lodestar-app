var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Skeleton, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useAuth } from '../../components/auth/AuthContext';
import MembershipCardBlock from '../../components/common/MembershipCardBlock';
import DefaultLayout from '../../components/layout/DefaultLayout';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages } from '../../helpers/translation';
import { useEnrolledMembershipCards, useMembershipCard } from '../../hooks/card';
import { useMember } from '../../hooks/member';
import MemberCardIcon from '../../images/membercard.svg';
import NotFoundPage from '../NotFoundPage';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 1.25rem;\n  padding: 1.5rem;\n  overflow: hidden;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);\n"], ["\n  margin-bottom: 1.25rem;\n  padding: 1.5rem;\n  overflow: hidden;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);\n"])));
var CardCollectionAdminPage = function () {
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var _a = useApp(), loading = _a.loading, enabledModules = _a.enabledModules;
    var enrolledMembershipCards = useEnrolledMembershipCards(currentMemberId || '').enrolledMembershipCards;
    if (loading) {
        return (React.createElement(DefaultLayout, null,
            React.createElement(Skeleton, { active: true })));
    }
    if (!enabledModules.member_card) {
        return React.createElement(NotFoundPage, null);
    }
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: MemberCardIcon, className: "mr-3" }),
            React.createElement("span", null, formatMessage(commonMessages.content.memberCard))),
        React.createElement("div", { className: "row" }, enrolledMembershipCards.map(function (membershipCard) { return (React.createElement("div", { className: "col-12 col-lg-6", key: membershipCard.card.id },
            React.createElement(MembershipCardAdminBlock, { cardId: membershipCard.card.id, memberId: currentMemberId || '', updatedAt: membershipCard.updatedAt }))); }))));
};
var MembershipCardAdminBlock = function (_a) {
    var memberId = _a.memberId, cardId = _a.cardId, updatedAt = _a.updatedAt;
    var _b = useMembershipCard(cardId), loadingMembershipCard = _b.loadingMembershipCard, errorMembershipCard = _b.errorMembershipCard, membershipCard = _b.membershipCard;
    var _c = useMember(memberId), loadingMember = _c.loadingMember, errorMember = _c.errorMember, member = _c.member;
    if (loadingMembershipCard || errorMembershipCard || loadingMember || errorMember || !member || !membershipCard) {
        return null;
    }
    return (React.createElement(StyledContainer, null,
        React.createElement(MembershipCardBlock, { template: membershipCard.template, templateVars: {
                avatar: member.pictureUrl,
                name: member.name || '',
                account: member.username,
                date: updatedAt ? moment(updatedAt).format('YYYY/MM/DD') : '',
            }, title: membershipCard.title, description: membershipCard.description })));
};
export default CardCollectionAdminPage;
var templateObject_1;
//# sourceMappingURL=CardCollectionAdminPage.js.map
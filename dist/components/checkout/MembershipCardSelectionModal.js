var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Modal } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { checkoutMessages } from '../../helpers/translation';
import { useEnrolledMembershipCards, useMembershipCard } from '../../hooks/card';
import { useMember } from '../../hooks/member';
import MembershipCardBlock from '../common/MembershipCardBlock';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  padding: 1rem;\n  border: solid 1px #ececec;\n  border-radius: 4px;\n  cursor: pointer;\n"], ["\n  margin-bottom: 0.75rem;\n  padding: 1rem;\n  border: solid 1px #ececec;\n  border-radius: 4px;\n  cursor: pointer;\n"])));
var MembershipCardSelectionModal = function (_a) {
    var memberId = _a.memberId, onSelect = _a.onSelect, render = _a.render;
    var enrolledMembershipCards = useEnrolledMembershipCards(memberId).enrolledMembershipCards;
    var _b = useMember(memberId), loadingMember = _b.loadingMember, errorMember = _b.errorMember, member = _b.member;
    var _c = useState(false), visible = _c[0], setVisible = _c[1];
    var _d = useState(), selectedMembershipCard = _d[0], setSelectedMembershipCard = _d[1];
    var formatMessage = useIntl().formatMessage;
    if (loadingMember || errorMember || !member) {
        return render ? render({ setVisible: setVisible, selectedMembershipCard: selectedMembershipCard }) : null;
    }
    return (React.createElement(React.Fragment, null,
        render && render({ setVisible: setVisible, selectedMembershipCard: selectedMembershipCard }),
        React.createElement(Modal, { title: formatMessage(checkoutMessages.title.chooseMemberCard), footer: null, onCancel: function () { return setVisible(false); }, visible: visible }, enrolledMembershipCards.map(function (membershipCard) { return (React.createElement("div", { key: membershipCard.card.id, onClick: function () {
                onSelect && onSelect(membershipCard.card.id);
                setSelectedMembershipCard({
                    id: membershipCard.card.id,
                    title: membershipCard.card.title,
                });
                setVisible(false);
            } },
            React.createElement(MembershipCardItem, { member: member, membershipCardId: membershipCard.card.id, updatedAt: membershipCard.updatedAt }))); }))));
};
var MembershipCardItem = function (_a) {
    var member = _a.member, membershipCardId = _a.membershipCardId, updatedAt = _a.updatedAt;
    var _b = useMembershipCard(membershipCardId), loadingMembershipCard = _b.loadingMembershipCard, errorMembershipCard = _b.errorMembershipCard, membershipCard = _b.membershipCard;
    if (loadingMembershipCard || errorMembershipCard || !membershipCard) {
        return null;
    }
    return (React.createElement(StyledContainer, null,
        React.createElement(MembershipCardBlock, { template: membershipCard.template, templateVars: {
                avatar: member.pictureUrl,
                name: member.name || '',
                account: member.username,
                date: updatedAt ? moment(updatedAt).format('YYYY//MM/DD') : '',
            }, title: membershipCard.title, description: membershipCard.description, variant: "list-item" })));
};
export default MembershipCardSelectionModal;
var templateObject_1;
//# sourceMappingURL=MembershipCardSelectionModal.js.map
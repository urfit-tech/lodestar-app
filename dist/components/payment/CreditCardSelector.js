var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Radio } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import styled from 'styled-components';
var StyledRadio = styled(Radio)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: block !important;\n  height: 48px;\n  line-height: 48px !important;\n"], ["\n  display: block !important;\n  height: 48px;\n  line-height: 48px !important;\n"])));
var CreditCardSelector = function (_a) {
    var memberId = _a.memberId, value = _a.value, onChange = _a.onChange;
    var memberCreditCards = useMemberCreditCards(memberId).memberCreditCards;
    var handleCreditCardChange = function (e) {
        var value = e.target.value;
        onChange && onChange(value === 'new' ? null : value);
    };
    return (React.createElement(Radio.Group, { onChange: handleCreditCardChange, value: value === null ? 'new' : value },
        memberCreditCards.map(function (memberCreditCard) {
            return (React.createElement(StyledRadio, { key: memberCreditCard.cardIdentifier, value: memberCreditCard.id },
                "\u672B\u56DB\u78BC\uFF1A",
                memberCreditCard.cardInfo['last_four']));
        }),
        React.createElement(StyledRadio, { value: "new" }, "\u65B0\u589E\u4FE1\u7528\u5361")));
};
var useMemberCreditCards = function (memberId) {
    var data = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_MEMBER_CREDIT_CARDS($memberId: String!) {\n        member_card(where: { member_id: { _eq: $memberId } }) {\n          id\n          card_identifier\n          card_info\n          card_holder\n        }\n      }\n    "], ["\n      query GET_MEMBER_CREDIT_CARDS($memberId: String!) {\n        member_card(where: { member_id: { _eq: $memberId } }) {\n          id\n          card_identifier\n          card_info\n          card_holder\n        }\n      }\n    "]))), { variables: { memberId: memberId } }).data;
    var memberCreditCards = (data === null || data === void 0 ? void 0 : data.member_card.map(function (memberCreditCard) { return ({
        id: memberCreditCard.id,
        cardInfo: memberCreditCard.card_info,
        cardIdentifier: memberCreditCard.card_identifier,
        cardHolder: memberCreditCard.card_holder,
    }); })) || [];
    return { memberCreditCards: memberCreditCards };
};
export default CreditCardSelector;
var templateObject_1, templateObject_2;
//# sourceMappingURL=CreditCardSelector.js.map
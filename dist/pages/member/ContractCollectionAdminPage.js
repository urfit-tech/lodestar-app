var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Card, List, Tag, Typography } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages } from '../../helpers/translation';
import CoinIcon from '../../images/coin.svg';
import LoadingPage from '../LoadingPage';
import NotFoundPage from '../NotFoundPage';
var messages = defineMessages({
    duration: { id: 'contract.label.duration', defaultMessage: '服務期間' },
    disagreed: { id: 'contract.label.disagreed', defaultMessage: '尚未簽署' },
    agreed: { id: 'contract.label.agreed', defaultMessage: '已簽署且經過與「{agreeName}」再次確認合約生效' },
    revoked: { id: 'contract.label.revoked', defaultMessage: '已解約' },
});
var ContractCollectionAdminPage = function () {
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var _a = useApp(), loading = _a.loading, enabledModules = _a.enabledModules;
    var memberContractsData = useQuery(GET_MEMBER_CONTRACTS, {
        variables: { memberId: currentMemberId || '' },
    }).data;
    if (loading) {
        return React.createElement(LoadingPage, null);
    }
    if (!enabledModules.contract) {
        return React.createElement(NotFoundPage, null);
    }
    var data = (memberContractsData === null || memberContractsData === void 0 ? void 0 : memberContractsData.member_contract.filter(function (memberContract) { return memberContract.agreed_at; }).map(function (value) {
        return {
            id: value.id,
            title: value.contract.name,
            startedAt: value.started_at,
            endedAt: value.ended_at,
            agreedIp: value.agreed_ip,
            agreedAt: value.agreed_at,
            agreedOptions: value.agreed_options,
            revokedAt: value.revoked_at,
        };
    })) || [];
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: CoinIcon, className: "mr-3" }),
            React.createElement("span", null, formatMessage(commonMessages.content.contracts))),
        React.createElement(List, { grid: { gutter: 16, column: 2 }, dataSource: data, renderItem: function (item) { return (React.createElement(List.Item, null,
                React.createElement(Link, { to: "/members/" + currentMemberId + "/contracts/" + item.id },
                    React.createElement(Card, { title: React.createElement("div", { className: "d-flex justify-content-between" },
                            React.createElement("span", { className: "mr-1" }, item.title),
                            !item.agreedAt && React.createElement(Tag, null, formatMessage(messages.disagreed))) },
                        formatMessage(messages.duration),
                        ": ",
                        moment(item.startedAt).format('YYYY-MM-DD'),
                        " ~",
                        ' ',
                        moment(item.endedAt).format('YYYY-MM-DD'),
                        item.revokedAt && (React.createElement("div", null,
                            React.createElement("span", { className: "mr-1" }, moment(item.revokedAt).format('YYYY-MM-DD HH:mm:ss')),
                            formatMessage(messages.revoked))),
                        !item.revokedAt && item.agreedAt && (React.createElement("div", null,
                            React.createElement("span", { className: "mr-1" }, moment(item.agreedAt).format('YYYY-MM-DD HH:mm:ss')),
                            formatMessage(messages.agreed, { agreeName: item.agreedOptions.agreedName }))))))); } })));
};
var GET_MEMBER_CONTRACTS = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_MEMBER_CONTRACTS($memberId: String!) {\n    member_contract(where: { member_id: { _eq: $memberId } }) {\n      id\n      agreed_at\n      agreed_ip\n      agreed_options\n      revoked_at\n      started_at\n      ended_at\n      contract {\n        name\n      }\n    }\n  }\n"], ["\n  query GET_MEMBER_CONTRACTS($memberId: String!) {\n    member_contract(where: { member_id: { _eq: $memberId } }) {\n      id\n      agreed_at\n      agreed_ip\n      agreed_options\n      revoked_at\n      started_at\n      ended_at\n      contract {\n        name\n      }\n    }\n  }\n"])));
export default ContractCollectionAdminPage;
var templateObject_1;
//# sourceMappingURL=ContractCollectionAdminPage.js.map
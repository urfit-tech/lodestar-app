var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useMutation } from '@apollo/react-hooks';
import { Card, Checkbox, Typography } from 'antd';
import Axios from 'axios';
import gql from 'graphql-tag';
import moment from 'moment';
import { render } from 'mustache';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useMemberContract } from '../hooks/data';
var StyledTitle = styled(Typography.Title)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    margin-bottom: 36px;\n    font-size: 24px;\n    font-weight: bold;\n    line-height: 1.3;\n    letter-spacing: 0.77px;\n  }\n"], ["\n  && {\n    margin-bottom: 36px;\n    font-size: 24px;\n    font-weight: bold;\n    line-height: 1.3;\n    letter-spacing: 0.77px;\n  }\n"])));
var StyledCard = styled(Card)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    margin-bottom: 20px;\n  }\n\n  .ant-card-body {\n    padding: 40px;\n  }\n\n  p,\n  li {\n    margin-bottom: 0;\n    line-height: 1.69;\n    letter-spacing: 0.2px;\n  }\n\n  ol {\n    padding-left: 50px;\n    li {\n      padding-left: 16px;\n    }\n  }\n"], ["\n  && {\n    margin-bottom: 20px;\n  }\n\n  .ant-card-body {\n    padding: 40px;\n  }\n\n  p,\n  li {\n    margin-bottom: 0;\n    line-height: 1.69;\n    letter-spacing: 0.2px;\n  }\n\n  ol {\n    padding-left: 50px;\n    li {\n      padding-left: 16px;\n    }\n  }\n"])));
var StyledSection = styled.section(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background: #f7f8f8;\n  padding-top: 56px;\n  padding-bottom: 80px;\n  text-align: justify;\n\n  & > ", " {\n    text-align: center;\n  }\n  ol p {\n    text-indent: 2rem;\n  }\n"], ["\n  background: #f7f8f8;\n  padding-top: 56px;\n  padding-bottom: 80px;\n  text-align: justify;\n\n  & > ", " {\n    text-align: center;\n  }\n  ol p {\n    text-indent: 2rem;\n  }\n"])), StyledTitle);
var ContractPage = function () {
    var _a, _b, _c, _d;
    var memberContractId = useParams().memberContractId;
    var _e = useState('unknown'), agreedIp = _e[0], setAgreedIpAddress = _e[1];
    var _f = useMemberContract(memberContractId), memberContract = _f.memberContract, refetchMemberContract = _f.refetch;
    var agreeMemberContract = useMutation(AGREE_MEMBER_CONTRACT)[0];
    var agreedOptions = {
        agreedName: (_b = (_a = memberContract.values) === null || _a === void 0 ? void 0 : _a.invoice) === null || _b === void 0 ? void 0 : _b.name,
        agreedPhone: (_d = (_c = memberContract.values) === null || _c === void 0 ? void 0 : _c.invoice) === null || _d === void 0 ? void 0 : _d.phone,
    };
    useEffect(function () {
        Axios.get('https://api.ipify.org/').then(function (res) { return setAgreedIpAddress(res.data); });
    }, []);
    var handleCheck = function (e) {
        if (e.target.checked && window.confirm('同意後無法修改')) {
            agreeMemberContract({
                variables: {
                    memberContractId: memberContractId,
                    agreedAt: new Date(),
                    agreedIp: agreedIp,
                    agreedOptions: agreedOptions,
                },
            }).then(function () { return refetchMemberContract(); });
        }
    };
    return (React.createElement(DefaultLayout, null,
        React.createElement(StyledSection, { className: "container" },
            React.createElement(StyledTitle, { level: 1 }, '線上課程服務約款'),
            React.createElement(StyledCard, null,
                React.createElement("div", { dangerouslySetInnerHTML: { __html: render(memberContract.contract.template, memberContract.values) } })),
            React.createElement(StyledCard, null,
                React.createElement("div", { className: "text-center" }, memberContract.revokedAt ? (React.createElement("p", null,
                    "\u5DF2\u65BC ",
                    moment(memberContract.revokedAt).format('YYYY-MM-DD HH:mm:ss'),
                    " \u89E3\u9664\u6B64\u5951\u7D04")) : memberContract.agreedAt ? (React.createElement("p", null,
                    "\u5DF2\u65BC ",
                    moment(memberContract.agreedAt).format('YYYY-MM-DD HH:mm:ss'),
                    " \u540C\u610F\u6B64\u5951\u7D04")) : memberContract.startedAt && moment() >= moment(memberContract.startedAt) ? (React.createElement("p", null, "\u6B64\u5408\u7D04\u5DF2\u5931\u6548")) : (React.createElement(Checkbox, { checked: !!memberContract.agreedAt, onChange: handleCheck }, "\u6211\u5DF2\u8A73\u7D30\u95B1\u8B80\u4E26\u540C\u610F\u4E0A\u8FF0\u5951\u7D04\u4E26\u9858\u610F\u9075\u5B88\u898F\u5B9A")))))));
};
var AGREE_MEMBER_CONTRACT = gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  mutation AGREE_MEMBER_CONTRACT(\n    $memberContractId: uuid!\n    $agreedAt: timestamptz!\n    $agreedIp: String!\n    $agreedOptions: jsonb\n  ) {\n    update_member_contract(\n      where: { id: { _eq: $memberContractId } }\n      _set: { agreed_at: $agreedAt, agreed_ip: $agreedIp, agreed_options: $agreedOptions }\n    ) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation AGREE_MEMBER_CONTRACT(\n    $memberContractId: uuid!\n    $agreedAt: timestamptz!\n    $agreedIp: String!\n    $agreedOptions: jsonb\n  ) {\n    update_member_contract(\n      where: { id: { _eq: $memberContractId } }\n      _set: { agreed_at: $agreedAt, agreed_ip: $agreedIp, agreed_options: $agreedOptions }\n    ) {\n      affected_rows\n    }\n  }\n"])));
export default ContractPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=ContractPage.js.map
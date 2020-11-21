var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { useIntl } from 'react-intl';
import { issueMessages } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
import IssueReplyCreationBlock from './IssueReplyCreationBlock';
import IssueReplyItem from './IssueReplyItem';
var IssueReplyCollectionBlock = function (_a) {
    var programRoles = _a.programRoles, issueId = _a.issueId;
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var _b = useQuery(GET_ISSUE_REPLIES, { variables: { issueId: issueId } }), loading = _b.loading, data = _b.data, error = _b.error, refetch = _b.refetch;
    return (React.createElement(React.Fragment, null,
        loading
            ? formatMessage(issueMessages.status.loadingReply)
            : error || !data
                ? formatMessage(issueMessages.status.loadingReplyError)
                : data.issue_reply.map(function (value) { return (React.createElement("div", { key: value.id, className: "mt-5" },
                    React.createElement(IssueReplyItem, { programRoles: programRoles, issueReplyId: value.id, memberId: value.member_id, content: value.content, createdAt: new Date(value.created_at), reactedMemberIds: value.issue_reply_reactions.map(function (value) { return value.public_member.id; }), onRefetch: function () { return refetch(); } }))); }),
        currentMemberId && (React.createElement("div", { className: "mt-5" },
            React.createElement(IssueReplyCreationBlock, { memberId: currentMemberId, issueId: issueId, onRefetch: function () { return refetch(); } })))));
};
var GET_ISSUE_REPLIES = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_ISSUE_REPLIES($issueId: uuid!) {\n    issue_reply(where: { issue_id: { _eq: $issueId } }, order_by: [{ created_at: asc }]) {\n      id\n      content\n      created_at\n      member_id\n      issue_reply_reactions {\n        public_member {\n          id\n          name\n        }\n      }\n    }\n  }\n"], ["\n  query GET_ISSUE_REPLIES($issueId: uuid!) {\n    issue_reply(where: { issue_id: { _eq: $issueId } }, order_by: [{ created_at: asc }]) {\n      id\n      content\n      created_at\n      member_id\n      issue_reply_reactions {\n        public_member {\n          id\n          name\n        }\n      }\n    }\n  }\n"])));
export default IssueReplyCollectionBlock;
var templateObject_1;
//# sourceMappingURL=IssueReplyCollectionBlock.js.map
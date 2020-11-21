var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Divider, Spin } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { useIntl } from 'react-intl';
import { StringParam, useQueryParam } from 'use-query-params';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
import IssueCreationModal from './IssueCreationModal';
import IssueItem from './IssueItem';
var IssueThreadBlock = function (_a) {
    var threadId = _a.threadId, programRoles = _a.programRoles;
    var appId = useApp().id;
    var qIssueId = useQueryParam('issueId', StringParam)[0];
    var qIssueReplyId = useQueryParam('issueReplyId', StringParam)[0];
    var currentMemberId = useAuth().currentMemberId;
    var _b = useQuery(GET_ISSUE_THREAD, {
        variables: {
            appId: appId,
            threadId: threadId,
        },
    }), data = _b.data, loading = _b.loading, error = _b.error, refetch = _b.refetch;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement("div", null,
        currentMemberId && (React.createElement(IssueCreationModal, { onSubmit: function () {
                refetch();
            }, memberId: currentMemberId, threadId: threadId })),
        loading ? (React.createElement(Spin, null)) : error || !data ? (formatMessage(commonMessages.status.loadingQuestionError)) : (data.issue.map(function (value) {
            return (React.createElement("div", { key: value.id },
                React.createElement(IssueItem, { programRoles: programRoles, issueId: value.id, title: value.title, description: value.description, reactedMemberIds: value.issue_reactions.map(function (value) { return value.member_id; }), numReplies: value.issue_replies_aggregate.aggregate.count, createdAt: new Date(value.created_at), memberId: value.member_id, solvedAt: value.solved_at && new Date(value.solved_at), onRefetch: function () { return refetch(); }, defaultRepliesVisible: (qIssueReplyId && qIssueId === value.id) || false }),
                React.createElement(Divider, null)));
        }))));
};
var GET_ISSUE_THREAD = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_ISSUE_THREAD($appId: String!, $threadId: String!) {\n    issue(\n      where: { app_id: { _eq: $appId }, thread_id: { _eq: $threadId } }\n      order_by: [\n        { created_at: desc }\n        # { issue_reactions_aggregate: { count: desc } }\n      ]\n    ) {\n      id\n      title\n      description\n      solved_at\n      created_at\n      member_id\n      issue_reactions {\n        member_id\n      }\n      issue_replies_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"], ["\n  query GET_ISSUE_THREAD($appId: String!, $threadId: String!) {\n    issue(\n      where: { app_id: { _eq: $appId }, thread_id: { _eq: $threadId } }\n      order_by: [\n        { created_at: desc }\n        # { issue_reactions_aggregate: { count: desc } }\n      ]\n    ) {\n      id\n      title\n      description\n      solved_at\n      created_at\n      member_id\n      issue_reactions {\n        member_id\n      }\n      issue_replies_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"])));
export default IssueThreadBlock;
var templateObject_1;
//# sourceMappingURL=IssueThreadBlock.js.map
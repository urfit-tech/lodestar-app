var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Checkbox, Select, Skeleton, Typography } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { useAuth } from '../../components/auth/AuthContext';
import IssueAdminCard from '../../components/issue/IssueAdminCard';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import { EnrolledProgramSelector } from '../../components/program/ProgramSelector';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages, productMessages } from '../../helpers/translation';
import BookIcon from '../../images/book.svg';
var ProgramIssueCollectionAdminPage = function () {
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var _a = useState('all'), selectedProgramId = _a[0], setSelectedProgramId = _a[1];
    var _b = useState('unsolved'), selectedStatus = _b[0], setSelectedStatus = _b[1];
    var _c = useState(false), allowOthersIssue = _c[0], setAllowOthersIssue = _c[1];
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: BookIcon, className: "mr-3" }),
            React.createElement("span", null, formatMessage(productMessages.program.content.programProblem))),
        React.createElement("div", { className: "row no-gutters mb-4" },
            React.createElement("div", { className: "col-12 col-sm-2 pr-sm-3" },
                React.createElement(Select, { style: { width: '100%' }, value: selectedStatus, onChange: function (key) { return setSelectedStatus(key); } },
                    React.createElement(Select.Option, { key: "unsolved" }, formatMessage(commonMessages.form.option.unsolved)),
                    React.createElement(Select.Option, { key: "solved" }, formatMessage(commonMessages.form.option.solved)),
                    React.createElement(Select.Option, { key: "all" }, formatMessage(commonMessages.form.option.all)))),
            React.createElement("div", { className: "col-12 col-sm-8 pr-sm-3" }, currentMemberId && (React.createElement(EnrolledProgramSelector, { value: selectedProgramId, memberId: currentMemberId, onChange: function (key) { return setSelectedProgramId(key); } }))),
            React.createElement("div", { className: "col-12 col-sm-2 d-flex align-items-center" },
                React.createElement(Checkbox, { onChange: function (e) { return setAllowOthersIssue(e.target.checked); } }, formatMessage(commonMessages.checkbox.viewAllQuestion)))),
        currentMemberId && (React.createElement(AllProgramIssueCollectionBlock, { memberId: currentMemberId, selectedProgramId: selectedProgramId, selectedStatus: selectedStatus, allowOthersIssue: allowOthersIssue }))));
};
var AllProgramIssueCollectionBlock = function (_a) {
    var memberId = _a.memberId, selectedProgramId = _a.selectedProgramId, selectedStatus = _a.selectedStatus, allowOthersIssue = _a.allowOthersIssue;
    var appId = useApp().id;
    var formatMessage = useIntl().formatMessage;
    var unsolved;
    switch (selectedStatus) {
        case 'unsolved':
            unsolved = true;
            break;
        case 'solved':
            unsolved = false;
            break;
        default:
            unsolved = undefined;
            break;
    }
    var _b = useQuery(GET_MEMBER_PROGRAM_ISSUES, {
        variables: {
            memberId: memberId,
            appId: appId,
            threadIdLike: selectedProgramId === 'all' ? undefined : "/programs/" + selectedProgramId + "/contents/%",
            unsolved: unsolved,
        },
        fetchPolicy: 'no-cache',
    }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    return (React.createElement("div", null, loading || !data ? (React.createElement(Skeleton, { active: true })) : error ? (formatMessage(commonMessages.status.programError)) : !data.issue || data.issue.length === 0 ? (formatMessage(commonMessages.status.noProgramError)) : (data.issue
        .filter(function (value) { return (allowOthersIssue ? true : value.member_id === memberId); })
        .map(function (value) {
        var _a;
        var _b = value.thread_id.split('/'), programId = _b[2];
        return (React.createElement(IssueAdminCard, { key: value.id, threadId: value.thread_id, programId: programId, issueId: value.id, title: value.title, description: value.description, reactedMemberIds: value.issue_reactions.map(function (value) { return value.member_id; }), numReplies: ((_a = value.issue_replies_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 0, createdAt: new Date(value.created_at), memberId: value.member_id, solvedAt: value.solved_at && new Date(value.solved_at), onRefetch: refetch }));
    })
        .flat())));
};
var GET_MEMBER_PROGRAM_ISSUES = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_MEMBER_PROGRAM_ISSUES($appId: String!, $threadIdLike: String, $unsolved: Boolean, $memberId: String) {\n    issue(\n      where: {\n        app_id: { _eq: $appId }\n        thread_id: { _like: $threadIdLike }\n        solved_at: { _is_null: $unsolved }\n        issue_enrollment: { program: { program_enrollments: { member_id: { _eq: $memberId } } } }\n      }\n      order_by: [\n        { created_at: desc }\n        # { issue_reactions_aggregate: { count: desc } }\n      ]\n    ) {\n      id\n      title\n      thread_id\n      description\n      solved_at\n      created_at\n      member_id\n      issue_reactions {\n        member_id\n      }\n      issue_replies_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"], ["\n  query GET_MEMBER_PROGRAM_ISSUES($appId: String!, $threadIdLike: String, $unsolved: Boolean, $memberId: String) {\n    issue(\n      where: {\n        app_id: { _eq: $appId }\n        thread_id: { _like: $threadIdLike }\n        solved_at: { _is_null: $unsolved }\n        issue_enrollment: { program: { program_enrollments: { member_id: { _eq: $memberId } } } }\n      }\n      order_by: [\n        { created_at: desc }\n        # { issue_reactions_aggregate: { count: desc } }\n      ]\n    ) {\n      id\n      title\n      thread_id\n      description\n      solved_at\n      created_at\n      member_id\n      issue_reactions {\n        member_id\n      }\n      issue_replies_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"])));
export default ProgramIssueCollectionAdminPage;
var templateObject_1;
//# sourceMappingURL=ProgramIssueCollectionAdminPage.js.map
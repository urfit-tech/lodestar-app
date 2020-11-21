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
import { useMutation } from '@apollo/react-hooks';
import { Button, Checkbox, Modal } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { commonMessages, issueMessages } from '../../helpers/translation';
import { useProgram } from '../../hooks/program';
import { useAuth } from '../auth/AuthContext';
import AdminCard from '../common/AdminCard';
import IssueItem from './IssueItem';
var StyledAdminCard = styled(AdminCard)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n\n  .mask {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    cursor: pointer;\n    content: '';\n    z-index: 998;\n  }\n"], ["\n  position: relative;\n\n  .mask {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    cursor: pointer;\n    content: '';\n    z-index: 998;\n  }\n"])));
var StyledCheckbox = styled(Checkbox)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  right: 24px;\n  bottom: 24px;\n  z-index: 999;\n"], ["\n  position: absolute;\n  right: 24px;\n  bottom: 24px;\n  z-index: 999;\n"])));
var IssueAdminCard = function (_a) {
    var threadId = _a.threadId, programId = _a.programId, issueId = _a.issueId, title = _a.title, description = _a.description, reactedMemberIds = _a.reactedMemberIds, numReplies = _a.numReplies, createdAt = _a.createdAt, memberId = _a.memberId, solvedAt = _a.solvedAt, onRefetch = _a.onRefetch, cardProps = __rest(_a, ["threadId", "programId", "issueId", "title", "description", "reactedMemberIds", "numReplies", "createdAt", "memberId", "solvedAt", "onRefetch"]);
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var program = useProgram(programId).program;
    var updateIssueStatus = useMutation(UPDATE_ISSUE_STATUS)[0];
    var _b = useState(!!solvedAt), solved = _b[0], setSolved = _b[1];
    var _c = useState(false), modalVisible = _c[0], setModalVisible = _c[1];
    var programTitle = program ? program.title || formatMessage(issueMessages.title.program) : '';
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledAdminCard, __assign({ className: "mb-3" }, cardProps),
            React.createElement(IssueItem, { programRoles: (program === null || program === void 0 ? void 0 : program.roles) || [], issueId: issueId, title: title, description: description, reactedMemberIds: reactedMemberIds, numReplies: numReplies, createdAt: createdAt, memberId: memberId, solvedAt: solvedAt, onRefetch: onRefetch, showSolvedCheckbox: true }),
            React.createElement("div", { className: "mask", onClick: function () { return setModalVisible(true); } }),
            currentMemberId === memberId ||
                ((program === null || program === void 0 ? void 0 : program.roles.some(function (role) { return role.memberId === currentMemberId && (role.name === 'instructor' || role.name === 'assistant'); })) && (React.createElement(StyledCheckbox, { checked: solved, onChange: function (e) {
                        var updatedSolved = e.target.checked;
                        updateIssueStatus({
                            variables: {
                                issueId: issueId,
                                solvedAt: updatedSolved ? new Date() : null,
                            },
                        }).then(function () {
                            setSolved(updatedSolved);
                            onRefetch && onRefetch();
                        });
                    } }, solvedAt ? formatMessage(commonMessages.status.unsolved) : formatMessage(commonMessages.status.solving))))),
        React.createElement(Modal, { footer: null, visible: modalVisible, onCancel: function () { return setModalVisible(false); }, title: React.createElement("div", null,
                React.createElement("span", null, programTitle),
                React.createElement(Button, { type: "link", onClick: function () { return window.open(threadId); } }, formatMessage(commonMessages.button.viewCourse))) },
            React.createElement(IssueItem, { programRoles: (program === null || program === void 0 ? void 0 : program.roles) || [], issueId: issueId, title: title, description: description, reactedMemberIds: reactedMemberIds, numReplies: numReplies, createdAt: createdAt, memberId: memberId, solvedAt: solvedAt, onRefetch: onRefetch, defaultRepliesVisible: true }))));
};
var UPDATE_ISSUE_STATUS = gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  mutation UPDATE_ISSUE_STATUS($issueId: uuid!, $solvedAt: timestamptz) {\n    update_issue(where: { id: { _eq: $issueId } }, _set: { solved_at: $solvedAt }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation UPDATE_ISSUE_STATUS($issueId: uuid!, $solvedAt: timestamptz) {\n    update_issue(where: { id: { _eq: $issueId } }, _set: { solved_at: $solvedAt }) {\n      affected_rows\n    }\n  }\n"])));
export default IssueAdminCard;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=IssueAdminCard.js.map
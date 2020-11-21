var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useMutation } from '@apollo/react-hooks';
import { Button, Dropdown, Icon, Menu, message, Tag } from 'antd';
import BraftEditor from 'braft-editor';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useApp } from '../../containers/common/AppContext';
import { createUploadFn, rgba } from '../../helpers';
import { commonMessages, issueMessages } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
import MemberAvatar from '../common/MemberAvatar';
import ProgramRoleFormatter from '../common/ProgramRoleFormatter';
import { BraftContent } from '../common/StyledBraftEditor';
import { StyledEditor } from './IssueReplyCreationBlock';
var IssueReplyContentBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1rem;\n  background: #f7f8f8;\n  border-radius: 0.5rem;\n  transition: background-color 1s ease-in-out;\n"], ["\n  padding: 1rem;\n  background: #f7f8f8;\n  border-radius: 0.5rem;\n  transition: background-color 1s ease-in-out;\n"])));
var StyledIssueReplyItem = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  transition: background-color 1s ease-in-out;\n\n  &.focus {\n    background: ", ";\n  }\n  &.focus ", " {\n    background: none;\n  }\n"], ["\n  transition: background-color 1s ease-in-out;\n\n  &.focus {\n    background: ", ";\n  }\n  &.focus ", " {\n    background: none;\n  }\n"])), function (props) { return rgba(props.theme['@primary-color'], 0.1); }, IssueReplyContentBlock);
var StyledAction = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 0;\n  color: ", ";\n  cursor: pointer;\n"], ["\n  padding: 0;\n  color: ", ";\n  cursor: pointer;\n"])), function (props) { return (props.reacted ? props.theme['@primary-color'] : props.theme['@text-color-secondary']); });
var StyledTag = styled(Tag)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  border: 0;\n"], ["\n  border: 0;\n"])));
var IssueReplyItem = function (_a) {
    var programRoles = _a.programRoles, issueReplyId = _a.issueReplyId, content = _a.content, reactedMemberIds = _a.reactedMemberIds, createdAt = _a.createdAt, memberId = _a.memberId, onRefetch = _a.onRefetch;
    var formatMessage = useIntl().formatMessage;
    var qIssueReplyId = useQueryParam('issueReplyId', StringParam)[0];
    var theme = useContext(ThemeContext);
    var _b = useAuth(), currentMemberId = _b.currentMemberId, authToken = _b.authToken, backendEndpoint = _b.backendEndpoint;
    var appId = useApp().id;
    var insertIssueReplyReaction = useMutation(INSERT_ISSUE_REPLY_REACTION)[0];
    var deleteIssueReplyReaction = useMutation(DELETE_ISSUE_REPLY_REACTION)[0];
    var deleteIssueReply = useMutation(DELETE_ISSUE_REPLY)[0];
    var updateIssueReply = useMutation(UPDATE_ISSUE_REPLY)[0];
    var _c = useState(false), editing = _c[0], setEditing = _c[1];
    var _d = useState(qIssueReplyId === issueReplyId), focus = _d[0], setFocus = _d[1];
    var _e = useState(BraftEditor.createEditorState(content)), contentState = _e[0], setContentState = _e[1];
    var _f = useState(false), reacted = _f[0], setReacted = _f[1];
    var otherReactedMemberIds = reactedMemberIds.filter(function (id) { return id !== currentMemberId; }).length;
    useEffect(function () {
        if (currentMemberId && reactedMemberIds.includes(currentMemberId)) {
            setReacted(true);
        }
    }, [currentMemberId, reactedMemberIds]);
    var toggleReaction = function (reacted) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!reacted) return [3 /*break*/, 2];
                    return [4 /*yield*/, deleteIssueReplyReaction({
                            variables: { issueReplyId: issueReplyId, memberId: currentMemberId || '' },
                        })];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, insertIssueReplyReaction({
                        variables: { issueReplyId: issueReplyId, memberId: currentMemberId || '' },
                    })];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    _a;
                    onRefetch && onRefetch();
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(StyledIssueReplyItem, { className: focus ? 'focus' : '', ref: function (ref) {
            if (ref && focus) {
                ref.scrollIntoView();
                setTimeout(function () {
                    setFocus(false);
                }, 1000);
            }
        } },
        React.createElement("div", { className: "d-flex align-items-center justify-content-between mb-2" },
            React.createElement("div", { className: "d-flex align-items-center" },
                React.createElement(MemberAvatar, { memberId: memberId, renderText: function () {
                        return programRoles &&
                            programRoles
                                .filter(function (role) { return role.memberId === memberId; })
                                .map(function (role) {
                                return role.name === 'instructor' ? (React.createElement(StyledTag, { key: role.id, color: theme['@primary-color'], className: "ml-2 mr-0" },
                                    React.createElement(ProgramRoleFormatter, { value: role.name }))) : role.name === 'assistant' ? (React.createElement(StyledTag, { key: role.id, color: theme['@processing-color'], className: "ml-2 mr-0" },
                                    React.createElement(ProgramRoleFormatter, { value: role.name }))) : null;
                            });
                    }, withName: true }),
                React.createElement("span", { className: "ml-2", style: { fontSize: '12px', color: '#9b9b9b' } }, moment(createdAt).fromNow())),
            memberId === currentMemberId && !editing && (React.createElement(Dropdown, { placement: "bottomRight", overlay: React.createElement(Menu, null,
                    React.createElement(Menu.Item, { onClick: function () { return setEditing(true); } }, formatMessage(issueMessages.dropdown.content.edit)),
                    React.createElement(Menu.Item, { onClick: function () {
                            return window.confirm(formatMessage(issueMessages.dropdown.content.unrecoverable)) &&
                                deleteIssueReply({ variables: { issueReplyId: issueReplyId } }).then(function () { return onRefetch && onRefetch(); });
                        } }, formatMessage(issueMessages.dropdown.content.delete))), trigger: ['click'] },
                React.createElement(Icon, { type: "more" })))),
        React.createElement(IssueReplyContentBlock, null,
            React.createElement("div", { className: "mb-3" }, editing ? (React.createElement(React.Fragment, null,
                React.createElement(StyledEditor, { value: contentState, onChange: function (value) { return setContentState(value); }, controls: ['bold', 'italic', 'underline', 'separator', 'media'], media: { uploadFn: createUploadFn(appId, authToken, backendEndpoint) } }),
                React.createElement("div", null,
                    React.createElement(Button, { className: "mr-2", onClick: function () { return setEditing(false); } }, formatMessage(commonMessages.button.cancel)),
                    React.createElement(Button, { type: "primary", onClick: function () {
                            return updateIssueReply({
                                variables: { issueReplyId: issueReplyId, content: contentState.toRAW() },
                            })
                                .then(function () {
                                onRefetch && onRefetch();
                                setEditing(false);
                            })
                                .catch(function (err) { return message.error(formatMessage(issueMessages.messageError.update)); });
                        } }, formatMessage(commonMessages.button.save))))) : (React.createElement(BraftContent, null, content))),
            React.createElement("div", null,
                React.createElement(StyledAction, { onClick: function () {
                        setReacted(!reacted);
                        toggleReaction(reacted);
                    }, reacted: reacted },
                    React.createElement(Icon, { className: "mr-1", type: "heart", theme: reacted ? 'filled' : 'outlined' }),
                    React.createElement("span", null, reacted ? otherReactedMemberIds + 1 : otherReactedMemberIds))))));
};
var INSERT_ISSUE_REPLY_REACTION = gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  mutation INSERT_ISSUE_REPLY_REACTION($memberId: String!, $issueReplyId: uuid!) {\n    insert_issue_reply_reaction(objects: { member_id: $memberId, issue_reply_id: $issueReplyId }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation INSERT_ISSUE_REPLY_REACTION($memberId: String!, $issueReplyId: uuid!) {\n    insert_issue_reply_reaction(objects: { member_id: $memberId, issue_reply_id: $issueReplyId }) {\n      affected_rows\n    }\n  }\n"])));
var DELETE_ISSUE_REPLY_REACTION = gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  mutation DELETE_ISSUE_REPLY_REACTION($memberId: String!, $issueReplyId: uuid!) {\n    delete_issue_reply_reaction(where: { member_id: { _eq: $memberId }, issue_reply_id: { _eq: $issueReplyId } }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation DELETE_ISSUE_REPLY_REACTION($memberId: String!, $issueReplyId: uuid!) {\n    delete_issue_reply_reaction(where: { member_id: { _eq: $memberId }, issue_reply_id: { _eq: $issueReplyId } }) {\n      affected_rows\n    }\n  }\n"])));
var DELETE_ISSUE_REPLY = gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  mutation DELETE_ISSUE_REPLY($issueReplyId: uuid!) {\n    delete_issue_reply(where: { id: { _eq: $issueReplyId } }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation DELETE_ISSUE_REPLY($issueReplyId: uuid!) {\n    delete_issue_reply(where: { id: { _eq: $issueReplyId } }) {\n      affected_rows\n    }\n  }\n"])));
var UPDATE_ISSUE_REPLY = gql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  mutation UPDATE_ISSUE_REPLY($issueReplyId: uuid!, $content: String) {\n    update_issue_reply(where: { id: { _eq: $issueReplyId } }, _set: { content: $content }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation UPDATE_ISSUE_REPLY($issueReplyId: uuid!, $content: String) {\n    update_issue_reply(where: { id: { _eq: $issueReplyId } }, _set: { content: $content }) {\n      affected_rows\n    }\n  }\n"])));
export default IssueReplyItem;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=IssueReplyItem.js.map
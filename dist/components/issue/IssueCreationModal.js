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
import { Button, Form, Icon, Input, message, Modal, Typography } from 'antd';
import BraftEditor from 'braft-editor';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { createUploadFn } from '../../helpers';
import { commonMessages, issueMessages } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
import MemberAvatar from '../common/MemberAvatar';
import StyledBraftEditor from '../common/StyledBraftEditor';
var StyledButton = styled(Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: initial;\n  font-size: 14px;\n"], ["\n  height: initial;\n  font-size: 14px;\n"])));
var IssueCreationModal = function (_a) {
    var threadId = _a.threadId, form = _a.form, memberId = _a.memberId, onSubmit = _a.onSubmit, modalProps = __rest(_a, ["threadId", "form", "memberId", "onSubmit"]);
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), authToken = _b.authToken, backendEndpoint = _b.backendEndpoint;
    var appId = useApp().id;
    var insertIssue = useMutation(INSERT_ISSUE)[0];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), modalVisible = _d[0], setModalVisible = _d[1];
    var handleSubmit = function () {
        form.validateFields(function (error, values) {
            if (!error) {
                insertIssue({
                    variables: {
                        appId: appId,
                        memberId: memberId,
                        threadId: threadId,
                        title: values.title,
                        description: values.description.toRAW(),
                    },
                })
                    .then(function () {
                    form.resetFields();
                    onSubmit && onSubmit();
                    setModalVisible(false);
                })
                    .catch(function (err) { return message.error(err.message); })
                    .finally(function () { return setLoading(false); });
            }
        });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal, __assign({ okText: formatMessage(issueMessages.modal.text.ok), style: { top: 12 }, onOk: handleSubmit, confirmLoading: loading, visible: modalVisible, onCancel: function () { return setModalVisible(false); } }, modalProps),
            React.createElement(Typography.Title, { level: 4 }, formatMessage(issueMessages.form.title.fillQuestion)),
            React.createElement(Form, null,
                React.createElement(Form.Item, { label: formatMessage(issueMessages.form.label.title) }, form.getFieldDecorator('title', {
                    initialValue: '',
                    rules: [
                        {
                            required: true,
                            message: formatMessage(issueMessages.form.message.title),
                        },
                    ],
                })(React.createElement(Input, null))),
                React.createElement(Form.Item, { label: formatMessage(issueMessages.form.label.question) }, form.getFieldDecorator('description', {
                    initialValue: BraftEditor.createEditorState(null),
                    rules: [
                        {
                            validator: function (rule, value, callback) {
                                value.isEmpty() ? callback(formatMessage(issueMessages.form.validator.enterQuestion)) : callback();
                            },
                        },
                    ],
                })(React.createElement(StyledBraftEditor, { language: "zh-hant", controls: [
                        'bold',
                        'italic',
                        'underline',
                        {
                            key: 'remove-styles',
                            title: formatMessage(commonMessages.editor.title.clearStyles),
                        },
                        'separator',
                        'media',
                    ], contentClassName: "short-bf-content", media: { uploadFn: createUploadFn(appId, authToken, backendEndpoint) } }))))),
        React.createElement(StyledButton, { block: true, className: "d-flex justify-content-between align-items-center mb-5 p-4", onClick: function () { return setModalVisible(true); } },
            React.createElement("span", { className: "d-flex align-items-center" },
                React.createElement("span", { className: "mr-2" }, memberId && React.createElement(MemberAvatar, { memberId: memberId })),
                React.createElement("span", { className: "ml-1" }, formatMessage(commonMessages.button.leaveQuestion))),
            React.createElement(Icon, { type: "edit" }))));
};
var INSERT_ISSUE = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  mutation INSERT_ISSUE($appId: String!, $memberId: String!, $threadId: String!, $title: String, $description: String) {\n    insert_issue(\n      objects: { app_id: $appId, member_id: $memberId, thread_id: $threadId, title: $title, description: $description }\n    ) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation INSERT_ISSUE($appId: String!, $memberId: String!, $threadId: String!, $title: String, $description: String) {\n    insert_issue(\n      objects: { app_id: $appId, member_id: $memberId, thread_id: $threadId, title: $title, description: $description }\n    ) {\n      affected_rows\n    }\n  }\n"])));
export default Form.create()(IssueCreationModal);
var templateObject_1, templateObject_2;
//# sourceMappingURL=IssueCreationModal.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useMutation } from '@apollo/react-hooks';
import { Button, Form, message } from 'antd';
import BraftEditor from 'braft-editor';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { commonMessages, issueMessages } from '../../helpers/translation';
import MemberAvatar from '../common/MemberAvatar';
export var StyledEditor = styled(BraftEditor)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .bf-content {\n    height: initial;\n  }\n"], ["\n  .bf-content {\n    height: initial;\n  }\n"])));
var IssueReplyCreationBlock = function (_a) {
    var memberId = _a.memberId, issueId = _a.issueId, form = _a.form, onRefetch = _a.onRefetch;
    var insertIssueReply = useMutation(INSERT_ISSUE_REPLY)[0];
    var formatMessage = useIntl().formatMessage;
    var _b = useState(false), replying = _b[0], setReplying = _b[1];
    var handleSubmit = function () {
        form.validateFields(function (error, values) {
            if (!error) {
                setReplying(true);
                insertIssueReply({
                    variables: {
                        memberId: memberId,
                        issueId: issueId,
                        content: values.content.toRAW(),
                    },
                })
                    .then(function () {
                    form.resetFields();
                    onRefetch && onRefetch();
                })
                    .catch(function (err) { return message.error(err.message); })
                    .finally(function () { return setReplying(false); });
            }
        });
    };
    return (React.createElement(Form, { onSubmit: function (e) {
            e.preventDefault();
            handleSubmit();
        } },
        React.createElement("div", { className: "d-flex align-items-center mb-3" },
            React.createElement(MemberAvatar, { memberId: memberId, withName: true })),
        React.createElement(Form.Item, { className: "mb-1" }, form.getFieldDecorator('content', {
            initialValue: BraftEditor.createEditorState(null),
            rules: [
                {
                    required: true,
                    message: formatMessage(issueMessages.message.enterReplyContent),
                },
            ],
        })(React.createElement(StyledEditor, { style: { border: '1px solid #cdcdcd', borderRadius: '4px' }, language: "zh-hant", placeholder: formatMessage(issueMessages.form.placeholder.reply), controls: ['bold', 'italic', 'underline', 'separator', 'media'] }))),
        React.createElement(Form.Item, { style: { textAlign: 'right' } },
            React.createElement(Button, { type: "primary", htmlType: "submit", loading: replying }, formatMessage(commonMessages.button.reply)))));
};
var INSERT_ISSUE_REPLY = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  mutation INSERT_ISSUE_REPLY($memberId: String!, $issueId: uuid!, $content: String) {\n    insert_issue_reply(objects: { member_id: $memberId, issue_id: $issueId, content: $content }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation INSERT_ISSUE_REPLY($memberId: String!, $issueId: uuid!, $content: String) {\n    insert_issue_reply(objects: { member_id: $memberId, issue_id: $issueId, content: $content }) {\n      affected_rows\n    }\n  }\n"])));
export default Form.create()(IssueReplyCreationBlock);
var templateObject_1, templateObject_2;
//# sourceMappingURL=IssueReplyCreationBlock.js.map
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
import { Button, Form, Input, message, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages, profileMessages } from '../../helpers/translation';
import { useMember, useUpdateMember } from '../../hooks/member';
import AdminCard from '../common/AdminCard';
import { AvatarImage } from '../common/Image';
import SingleUploader from '../common/SingleUploader';
import { StyledForm } from '../layout';
var StyledFormItem = styled(Form.Item)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ant-form-item-children {\n    display: flex;\n    align-items: center;\n  }\n\n  .ant-upload.ant-upload-select-picture-card {\n    border: none;\n    background: none;\n  }\n"], ["\n  .ant-form-item-children {\n    display: flex;\n    align-items: center;\n  }\n\n  .ant-upload.ant-upload-select-picture-card {\n    border: none;\n    background: none;\n  }\n"])));
var ProfileBasicAdminCard = function (_a) {
    var form = _a.form, memberId = _a.memberId, cardProps = __rest(_a, ["form", "memberId"]);
    var appId = useApp().id;
    var member = useMember(memberId).member;
    var updateMember = useUpdateMember();
    var formatMessage = useIntl().formatMessage;
    var handleSubmit = function () {
        form.validateFields(function (error, values) {
            if (!error && member) {
                updateMember({
                    variables: {
                        memberId: memberId,
                        email: member.email.trim().toLowerCase(),
                        username: member.username,
                        name: values.name,
                        pictureUrl: values.picture
                            ? "https://" + process.env.REACT_APP_S3_BUCKET + "/avatars/" + appId + "/" + memberId
                            : member.pictureUrl,
                        description: values.description,
                    },
                })
                    .then(function () {
                    message.success(formatMessage(commonMessages.event.successfullySaved));
                    window.location.reload(true);
                })
                    .catch(function (err) { return message.error(err.message); });
            }
        });
    };
    return (React.createElement(AdminCard, __assign({}, cardProps),
        React.createElement(Typography.Title, { className: "mb-4", level: 4 }, formatMessage(profileMessages.title.basicInfo)),
        React.createElement(StyledForm, { onSubmit: function (e) {
                e.preventDefault();
                handleSubmit();
            }, labelCol: { span: 24, md: { span: 4 } }, wrapperCol: { span: 24, md: { span: 8 } } },
            React.createElement(StyledFormItem, { label: formatMessage(profileMessages.form.label.avatar) },
                React.createElement("div", { className: "mr-3" },
                    React.createElement(AvatarImage, { src: (member && member.pictureUrl) || '', size: 128 })),
                form.getFieldDecorator('picture')(React.createElement(SingleUploader, { accept: "image/*", listType: "picture-card", showUploadList: false, path: "avatars/" + appId + "/" + memberId, onSuccess: handleSubmit, isPublic: true }))),
            React.createElement(Form.Item, { label: formatMessage(profileMessages.form.label.name) }, form.getFieldDecorator('name', {
                initialValue: member && member.name,
                rules: [
                    {
                        required: true,
                        message: formatMessage(profileMessages.form.message.enterName),
                    },
                ],
            })(React.createElement(Input, null))),
            React.createElement(Form.Item, { label: formatMessage(profileMessages.form.message.intro) }, form.getFieldDecorator('description', {
                initialValue: member && member.description,
            })(React.createElement(Input.TextArea, { rows: 5 }))),
            React.createElement(Form.Item, { wrapperCol: { md: { offset: 4 } } },
                React.createElement(Button, { className: "mr-2", onClick: function () { return form.resetFields(); } }, formatMessage(commonMessages.button.cancel)),
                React.createElement(Button, { type: "primary", htmlType: "submit" }, formatMessage(commonMessages.button.save))))));
};
export default Form.create()(ProfileBasicAdminCard);
var templateObject_1;
//# sourceMappingURL=ProfileBasicAdminCard.js.map
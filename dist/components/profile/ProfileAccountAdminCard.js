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
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages, profileMessages, settingsMessages } from '../../helpers/translation';
import { useMember, useUpdateMember } from '../../hooks/member';
import YouTubeIcon from '../../images/youtube-icon.svg';
import AdminCard from '../common/AdminCard';
import { StyledForm } from '../layout';
var StyledSocialLogo = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: var(--gray-lighter);\n  font-size: 24px;\n  text-align: center;\n  line-height: 44px;\n"], ["\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: var(--gray-lighter);\n  font-size: 24px;\n  text-align: center;\n  line-height: 44px;\n"])));
var StyledText = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  line-height: normal;\n"], ["\n  line-height: normal;\n"])));
var ProfileAccountAdminCard = function (_a) {
    var form = _a.form, memberId = _a.memberId, cardProps = __rest(_a, ["form", "memberId"]);
    var formatMessage = useIntl().formatMessage;
    var enabledModules = useApp().enabledModules;
    var member = useMember(memberId).member;
    var updateMember = useUpdateMember();
    var isYouTubeConnected = (member === null || member === void 0 ? void 0 : member.youtubeChannelIds) !== null;
    var handleSubmit = function () {
        form.validateFields(function (error, values) {
            if (error || !member) {
                return;
            }
            updateMember({
                variables: {
                    memberId: memberId,
                    email: values._email.trim().toLowerCase(),
                    username: values.username,
                    name: member.name,
                    pictureUrl: member.pictureUrl,
                    description: member.description,
                },
            })
                .then(function () { return message.success(formatMessage(commonMessages.event.successfullySaved)); })
                .catch(function (err) { return message.error(err.message); });
        });
    };
    return (React.createElement(AdminCard, __assign({}, cardProps),
        React.createElement(Typography.Title, { className: "mb-4", level: 4 }, formatMessage(settingsMessages.title.profile)),
        React.createElement(StyledForm, { onSubmit: function (e) {
                e.preventDefault();
                handleSubmit();
            }, labelCol: { span: 24, md: { span: 4 } }, wrapperCol: { span: 24, md: { span: 9 } } },
            React.createElement(Form.Item, { label: formatMessage(commonMessages.form.label.username) }, form.getFieldDecorator('username', {
                initialValue: member && member.username,
                rules: [
                    {
                        required: true,
                        message: formatMessage(commonMessages.form.message.username),
                    },
                ],
            })(React.createElement(Input, null))),
            React.createElement(Form.Item, { label: formatMessage(commonMessages.form.label.email) }, form.getFieldDecorator('_email', {
                initialValue: member && member.email,
                rules: [
                    {
                        required: true,
                        message: formatMessage(commonMessages.form.message.email),
                    },
                ],
            })(React.createElement(Input, null))),
            enabledModules.social_connect && (React.createElement(Form.Item, { label: formatMessage(profileMessages.form.label.socialConnect) },
                React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
                    React.createElement(StyledSocialLogo, { className: "flex-shrink-0 mr-3" },
                        React.createElement(Icon, { src: YouTubeIcon })),
                    React.createElement(StyledText, { className: "flex-grow-1 mr-3" }, isYouTubeConnected
                        ? formatMessage(profileMessages.form.message.socialConnected, { site: 'YouTube' })
                        : formatMessage(profileMessages.form.message.socialUnconnected, { site: 'YouTube' })),
                    !isYouTubeConnected && (React.createElement("a", { href: 'https://accounts.google.com/o/oauth2/v2/auth?client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&scope={{SCOPE}}&state={{STATE}}&response_type=token'
                            .replace('{{CLIENT_ID}}', "" + process.env.REACT_APP_GOOGLE_CLIENT_ID)
                            .replace('{{REDIRECT_URI}}', "https://" + window.location.hostname + "/oauth2")
                            .replace('{{SCOPE}}', 'https://www.googleapis.com/auth/youtubepartner-channel-audit')
                            .replace('{{STATE}}', JSON.stringify({
                            provider: 'google',
                            redirect: window.location.pathname,
                        })) },
                        React.createElement(Button, null, formatMessage(commonMessages.button.socialConnect))))))),
            React.createElement(Form.Item, { wrapperCol: { md: { offset: 4 } } },
                React.createElement(Button, { className: "mr-2", onClick: function () { return form.resetFields(); } }, formatMessage(commonMessages.button.cancel)),
                React.createElement(Button, { type: "primary", htmlType: "submit" }, formatMessage(commonMessages.button.save))))));
};
export default Form.create()(ProfileAccountAdminCard);
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProfileAccountAdminCard.js.map
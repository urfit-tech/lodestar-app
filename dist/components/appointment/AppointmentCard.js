var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Dropdown, Form, Icon as AntdIcon, Input, Menu, message, Modal } from 'antd';
import BraftEditor from 'braft-editor';
import moment from 'moment';
import React, { useState } from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import { dateRangeFormatter } from '../../helpers';
import { commonMessages } from '../../helpers/translation';
import { useCancelAppointment, useUpdateAppointmentIssue } from '../../hooks/appointment';
import DefaultAvatar from '../../images/avatar.svg';
import CalendarOIcon from '../../images/calendar-alt-o.svg';
import UserOIcon from '../../images/user-o.svg';
import { CustomRatioImage } from '../common/Image';
import { BREAK_POINT } from '../common/Responsive';
import StyledBraftEditor, { BraftContent } from '../common/StyledBraftEditor';
var messages = defineMessages({
    appointmentIssue: { id: 'appointment.button.appointmentIssue', defaultMessage: '提問單' },
    appointmentIssueDescription: {
        id: 'appointment.text.appointmentIssueDescription',
        defaultMessage: '建議以 1.  2. 方式點列問題，並適時換行讓老師更容易閱讀，若無問題則填寫「無」',
    },
    appointmentDate: { id: 'appointment.text.appointmentDate', defaultMessage: '諮詢日期' },
    createAppointmentIssue: { id: 'appointment.label.createAppointmentIssue', defaultMessage: '我要提問' },
    appointmentCanceledNotation: {
        id: 'appointment.text.appointmentCanceledNotation',
        defaultMessage: '已於 {time} 取消預約',
    },
    cancelAppointment: { id: 'appointment.ui.cancelAppointment', defaultMessage: '取消預約' },
    confirmCancelAlert: { id: 'appointment.label.confirmCancelAlert', defaultMessage: '確定要取消預約嗎？' },
    confirmCancelNotation: {
        id: 'appointment.text.confirmCancelNotation',
        defaultMessage: '取消預約後將會寄送通知給諮詢老師，並重新開放此時段，若需退費請主動聯繫平台。',
    },
    canceledReason: { id: 'appointment.label.canceledReason', defaultMessage: '取消原因' },
});
var StyledCard = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  padding: 24px;\n\n  @media (min-width: ", "px) {\n    display: flex;\n    justify-content: space-between;\n  }\n"], ["\n  background-color: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  padding: 24px;\n\n  @media (min-width: ", "px) {\n    display: flex;\n    justify-content: space-between;\n  }\n"])), BREAK_POINT);
var StyledInfo = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 32px;\n  ", "\n\n  @media (min-width: ", "px) {\n    margin-bottom: 0;\n  }\n"], ["\n  margin-bottom: 32px;\n  ", "\n\n  @media (min-width: ", "px) {\n    margin-bottom: 0;\n  }\n"])), function (props) { return (props.withMask ? 'opacity: 0.2;' : ''); }, BREAK_POINT);
var StyledTitle = styled.h3(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  margin-bottom: 0.75rem;\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  margin-bottom: 0.75rem;\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledMetaBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1;\n  letter-spacing: 0.4px;\n"])));
var StyledStatusBar = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  justify-content: flex-end;\n\n  @media (min-width: ", "px) {\n    justify-content: space-between;\n  }\n"], ["\n  justify-content: flex-end;\n\n  @media (min-width: ", "px) {\n    justify-content: space-between;\n  }\n"])), BREAK_POINT);
var StyledBadge = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: var(--gray);\n  font-size: 16px;\n  font-weight: 500;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray);\n  font-size: 16px;\n  font-weight: 500;\n  letter-spacing: 0.2px;\n"])));
var StyledCanceledText = styled.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n"])));
var StyledModal = styled(Modal)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  && .ant-modal-footer {\n    border-top: 0;\n    padding: 0 1.5rem 1.5rem;\n  }\n"], ["\n  && .ant-modal-footer {\n    border-top: 0;\n    padding: 0 1.5rem 1.5rem;\n  }\n"])));
var StyledModalTitle = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledModalSubTitle = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledModalMetaBlock = styled.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  padding: 0.75rem;\n  background-color: var(--gray-lighter);\n  border-radius: 4px;\n"], ["\n  padding: 0.75rem;\n  background-color: var(--gray-lighter);\n  border-radius: 4px;\n"])));
var AppointmentCard = function (_a) {
    var title = _a.title, startedAt = _a.startedAt, endedAt = _a.endedAt, canceledAt = _a.canceledAt, creator = _a.creator, member = _a.member, appointmentUrl = _a.appointmentUrl, appointmentIssue = _a.appointmentIssue, orderProduct = _a.orderProduct, onRefetch = _a.onRefetch, form = _a.form;
    var formatMessage = useIntl().formatMessage;
    var updateAppointmentIssue = useUpdateAppointmentIssue(orderProduct.id, orderProduct.options);
    var cancelAppointment = useCancelAppointment(orderProduct.id, orderProduct.options);
    var _b = useState(false), issueModalVisible = _b[0], setIssueModalVisible = _b[1];
    var _c = useState(false), cancelModalVisible = _c[0], setCancelModalVisible = _c[1];
    var _d = useState(''), canceledReason = _d[0], setCanceledReason = _d[1];
    var _e = useState(false), loading = _e[0], setLoading = _e[1];
    var isFinished = Date.now() > endedAt.getTime();
    var isCanceled = !!canceledAt;
    var handleSubmit = function () {
        form.validateFields(function (errors, values) {
            if (errors) {
                return;
            }
            setLoading(true);
            updateAppointmentIssue(values.appointmentIssue.toRAW())
                .then(function () {
                onRefetch && onRefetch();
                setIssueModalVisible(false);
                message.success(commonMessages.message.success);
            })
                .finally(function () { return setLoading(false); });
        });
    };
    var handleCancel = function () {
        setLoading(true);
        cancelAppointment(canceledReason)
            .then(function () {
            onRefetch && onRefetch();
            setCancelModalVisible(false);
        })
            .finally(function () { return setLoading(false); });
    };
    return (React.createElement(StyledCard, null,
        React.createElement(StyledInfo, { className: "d-flex align-items-start", withMask: isCanceled },
            React.createElement("div", { className: "flex-shrink-0 mr-4" },
                React.createElement(CustomRatioImage, { width: "3rem", ratio: 1, src: creator.avatarUrl || DefaultAvatar, shape: "circle" })),
            React.createElement("div", { className: "flex-grow-1" },
                React.createElement(StyledTitle, null, title),
                React.createElement(StyledMetaBlock, { className: "d-flex justify-content-start" },
                    React.createElement("div", { className: "mr-3" },
                        React.createElement(Icon, { src: CalendarOIcon, className: "mr-1" }),
                        React.createElement("span", null, dateRangeFormatter({ startedAt: startedAt, endedAt: endedAt, dateFormat: 'MM/DD(dd)' }))),
                    React.createElement("div", { className: "d-none d-lg-block" },
                        React.createElement(Icon, { src: UserOIcon, className: "mr-1" }),
                        React.createElement("span", null, creator.name))))),
        React.createElement(StyledStatusBar, { className: "d-flex align-items-center" }, isCanceled ? (React.createElement(StyledCanceledText, null,
            React.createElement(Button, { type: "link", size: "small", className: "mr-3", onClick: function () { return setIssueModalVisible(true); } }, formatMessage(messages.appointmentIssue)),
            formatMessage(messages.appointmentCanceledNotation, {
                time: moment(canceledAt).format('MM/DD(dd) HH:mm'),
            }))) : isFinished ? (React.createElement(React.Fragment, null,
            React.createElement(Button, { type: "link", size: "small", className: "mr-3", onClick: function () { return setIssueModalVisible(true); } }, formatMessage(messages.appointmentIssue)),
            React.createElement(StyledBadge, null, formatMessage(commonMessages.status.finished)))) : (React.createElement(React.Fragment, null,
            React.createElement(Button, { type: "link", size: "small", className: "mr-3", onClick: function () { return setIssueModalVisible(true); } }, formatMessage(messages.appointmentIssue)),
            React.createElement(Button, { type: "link", size: "small", className: "mr-3", onClick: function () {
                    return window.open('https://calendar.google.com/calendar/event?action=TEMPLATE&text={{TITLE}}&dates={{STARTED_AT}}/{{ENDED_AT}}&details={{DETAILS}}'
                        .replace('{{TITLE}}', title)
                        .replace('{{STARTED_AT}}', moment(startedAt).format('YYYYMMDDTHHmmss'))
                        .replace('{{ENDED_AT}}', moment(endedAt).format('YYYYMMDDTHHmmss'))
                        .replace('{{DETAILS}}', appointmentUrl));
                } }, formatMessage(commonMessages.button.toCalendar)),
            React.createElement(Button, { type: "primary", onClick: function () {
                    return window.open("https://meet.jit.si/" + orderProduct.id + "#config.startWithVideoMuted=true&userInfo.displayName=\"" + member.name + "\"");
                } }, formatMessage(commonMessages.button.attend)),
            React.createElement(Dropdown, { overlay: React.createElement(Menu, null,
                    React.createElement(Menu.Item, { onClick: function () { return setCancelModalVisible(true); } }, formatMessage(messages.cancelAppointment))), trigger: ['click'] },
                React.createElement(AntdIcon, { type: "more", className: "ml-3" }))))),
        React.createElement(StyledModal, { width: 660, visible: issueModalVisible, footer: isFinished ? null : undefined, okText: formatMessage(commonMessages.button.save), cancelText: formatMessage(commonMessages.button.cancel), okButtonProps: { loading: loading }, onOk: handleSubmit, onCancel: function () { return setIssueModalVisible(false); } },
            React.createElement(StyledModalTitle, { className: "mb-3" }, formatMessage(messages.appointmentIssue)),
            React.createElement(StyledModalMetaBlock, { className: "mb-3" },
                React.createElement("span", { className: "mr-2" }, formatMessage(messages.appointmentDate)),
                React.createElement("span", null, dateRangeFormatter({ startedAt: startedAt, endedAt: endedAt, dateFormat: 'MM/DD(dd)' }))),
            React.createElement("div", { className: "mb-3" },
                React.createElement("strong", { className: "mb-2" }, formatMessage(messages.createAppointmentIssue)),
                React.createElement("div", null, formatMessage(messages.appointmentIssueDescription))),
            React.createElement(Form, { colon: false, className: isFinished ? 'd-none' : '' },
                React.createElement(Form.Item, null, form.getFieldDecorator('appointmentIssue', {
                    initialValue: BraftEditor.createEditorState(appointmentIssue),
                })(React.createElement(StyledBraftEditor, { language: "zh-hant", contentClassName: "short-bf-content", controls: [
                        'headings',
                        'bold',
                        'italic',
                        'underline',
                        'strike-through',
                        'remove-styles',
                        'separator',
                        'text-align',
                        'separator',
                        'list-ul',
                        'list-ol',
                        'blockquote',
                        'code',
                        'separator',
                        'link',
                        'hr',
                        'media',
                    ] })))),
            isFinished && React.createElement(BraftContent, null, appointmentIssue)),
        React.createElement(StyledModal, { width: 384, centered: true, visible: cancelModalVisible, okText: formatMessage(messages.cancelAppointment), cancelText: formatMessage(commonMessages.ui.back), okButtonProps: { loading: loading, type: 'danger', disabled: !canceledReason }, onOk: function () { return handleCancel(); }, onCancel: function () { return setCancelModalVisible(false); } },
            React.createElement(StyledModalTitle, { className: "mb-4" }, formatMessage(messages.confirmCancelAlert)),
            React.createElement("div", { className: "mb-4" }, formatMessage(messages.confirmCancelNotation)),
            React.createElement(StyledModalSubTitle, null, formatMessage(messages.canceledReason)),
            React.createElement(Input.TextArea, { onChange: function (e) { return setCanceledReason(e.target.value); } }))));
};
export default Form.create()(AppointmentCard);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
//# sourceMappingURL=AppointmentCard.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Button, ButtonGroup, FormControl, FormErrorMessage, useDisclosure, useToast } from '@chakra-ui/react';
import BraftEditor from 'braft-editor';
import gql from 'graphql-tag';
import moment from 'moment';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { createUploadFn } from '../../helpers';
import { commonMessages } from '../../helpers/translation';
import IconEmail from '../../images/email-o.svg';
import { useAuth } from '../auth/AuthContext';
import CommonModal from '../common/CommonModal';
import { AvatarImage } from '../common/Image';
import { BraftContent } from '../common/StyledBraftEditor';
var messages = defineMessages({
    contactMessage: { id: 'merchandise.ui.contactMessage', defaultMessage: '聯絡訊息' },
    fillMessageContent: { id: 'merchandise.text.fillMessageContent', defaultMessage: '請填寫訊息內容' },
    emptyContactMessage: { id: 'error.form.contactMessage', defaultMessage: '請輸入訊息' },
});
var StyledButton = styled(Button)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n\n  ", "\n"], ["\n  position: relative;\n\n  ",
    "\n"])), function (props) {
    return props.isMark && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      &::after {\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        border-radius: 50%;\n        width: 6px;\n        height: 6px;\n        background-color: var(--error);\n        content: '';\n      }\n    "], ["\n      &::after {\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        border-radius: 50%;\n        width: 6px;\n        height: 6px;\n        background-color: var(--error);\n        content: '';\n      }\n    "])));
});
var StyledEditor = styled(BraftEditor)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  .bf-controlbar {\n    box-shadow: initial;\n  }\n  .bf-content {\n    border: 1px solid #cdcdcd;\n    border-radius: 4px;\n    height: initial;\n  }\n"], ["\n  .bf-controlbar {\n    box-shadow: initial;\n  }\n  .bf-content {\n    border: 1px solid #cdcdcd;\n    border-radius: 4px;\n    height: initial;\n  }\n"])));
var StyledFormControl = styled(FormControl)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  height: 20px;\n"], ["\n  height: 20px;\n"])));
var StyledContactBlock = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  &:nth-child(n + 1):not(:last-child) {\n    border-bottom: 1px solid var(--gray-light);\n  }\n"], ["\n  &:nth-child(n + 1):not(:last-child) {\n    border-bottom: 1px solid var(--gray-light);\n  }\n"])));
var StyledMemberInfo = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  line-height: 36px;\n  color: var(--gray-dark);\n"], ["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  line-height: 36px;\n  color: var(--gray-dark);\n"])));
var MerchandiseContactBlock = function (_a) {
    var avatarUrl = _a.avatarUrl, name = _a.name, createdAt = _a.createdAt, message = _a.message;
    return (React.createElement(StyledContactBlock, { className: "d-flex align-items-between mt-4" },
        React.createElement(AvatarImage, { src: avatarUrl, className: "flex-shrink-0 mr-3", size: "36px", shape: "circle" }),
        React.createElement("div", { className: "flex-grow-1 mb-4" },
            React.createElement(StyledMemberInfo, { className: "mb-3" },
                React.createElement("span", { className: "mr-2" }, name),
                React.createElement("span", null, moment(createdAt).fromNow())),
            React.createElement(BraftContent, null, message))));
};
var MerchandiseOrderContactModal = function (_a) {
    var _b;
    var orderId = _a.orderId;
    var appId = useApp().id;
    var _c = useAuth(), authToken = _c.authToken, currentMemberId = _c.currentMemberId, backendEndpoint = _c.backendEndpoint;
    var _d = useOrderContact(orderId, currentMemberId || ''), loading = _d.loading, error = _d.error, orderContacts = _d.orderContacts, isUnread = _d.isUnread, refetch = _d.refetch, insertOrderContact = _d.insertOrderContact, updateOrderContactReadAt = _d.updateOrderContactReadAt;
    var formatMessage = useIntl().formatMessage;
    var _e = useForm({
        defaultValues: { message: BraftEditor.createEditorState('') },
    }), control = _e.control, handleSubmit = _e.handleSubmit, setValue = _e.setValue, errors = _e.errors, setError = _e.setError;
    var _f = useDisclosure(), isOpen = _f.isOpen, onOpen = _f.onOpen, onClose = _f.onClose;
    var toast = useToast();
    var handleSave = function (data) {
        if (data.message.isEmpty()) {
            setError('message', {
                message: formatMessage(messages.emptyContactMessage),
            });
            return;
        }
        insertOrderContact(data.message.toRAW())
            .then(function () {
            toast({
                title: formatMessage(commonMessages.event.successfullySaved),
                status: 'success',
                duration: 3000,
                isClosable: false,
                position: 'top',
            });
            // reset
            setValue('message', BraftEditor.createEditorState(''));
            refetch();
        })
            .catch(function (error) { return console.log(error); });
    };
    if (loading || error) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(CommonModal, { title: formatMessage(messages.contactMessage), isOpen: isOpen, onClose: onClose, renderTrigger: function () { return (React.createElement(StyledButton, { isMark: isUnread, leftIcon: React.createElement(Icon, { src: IconEmail }), variant: "ghost", colorScheme: "white", onClick: function () {
                    onOpen();
                    updateOrderContactReadAt(new Date())
                        .then(function () { return refetch(); })
                        .catch(function (err) { return console.error(err); });
                } }, formatMessage(messages.contactMessage))); } },
            React.createElement("form", { onSubmit: handleSubmit(handleSave) },
                React.createElement(Controller, { name: "message", as: React.createElement(StyledEditor, { language: "zh-hant", controls: ['bold', 'italic', 'underline', 'remove-styles', 'separator', 'media'], media: { uploadFn: createUploadFn(appId, authToken, backendEndpoint) }, placeholder: formatMessage(messages.fillMessageContent) }), control: control }),
                React.createElement(StyledFormControl, { isInvalid: !!(errors === null || errors === void 0 ? void 0 : errors.message), className: "mt-1" },
                    React.createElement(FormErrorMessage, { className: "mt-1" }, (_b = errors === null || errors === void 0 ? void 0 : errors.message) === null || _b === void 0 ? void 0 : _b.message)),
                React.createElement(ButtonGroup, { className: "d-flex justify-content-end mb-4" },
                    React.createElement(Button, { variant: "outline", colorScheme: "primary", onClick: onClose }, formatMessage(commonMessages.button.cancel)),
                    React.createElement(Button, { variant: "solid", colorScheme: "primary", type: "submit" }, formatMessage(commonMessages.button.save)))),
            React.createElement("div", null, orderContacts.map(function (v) { return (React.createElement(MerchandiseContactBlock, { key: v.id, avatarUrl: v.member.pictureUrl, name: v.member.name, createdAt: v.createdAt, message: v.message })); })))));
};
var useOrderContact = function (orderId, memberId) {
    var _a, _b, _c, _d;
    var _e = useQuery(GET_ORDER_CONTACT, {
        variables: {
            orderId: orderId,
            memberId: memberId,
        },
    }), loading = _e.loading, error = _e.error, data = _e.data, refetch = _e.refetch;
    var orderContacts = loading || error || !data
        ? []
        : data.order_contact.map(function (v) {
            var _a, _b, _c;
            return ({
                id: v.id,
                message: v.message,
                createdAt: v.created_at,
                member: {
                    id: ((_a = v.member) === null || _a === void 0 ? void 0 : _a.id) || '',
                    name: ((_b = v.member) === null || _b === void 0 ? void 0 : _b.name) || '',
                    pictureUrl: ((_c = v.member) === null || _c === void 0 ? void 0 : _c.picture_url) || '',
                },
            });
        });
    var latestCreatedAt = new Date(((_b = (_a = data === null || data === void 0 ? void 0 : data.order_contact_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.max) === null || _b === void 0 ? void 0 : _b.created_at) || 0);
    var latestReadAt = new Date(((_d = (_c = data === null || data === void 0 ? void 0 : data.order_contact_aggregate.aggregate) === null || _c === void 0 ? void 0 : _c.max) === null || _d === void 0 ? void 0 : _d.read_at) || 0);
    var isUnread = latestCreatedAt.getTime() > latestReadAt.getTime();
    var insertOrderContactHandler = useMutation(INSERT_ORDER_CONTACT)[0];
    var insertOrderContact = function (message) {
        return insertOrderContactHandler({
            variables: {
                orderId: orderId,
                memberId: memberId,
                message: message,
            },
        });
    };
    var updateOrderContactHandler = useMutation(UPDATE_ORDER_CONTACT_READ_AT)[0];
    var updateOrderContactReadAt = function (readAt) {
        return updateOrderContactHandler({
            variables: {
                orderId: orderId,
                memberId: memberId,
                readAt: readAt,
            },
        });
    };
    return {
        loading: loading,
        error: error,
        orderContacts: orderContacts,
        isUnread: isUnread,
        refetch: refetch,
        insertOrderContact: insertOrderContact,
        updateOrderContactReadAt: updateOrderContactReadAt,
    };
};
var GET_ORDER_CONTACT = gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  query GET_ORDER_CONTACT($orderId: String!, $memberId: String!) {\n    order_contact(where: { order_id: { _eq: $orderId } }, order_by: { created_at: desc }) {\n      id\n      message\n      created_at\n      read_at\n      member {\n        id\n        name\n        picture_url\n      }\n    }\n    order_contact_aggregate(where: { order_id: { _eq: $orderId }, member_id: { _neq: $memberId } }) {\n      aggregate {\n        max {\n          created_at\n          read_at\n        }\n      }\n    }\n  }\n"], ["\n  query GET_ORDER_CONTACT($orderId: String!, $memberId: String!) {\n    order_contact(where: { order_id: { _eq: $orderId } }, order_by: { created_at: desc }) {\n      id\n      message\n      created_at\n      read_at\n      member {\n        id\n        name\n        picture_url\n      }\n    }\n    order_contact_aggregate(where: { order_id: { _eq: $orderId }, member_id: { _neq: $memberId } }) {\n      aggregate {\n        max {\n          created_at\n          read_at\n        }\n      }\n    }\n  }\n"])));
var INSERT_ORDER_CONTACT = gql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  mutation INSERT_ORDER_CONTACT($orderId: String!, $memberId: String!, $message: String!) {\n    insert_order_contact(objects: { order_id: $orderId, member_id: $memberId, message: $message }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation INSERT_ORDER_CONTACT($orderId: String!, $memberId: String!, $message: String!) {\n    insert_order_contact(objects: { order_id: $orderId, member_id: $memberId, message: $message }) {\n      affected_rows\n    }\n  }\n"])));
var UPDATE_ORDER_CONTACT_READ_AT = gql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  mutation UPDATE_ORDER_CONTACT_READ_AT($orderId: String!, $memberId: String!, $readAt: timestamptz!) {\n    update_order_contact(\n      _set: { read_at: $readAt }\n      where: { order_id: { _eq: $orderId }, member_id: { _neq: $memberId }, read_at: { _is_null: true } }\n    ) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation UPDATE_ORDER_CONTACT_READ_AT($orderId: String!, $memberId: String!, $readAt: timestamptz!) {\n    update_order_contact(\n      _set: { read_at: $readAt }\n      where: { order_id: { _eq: $orderId }, member_id: { _neq: $memberId }, read_at: { _is_null: true } }\n    ) {\n      affected_rows\n    }\n  }\n"])));
export default MerchandiseOrderContactModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=MerchandiseOrderContactModal.js.map
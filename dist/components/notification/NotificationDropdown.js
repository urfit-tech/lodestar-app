var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useMutation } from '@apollo/react-hooks';
import { Badge, Button, List, Popover } from 'antd';
import gql from 'graphql-tag';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import NotificationContext from '../../contexts/NotificationContext';
import { commonMessages } from '../../helpers/translation';
import NotificationItem from './NotificationItem';
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100vw;\n  max-width: 432px;\n"], ["\n  width: 100vw;\n  max-width: 432px;\n"])));
var StyledList = styled(List)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    max-height: calc(70vh - 57px - 42px);\n    overflow-y: auto;\n    overflow-x: hidden;\n  }\n"], ["\n  && {\n    max-height: calc(70vh - 57px - 42px);\n    overflow-y: auto;\n    overflow-x: hidden;\n  }\n"])));
var StyledAction = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  border-top: 1px solid #ececec;\n\n  button {\n    color: #9b9b9b;\n  }\n"], ["\n  border-top: 1px solid #ececec;\n\n  button {\n    color: #9b9b9b;\n  }\n"])));
var StyledBadge = styled(Badge)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  button {\n    font-size: 20px;\n  }\n\n  .ant-badge-count {\n    top: 8px;\n    right: 4px;\n    padding: 0 0.25rem;\n  }\n"], ["\n  button {\n    font-size: 20px;\n  }\n\n  .ant-badge-count {\n    top: 8px;\n    right: 4px;\n    padding: 0 0.25rem;\n  }\n"])));
var StyledButton = styled(Button)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  &&,\n  &&:hover,\n  &&:active,\n  &&:focus {\n    color: var(--gray-darker);\n  }\n"], ["\n  &&,\n  &&:hover,\n  &&:active,\n  &&:focus {\n    color: var(--gray-darker);\n  }\n"])));
var StyledReadAllButton = styled(Button)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: var(--gray-dark);\n"], ["\n  color: var(--gray-dark);\n"])));
var NotificationDropdown = function () {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _a = useContext(NotificationContext), notifications = _a.notifications, unreadCount = _a.unreadCount, refetchNotifications = _a.refetchNotifications;
    var readAllNotification = useMutation(READ_ALL_NOTIFICATION)[0];
    var content = (React.createElement(Wrapper, null,
        React.createElement(StyledList, { itemLayout: "horizontal" }, notifications.map(function (notification) { return (React.createElement(NotificationItem, { key: notification.id, id: notification.id, description: notification.description, avatar: notification.avatar, updatedAt: notification.updatedAt, extra: notification.extra, referenceUrl: notification.referenceUrl, type: notification.type, readAt: notification.readAt, onRead: function () { return refetchNotifications && refetchNotifications(); } })); })),
        React.createElement(StyledAction, null,
            React.createElement(Button, { type: "link", block: true, onClick: function () { return history.push('/notifications'); } }, formatMessage(commonMessages.button.notification)))));
    return (React.createElement(Popover, { placement: "bottomRight", trigger: "click", title: React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
            React.createElement("span", null, formatMessage(commonMessages.content.notification)),
            React.createElement(StyledReadAllButton, { type: "link", size: "small", onClick: function () {
                    return readAllNotification({
                        variables: { readAt: new Date() },
                    }).then(function () { return refetchNotifications && refetchNotifications(); });
                } }, formatMessage(commonMessages.button.markAll))), content: content },
        React.createElement(StyledBadge, { count: unreadCount && unreadCount > 15 ? '15+' : unreadCount, className: "mr-2" },
            React.createElement(StyledButton, { type: "link", icon: "bell" }))));
};
var READ_ALL_NOTIFICATION = gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  mutation READ_ALL_NOTIFICATIONS($readAt: timestamptz) {\n    update_notification(where: { read_at: { _is_null: true } }, _set: { read_at: $readAt }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation READ_ALL_NOTIFICATIONS($readAt: timestamptz) {\n    update_notification(where: { read_at: { _is_null: true } }, _set: { read_at: $readAt }) {\n      affected_rows\n    }\n  }\n"])));
export default NotificationDropdown;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=NotificationDropdown.js.map
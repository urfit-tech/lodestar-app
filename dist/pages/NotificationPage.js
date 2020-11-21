import { Icon, List, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import AdminCard from '../components/common/AdminCard';
import DefaultLayout from '../components/layout/DefaultLayout';
import NotificationItem from '../components/notification/NotificationItem';
import { commonMessages, productMessages } from '../helpers/translation';
import { useNotifications } from '../hooks/data';
var NotificationPage = function () {
    var formatMessage = useIntl().formatMessage;
    var _a = useNotifications(100), loadingNotifications = _a.loadingNotifications, errorNotifications = _a.errorNotifications, notifications = _a.notifications, refetchNotifications = _a.refetchNotifications;
    return (React.createElement(DefaultLayout, null,
        React.createElement("div", { className: "py-5" },
            React.createElement("div", { className: "container" },
                React.createElement(Typography.Title, { className: "mb-4", level: 3 },
                    React.createElement(Icon, { type: "bell", className: "mr-1" }),
                    React.createElement("span", null, formatMessage(commonMessages.title.notification))),
                React.createElement(AdminCard, { loading: loadingNotifications, style: { color: '#9b9b9b' } }, errorNotifications ? (formatMessage(commonMessages.status.loadingNotificationError)) : notifications.length > 0 ? (React.createElement(List, { itemLayout: "horizontal" }, notifications.map(function (notification) { return (React.createElement(NotificationItem, { key: notification.id, id: notification.id, description: notification.description, avatar: notification.avatar, updatedAt: notification.updatedAt, extra: notification.extra, referenceUrl: notification.referenceUrl, type: notification.type, readAt: notification.readAt, onRead: function () { return refetchNotifications(); } })); }))) : (formatMessage(productMessages.program.message.noNotification)))))));
};
export default NotificationPage;
//# sourceMappingURL=NotificationPage.js.map
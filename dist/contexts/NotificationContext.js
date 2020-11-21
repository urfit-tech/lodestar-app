var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
import React, { createContext } from 'react';
import { useNotifications } from '../hooks/data';
export var GET_NOTIFICATIONS = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_NOTIFICATIONS($limit: Int) {\n    notification(order_by: { updated_at: desc }, limit: $limit) {\n      id\n      avatar\n      description\n      reference_url\n      extra\n      type\n      read_at\n      updated_at\n    }\n    notification_aggregate(where: { read_at: { _is_null: true } }, limit: 16) {\n      aggregate {\n        count\n      }\n    }\n  }\n"], ["\n  query GET_NOTIFICATIONS($limit: Int) {\n    notification(order_by: { updated_at: desc }, limit: $limit) {\n      id\n      avatar\n      description\n      reference_url\n      extra\n      type\n      read_at\n      updated_at\n    }\n    notification_aggregate(where: { read_at: { _is_null: true } }, limit: 16) {\n      aggregate {\n        count\n      }\n    }\n  }\n"])));
var NotificationContext = createContext({
    loadingNotifications: true,
    notifications: [],
});
export var NotificationProvider = function (_a) {
    var children = _a.children;
    var _b = useNotifications(15), loadingNotifications = _b.loadingNotifications, errorNotifications = _b.errorNotifications, notifications = _b.notifications, unreadCount = _b.unreadCount, refetchNotifications = _b.refetchNotifications;
    return (React.createElement(NotificationContext.Provider, { value: {
            loadingNotifications: loadingNotifications,
            errorNotifications: errorNotifications,
            notifications: notifications,
            unreadCount: unreadCount,
            refetchNotifications: refetchNotifications,
        } }, children));
};
export default NotificationContext;
var templateObject_1;
//# sourceMappingURL=NotificationContext.js.map
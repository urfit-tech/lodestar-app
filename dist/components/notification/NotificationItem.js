var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useMutation } from '@apollo/react-hooks';
import { Icon, List } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { getNotificationIconType, rgba } from '../../helpers';
import { AvatarImage } from '../common/Image';
var StyledListItem = styled(List.Item)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    padding: 0.75rem;\n    cursor: pointer;\n\n    ", "\n  }\n"], ["\n  && {\n    padding: 0.75rem;\n    cursor: pointer;\n\n    ",
    "\n  }\n"])), function (props) {
    return props.variant === 'read'
        ? ''
        : css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            background: ", ";\n          "], ["\n            background: ", ";\n          "])), function (props) { return rgba(props.theme['@primary-color'], 0.1); });
});
var NotificationItem = function (_a) {
    var id = _a.id, description = _a.description, avatar = _a.avatar, updatedAt = _a.updatedAt, extra = _a.extra, referenceUrl = _a.referenceUrl, type = _a.type, readAt = _a.readAt, onRead = _a.onRead;
    var history = useHistory();
    var readNotification = useMutation(READ_NOTIFICATION)[0];
    return (React.createElement(StyledListItem, { className: referenceUrl ? 'cursor-pointer' : '', variant: readAt ? 'read' : undefined, onClick: function () {
            readNotification({
                variables: { notificationId: id, readAt: new Date() },
            }).then(function () {
                if (referenceUrl) {
                    if (referenceUrl.startsWith('http')) {
                        var url = new URL(referenceUrl);
                        history.push(url.pathname);
                    }
                    else {
                        history.push(referenceUrl);
                    }
                }
                else {
                    onRead && onRead();
                }
            });
        } },
        React.createElement(List.Item.Meta, { className: "align-item-start", avatar: React.createElement(AvatarImage, { src: avatar || '' }), title: description, description: React.createElement("div", { style: { color: '#9b9b9b' } },
                React.createElement("span", { className: "mr-1" }, type && React.createElement(Icon, { type: getNotificationIconType(type) })),
                React.createElement("span", null, moment(updatedAt).fromNow()),
                extra && React.createElement("span", null,
                    "\u30FB",
                    extra)) })));
};
var READ_NOTIFICATION = gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  mutation READ_NOTIFICATION($notificationId: uuid!, $readAt: timestamptz) {\n    update_notification(where: { id: { _eq: $notificationId } }, _set: { read_at: $readAt }) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation READ_NOTIFICATION($notificationId: uuid!, $readAt: timestamptz) {\n    update_notification(where: { id: { _eq: $notificationId } }, _set: { read_at: $readAt }) {\n      affected_rows\n    }\n  }\n"])));
export default NotificationItem;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=NotificationItem.js.map
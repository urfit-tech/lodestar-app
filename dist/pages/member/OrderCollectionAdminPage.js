import { Typography } from 'antd';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { useAuth } from '../../components/auth/AuthContext';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import OrderCollectionAdminCard from '../../components/sale/OrderCollectionAdminCard';
import { commonMessages } from '../../helpers/translation';
import ClipboardListIcon from '../../images/clipboard-list.svg';
var OrderCollectionAdminPage = function () {
    var currentMemberId = useAuth().currentMemberId;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: ClipboardListIcon, className: "mr-3" }),
            React.createElement("span", null, formatMessage(commonMessages.content.orderHistory))),
        currentMemberId && React.createElement(OrderCollectionAdminCard, { memberId: currentMemberId })));
};
export default OrderCollectionAdminPage;
//# sourceMappingURL=OrderCollectionAdminPage.js.map
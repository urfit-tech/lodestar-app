import { List, Skeleton } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import ActivityTicketItem from '../../components/activity/ActivityTicketItem';
import { commonMessages } from '../../helpers/translation';
import { useEnrolledActivityTickets } from '../../hooks/activity';
var ActivityTicketCollectionBlock = function (_a) {
    var memberId = _a.memberId;
    var _b = useEnrolledActivityTickets(memberId), loadingTickets = _b.loadingTickets, errorTickets = _b.errorTickets, enrolledActivityTickets = _b.enrolledActivityTickets;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement("div", { className: "container py-3" }, loadingTickets ? (React.createElement(Skeleton, { active: true })) : errorTickets ? (formatMessage(commonMessages.status.loadingError)) : (React.createElement(List, null, enrolledActivityTickets.map(function (ticket) { return (React.createElement(Link, { to: "/orders/" + ticket.orderLogId + "/products/" + ticket.orderProductId, key: ticket.orderProductId },
        React.createElement("div", { className: "mb-4" },
            React.createElement(ActivityTicketItem, { ticketId: ticket.activityTicketId })))); })))));
};
export default ActivityTicketCollectionBlock;
//# sourceMappingURL=ActivityTicketCollectionBlock.js.map
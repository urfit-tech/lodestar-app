import { Tag } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { saleMessages } from '../../helpers/translation';
var OrderStatusTag = function (_a) {
    var status = _a.status;
    var formatMessage = useIntl().formatMessage;
    switch (status) {
        case 'SUCCESS':
            return React.createElement(Tag, { color: "#4ed1b3" }, formatMessage(saleMessages.status.completed));
        case 'UNPAID':
            return React.createElement(Tag, { color: "#ffbe1e" }, formatMessage(saleMessages.status.unpaid));
        case 'REFUND':
            return React.createElement(Tag, { color: "#9b9b9b" }, formatMessage(saleMessages.status.refunded));
        case 'EXPIRED':
            return React.createElement(Tag, { color: "#ff7d62" }, formatMessage(saleMessages.status.expired));
        default:
            return React.createElement(Tag, { color: "#ff7d62" }, formatMessage(saleMessages.status.fail));
    }
};
export default OrderStatusTag;
//# sourceMappingURL=OrderStatusTag.js.map
import { Skeleton } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../components/layout/DefaultLayout';
import { commonMessages } from '../helpers/translation';
import { useOrderProduct } from '../hooks/checkout';
import ActivityTicketPage from './ActivityTicketPage';
var OrderProductPage = function () {
    var formatMessage = useIntl().formatMessage;
    var orderProductId = useParams().orderProductId;
    var _a = useOrderProduct(orderProductId), loadingOrderProduct = _a.loadingOrderProduct, errorOrderProduct = _a.errorOrderProduct, orderProduct = _a.orderProduct;
    if (loadingOrderProduct) {
        return (React.createElement(DefaultLayout, { noFooter: true },
            React.createElement(Skeleton, { active: true })));
    }
    if (errorOrderProduct || !orderProduct) {
        return (React.createElement(DefaultLayout, { noFooter: true },
            React.createElement("div", null, formatMessage(commonMessages.status.readingError))));
    }
    if (orderProduct.product.type === 'ActivityTicket') {
        return (React.createElement(ActivityTicketPage, { orderProductId: orderProductId, activityTicketId: orderProduct.product.target, memberId: orderProduct.memberId, invoice: orderProduct.invoice }));
    }
    return React.createElement(DefaultLayout, { noFooter: true },
        "this is an order product page of: ",
        orderProductId);
};
export default OrderProductPage;
//# sourceMappingURL=OrderProductPage.js.map
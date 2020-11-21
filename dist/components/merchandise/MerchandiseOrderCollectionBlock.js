var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Skeleton } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import React from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { productMessages, saleMessages } from '../../helpers/translation';
import { useOrderLogsWithMerchandiseSpec } from '../../hooks/merchandise';
import CalendarOIcon from '../../images/calendar-alt-o.svg';
import AdminCard from '../common/AdminCard';
import MerchandiseOrderContactModal from './MerchandiseOrderContactModal';
import MerchandiseShippingInfoModal from './MerchandiseShippingInfoModal';
import MerchandiseSpecItem from './MerchandiseSpecItem';
var messages = defineMessages({
    purchase: { id: 'product.merchandise.text.purchase', defaultMessage: '購買' },
    seller: { id: 'product.merchandise.ui.seller', defaultMessage: '賣家通知' },
    shipped: { id: 'product.merchandise.status.shipped', defaultMessage: '已出貨' },
    shipping: { id: 'product.merchandise.status.shipping', defaultMessage: '待出貨' },
});
var StyledOrderTitle = styled.h3(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledPurchaseDate = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledSpecification = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 16px;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 16px;\n  letter-spacing: 0.2px;\n"])));
var StyledTag = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding: 2px 8px;\n  border-radius: 4px;\n  font-size: 12px;\n  letter-spacing: 0.6px;\n  white-space: nowrap;\n\n  ", "\n"], ["\n  padding: 2px 8px;\n  border-radius: 4px;\n  font-size: 12px;\n  letter-spacing: 0.6px;\n  white-space: nowrap;\n\n  ",
    "\n"])), function (props) {
    return props.active
        ? css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          background-color: ", ";\n          color: #fff;\n        "], ["\n          background-color: ", ";\n          color: #fff;\n        "])), props.theme['@primary-color']) : css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n          border: solid 1px var(--gray);\n          background-color: #fff;\n          color: var(--gray-dark);\n        "], ["\n          border: solid 1px var(--gray);\n          background-color: #fff;\n          color: var(--gray-dark);\n        "])));
});
var StyledDeliveryMessage = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  background-color: var(--gray-lighter);\n\n  h4.seller {\n    font-weight: bold;\n    letter-spacing: 0.2px;\n    color: var(--gray-darker);\n  }\n\n  .delivered-at {\n    color: var(--gray-dark);\n    font-size: 14px;\n    letter-spacing: 0.4px;\n  }\n\n  .deliver-message {\n    color: var(--gray-darker);\n    line-height: 1.5;\n    letter-spacing: 0.2px;\n    text-align: justify;\n    white-space: pre-line;\n  }\n"], ["\n  background-color: var(--gray-lighter);\n\n  h4.seller {\n    font-weight: bold;\n    letter-spacing: 0.2px;\n    color: var(--gray-darker);\n  }\n\n  .delivered-at {\n    color: var(--gray-dark);\n    font-size: 14px;\n    letter-spacing: 0.4px;\n  }\n\n  .deliver-message {\n    color: var(--gray-darker);\n    line-height: 1.5;\n    letter-spacing: 0.2px;\n    text-align: justify;\n    white-space: pre-line;\n  }\n"])));
var MerchandiseOrderCollectionBlock = function (_a) {
    var memberId = _a.memberId;
    var formatMessage = useIntl().formatMessage;
    var _b = useOrderLogsWithMerchandiseSpec(memberId), loadingOrderLogs = _b.loadingOrderLogs, errorOrderLogs = _b.errorOrderLogs, orderLogs = _b.orderLogs;
    if (loadingOrderLogs) {
        return (React.createElement("div", { className: "container pt-4" },
            React.createElement(Skeleton, { active: true })));
    }
    if (errorOrderLogs || !orderLogs.length) {
        return React.createElement("div", { className: "container pt-4" }, formatMessage(productMessages.merchandise.content.noMerchandiseOrder));
    }
    return (React.createElement("div", { className: "container pt-4" }, orderLogs.map(function (orderLog) { return (React.createElement(MerchandiseOrderCard, { key: orderLog.id, orderLog: orderLog })); })));
};
var MerchandiseOrderCard = function (_a) {
    var _b;
    var orderLog = _a.orderLog;
    var formatMessage = useIntl().formatMessage;
    var enabledModules = useApp().enabledModules;
    var _c = useMerchandiseType(orderLog.orderProducts.map(function (orderProduct) { return orderProduct.merchandiseSpecId; })), loadingMerchandiseTypes = _c.loadingMerchandiseTypes, errorMerchandiseTypes = _c.errorMerchandiseTypes, merchandiseTypes = _c.merchandiseTypes;
    if (loadingMerchandiseTypes || errorMerchandiseTypes) {
        return null;
    }
    var isAllGeneralVirtual = merchandiseTypes.every(function (v) { return !v.isPhysical && !v.isCustomized; });
    return (React.createElement(AdminCard, { key: orderLog.id, className: "mb-4" },
        React.createElement("div", { className: "d-lg-flex justify-content-between" },
            React.createElement("div", null,
                React.createElement(StyledOrderTitle, { className: "d-flex align-items-center mb-2" },
                    React.createElement("span", null, formatMessage(saleMessages.column.title.orderNo) + " " + orderLog.id),
                    isAllGeneralVirtual || (orderLog.deliveredAt && orderLog.deliverMessage) ? (React.createElement(StyledTag, { className: "ml-2" }, formatMessage(messages.shipped))) : (React.createElement(StyledTag, { className: "ml-2", active: true }, formatMessage(messages.shipping)))),
                orderLog.createdAt && (React.createElement(StyledPurchaseDate, { className: "mb-4 d-flex align-items-center" },
                    React.createElement(Icon, { src: CalendarOIcon, className: "mr-2" }), moment(orderLog.createdAt).format('YYYY-MM-DD hh:mm') + " " + formatMessage(messages.purchase))),
                ((_b = orderLog === null || orderLog === void 0 ? void 0 : orderLog.shipping) === null || _b === void 0 ? void 0 : _b.specification) && (React.createElement(StyledSpecification, { className: "mb-2" }, orderLog.shipping.specification))),
            React.createElement("div", null,
                enabledModules.order_contact && React.createElement(MerchandiseOrderContactModal, { orderId: orderLog.id }),
                orderLog.shipping && (React.createElement(MerchandiseShippingInfoModal, { shipping: orderLog.shipping, invoice: orderLog.invoice })))),
        orderLog.orderProducts.map(function (v) { return (React.createElement(MerchandiseSpecItem, { key: v.id, merchandiseSpecId: v.merchandiseSpecId, quantity: v.quantity, orderProductId: v.id, orderProductFilenames: v.filenames })); }),
        orderLog.deliveredAt && (React.createElement(StyledDeliveryMessage, { className: "mt-4 p-4" },
            React.createElement("div", { className: "d-flex justify-content-between" },
                React.createElement("h4", { className: "seller" }, formatMessage(messages.seller)),
                React.createElement("span", { className: "delivered-at" }, moment(orderLog.deliveredAt).format('YYYY-MM-DD HH:mm'))),
            React.createElement("div", { className: "deliver-message" }, orderLog.deliverMessage)))));
};
var useMerchandiseType = function (merchandiseSpecIds) {
    var _a = useQuery(gql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      query GET_MERCHANDISE_TYPE_COLLECTION($merchandiseSpecIds: [uuid!]!) {\n        merchandise_spec(where: { id: { _in: $merchandiseSpecIds } }) {\n          id\n          merchandise {\n            id\n            is_physical\n            is_customized\n          }\n        }\n      }\n    "], ["\n      query GET_MERCHANDISE_TYPE_COLLECTION($merchandiseSpecIds: [uuid!]!) {\n        merchandise_spec(where: { id: { _in: $merchandiseSpecIds } }) {\n          id\n          merchandise {\n            id\n            is_physical\n            is_customized\n          }\n        }\n      }\n    "]))), { variables: { merchandiseSpecIds: merchandiseSpecIds } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var merchandiseTypes = (data === null || data === void 0 ? void 0 : data.merchandise_spec.map(function (v) { return ({
        id: v.merchandise.id,
        isPhysical: v.merchandise.is_physical,
        isCustomized: v.merchandise.is_customized,
    }); })) || [];
    return {
        loadingMerchandiseTypes: loading,
        errorMerchandiseTypes: error,
        merchandiseTypes: merchandiseTypes,
        refetchMerchandiseTypes: refetch,
    };
};
export default MerchandiseOrderCollectionBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=MerchandiseOrderCollectionBlock.js.map
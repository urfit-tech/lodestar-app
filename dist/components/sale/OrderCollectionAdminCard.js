var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useQuery } from '@apollo/react-hooks';
import { Button, message, Skeleton, Table, Tooltip } from 'antd';
import axios from 'axios';
import gql from 'graphql-tag';
import moment from 'moment';
import { prop, sum } from 'ramda';
import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { dateFormatter, dateRangeFormatter, handleError } from '../../helpers';
import { codeMessages, commonMessages, saleMessages } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
import AdminCard from '../common/AdminCard';
import PriceLabel from '../common/PriceLabel';
import ProductTypeLabel from '../common/ProductTypeLabel';
import ShippingMethodLabel from '../common/ShippingMethodLabel';
import OrderStatusTag from './OrderStatusTag';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow: auto;\n\n  .ant-table {\n    .ant-table-thead,\n    .ant-table-row {\n      white-space: nowrap;\n    }\n  }\n"], ["\n  overflow: auto;\n\n  .ant-table {\n    .ant-table-thead,\n    .ant-table-row {\n      white-space: nowrap;\n    }\n  }\n"])));
var StyledDate = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: #9b9b9b;\n"], ["\n  color: #9b9b9b;\n"])));
var OrderProductTable = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: table;\n  width: 100%;\n"], ["\n  display: table;\n  width: 100%;\n"])));
var OrderProductCell = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: table-cell;\n  padding: 1.5rem 0;\n  border-bottom: 1px solid #e8e8e8;\n  ", "\n"], ["\n  display: table-cell;\n  padding: 1.5rem 0;\n  border-bottom: 1px solid #e8e8e8;\n  ", "\n"])), function (props) { return (props.grow ? 'width: 100%;' : ''); });
var OrderProductRow = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: table-row;\n  overflow: hidden;\n  white-space: nowrap;\n\n  &:first-child > ", " {\n    padding-top: 0;\n  }\n"], ["\n  display: table-row;\n  overflow: hidden;\n  white-space: nowrap;\n\n  &:first-child > ", " {\n    padding-top: 0;\n  }\n"])), OrderProductCell);
var OrderCollectionAdminCard = function (_a) {
    var memberId = _a.memberId, props = __rest(_a, ["memberId"]);
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _b = useAuth(), authToken = _b.authToken, backendEndpoint = _b.backendEndpoint;
    var _c = useOrderLogCollection(memberId), loading = _c.loading, error = _c.error, orderLogs = _c.orderLogs;
    if (loading || error) {
        return (React.createElement(AdminCard, null,
            React.createElement(Skeleton, { active: true })));
    }
    var columns = [
        {
            title: formatMessage(saleMessages.column.title.orderNo),
            dataIndex: 'id',
            key: 'id',
            width: '100px',
            render: function (text) { return (React.createElement(Tooltip, { title: text },
                React.createElement("span", null, text.split('-')[0]))); },
        },
        {
            title: formatMessage(saleMessages.column.title.purchaseDate),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '200px',
            render: function (text) { return React.createElement(StyledDate, null, dateFormatter(text)); },
        },
        {
            title: formatMessage(saleMessages.column.title.totalPrice),
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            align: 'right',
            render: function (text) { return React.createElement(PriceLabel, { listPrice: text }); },
        },
        {
            title: formatMessage(saleMessages.column.title.orderStatus),
            dataIndex: 'status',
            key: 'status',
            width: '100px',
            render: function (status) { return React.createElement(OrderStatusTag, { status: status }); },
        },
    ];
    var expandedRow = function (record) {
        var _a, _b;
        return (React.createElement("div", { className: "pr-3" },
            React.createElement(OrderProductTable, { className: "mb-4" }, record.orderProducts.map(function (orderProduct) { return (React.createElement(OrderProductRow, { key: orderProduct.id, className: "d-table-row" },
                React.createElement(OrderProductCell, { className: "pr-4" }, orderProduct.product.type ? (React.createElement(ProductTypeLabel, { productType: orderProduct.product.type })) : (React.createElement(React.Fragment, null, formatMessage(commonMessages.unknown.type)))),
                React.createElement(OrderProductCell, { className: "pr-4", grow: true },
                    orderProduct.name,
                    orderProduct.endedAt && orderProduct.product.type !== 'AppointmentPlan' && (React.createElement("span", { className: "ml-2" },
                        "(",
                        moment(orderProduct.endedAt).format('YYYY-MM-DD'),
                        " ",
                        formatMessage(commonMessages.term.expiredAt),
                        ")")),
                    orderProduct.startedAt && orderProduct.endedAt && orderProduct.product.type === 'AppointmentPlan' && (React.createElement("span", null,
                        "(",
                        dateRangeFormatter({
                            startedAt: orderProduct.startedAt,
                            endedAt: orderProduct.endedAt,
                            dateFormat: 'YYYY-MM-DD',
                        }),
                        ")")),
                    orderProduct.quantity && React.createElement("span", null, " X" + orderProduct.quantity + " ")),
                React.createElement(OrderProductCell, { className: "text-right" },
                    React.createElement(PriceLabel, { currencyId: orderProduct.currencyId, listPrice: orderProduct.price })))); })),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-3 d-flex align-items-end" }, record.status !== 'SUCCESS' && record.status !== 'REFUND' && record.status !== 'EXPIRED' && (React.createElement(Button, { onClick: function () {
                        return axios
                            .post(backendEndpoint + "/tasks/payment/", { orderId: record.id }, { headers: { authorization: "Bearer " + authToken } })
                            .then(function (_a) {
                            var _b = _a.data, code = _b.code, result = _b.result;
                            if (code === 'SUCCESS') {
                                history.push("/tasks/payment/" + result.id);
                            }
                            else {
                                message.error(formatMessage(codeMessages[code]));
                            }
                        })
                            .catch(handleError);
                    }, className: "mr-2" }, formatMessage(commonMessages.ui.repay)))),
                React.createElement("div", { className: "col-9" },
                    ((_a = record.shipping) === null || _a === void 0 ? void 0 : _a.id) && (React.createElement("div", { className: "row text-right" },
                        React.createElement("div", { className: "col-9" },
                            React.createElement(ShippingMethodLabel, { shippingMethodId: (_b = record.shipping) === null || _b === void 0 ? void 0 : _b.id })),
                        React.createElement("div", { className: "col-3" },
                            React.createElement(PriceLabel, { listPrice: record.shipping.fee })))),
                    record.orderDiscounts.map(function (orderDiscount) { return (React.createElement("div", { key: orderDiscount.name, className: "row text-right" },
                        React.createElement("div", { className: "col-9" }, orderDiscount.name),
                        React.createElement("div", { className: "col-3" },
                            React.createElement(PriceLabel, { listPrice: -orderDiscount.price })))); }),
                    React.createElement("div", { className: "row text-right" },
                        React.createElement("div", { className: "col-9" }, formatMessage(saleMessages.contents.totalAmount)),
                        React.createElement("div", { className: "col-3" },
                            React.createElement(PriceLabel, { listPrice: record.totalPrice })))))));
    };
    return (React.createElement(AdminCard, __assign({}, props),
        React.createElement(StyledContainer, null,
            React.createElement(Table, { loading: loading, dataSource: orderLogs, columns: columns, expandedRowRender: expandedRow }))));
};
var useOrderLogCollection = function (memberId) {
    var _a = useQuery(gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      query GET_MEMBER_ORDERS($memberId: String!) {\n        order_log(order_by: { created_at: desc }, where: { member_id: { _eq: $memberId } }) {\n          id\n          created_at\n          status\n          shipping\n          order_products {\n            id\n            name\n            price\n            started_at\n            ended_at\n            product {\n              id\n              type\n            }\n            options\n            currency_id\n          }\n          order_discounts {\n            id\n            name\n            description\n            price\n            type\n            target\n            options\n          }\n        }\n      }\n    "], ["\n      query GET_MEMBER_ORDERS($memberId: String!) {\n        order_log(order_by: { created_at: desc }, where: { member_id: { _eq: $memberId } }) {\n          id\n          created_at\n          status\n          shipping\n          order_products {\n            id\n            name\n            price\n            started_at\n            ended_at\n            product {\n              id\n              type\n            }\n            options\n            currency_id\n          }\n          order_discounts {\n            id\n            name\n            description\n            price\n            type\n            target\n            options\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, error = _a.error, data = _a.data;
    var orderLogs = loading || error || !data
        ? []
        : data.order_log.map(function (orderLog) {
            var _a;
            return ({
                id: orderLog.id,
                key: orderLog.id,
                createdAt: orderLog.created_at,
                status: orderLog.status,
                totalPrice: sum(orderLog.order_products.map(prop('price'))) -
                    sum(orderLog.order_discounts.map(prop('price'))) +
                    (((_a = orderLog.shipping) === null || _a === void 0 ? void 0 : _a.fee) || 0),
                shipping: orderLog.shipping,
                orderProducts: orderLog.order_products
                    .sort(function (a, b) { var _a, _b; return (((_a = a.options) === null || _a === void 0 ? void 0 : _a.position) || 0) - (((_b = b.options) === null || _b === void 0 ? void 0 : _b.position) || 0); })
                    .map(function (orderProduct) {
                    var _a;
                    return ({
                        id: orderProduct.id,
                        name: orderProduct.name,
                        price: orderProduct.price,
                        startedAt: orderProduct.started_at,
                        endedAt: orderProduct.ended_at,
                        product: {
                            id: orderProduct.product.id,
                            type: orderProduct.product.type,
                        },
                        quantity: (_a = orderProduct.options) === null || _a === void 0 ? void 0 : _a.quantity,
                        currencyId: orderProduct.currency_id,
                    });
                }),
                orderDiscounts: orderLog.order_discounts.map(function (orderDiscount) { return ({
                    id: orderDiscount.id,
                    name: orderDiscount.name,
                    type: orderDiscount.type,
                    target: orderDiscount.target,
                    description: orderDiscount.description,
                    price: orderDiscount.price,
                    options: orderDiscount.options,
                }); }),
            });
        });
    return {
        loading: loading,
        error: error,
        orderLogs: orderLogs,
    };
};
export default OrderCollectionAdminCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=OrderCollectionAdminCard.js.map
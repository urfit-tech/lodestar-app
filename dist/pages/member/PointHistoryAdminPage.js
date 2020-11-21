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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { useQuery } from '@apollo/react-hooks';
import { Button, message, Skeleton, Tabs, Typography } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import { useAuth } from '../../components/auth/AuthContext';
import AdminCard from '../../components/common/AdminCard';
import MemberAdminLayout from '../../components/layout/MemberAdminLayout';
import { useApp } from '../../containers/common/AppContext';
import { commonMessages } from '../../helpers/translation';
import PointIcon from '../../images/point.svg';
import LoadingPage from '../LoadingPage';
import NotFoundPage from '../NotFoundPage';
var messages = defineMessages({
    currentOwnedPoints: { id: 'payment.label.currentOwnedPoints', defaultMessage: '目前擁有' },
    unitOfPoints: { id: 'payment.label.unitOfPoints', defaultMessage: '點' },
    pointHistory: { id: 'payment.label.pointHistory', defaultMessage: '已獲紀錄' },
    orderHistory: { id: 'payment.label.orderHistory', defaultMessage: '消費紀錄' },
    dueAt: { id: 'payment.text.dueAt', defaultMessage: '有效期限 {date}' },
    unlimited: { id: 'payment.label.unlimited', defaultMessage: '無限期' },
    viewMore: { id: 'payment.ui.viewMore', defaultMessage: '顯示更多' },
    noPointLog: { id: 'payment.text.noPointLog', defaultMessage: '尚無點數紀錄' },
    noOrderLog: { id: 'payment.text.noOrderLog', default: '尚無消費紀錄' },
});
var StyledCardText = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  letter-spacing: 0.8px;\n"])));
var StyledNumber = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 28px;\n  font-weight: bold;\n  letter-spacing: 0.23px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 28px;\n  font-weight: bold;\n  letter-spacing: 0.23px;\n"])));
var StyledItem = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 0.75rem 0;\n  border-bottom: 1px solid #efefef;\n  > div:first-child {\n    width: 6rem;\n  }\n"], ["\n  padding: 0.75rem 0;\n  border-bottom: 1px solid #efefef;\n  > div:first-child {\n    width: 6rem;\n  }\n"])));
var StyledDescription = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 12px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 12px;\n"])));
var StyledLabel = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 0.125rem 0.5rem;\n  color: white;\n  font-size: 12px;\n  border-radius: 11px;\n  background: ", ";\n  white-space: nowrap;\n"], ["\n  padding: 0.125rem 0.5rem;\n  color: white;\n  font-size: 12px;\n  border-radius: 11px;\n  background: ", ";\n  white-space: nowrap;\n"])), function (props) { return (props.variant === 'point-log' ? 'var(--success)' : 'var(--warning)'); });
var StyledInactivatedItem = styled(StyledItem)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  opacity: 0.5;\n"], ["\n  opacity: 0.5;\n"])));
var StyledInactivatedLabel = styled(StyledLabel)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  background-color: var(--gray);\n"], ["\n  background-color: var(--gray);\n"])));
var EmptyBlock = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  padding: 12.5rem 0;\n  color: var(--gray-dark);\n  font-size: 14px;\n  text-align: center;\n"], ["\n  padding: 12.5rem 0;\n  color: var(--gray-dark);\n  font-size: 14px;\n  text-align: center;\n"])));
var PointHistoryAdminPage = function () {
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var _a = useApp(), loading = _a.loading, enabledModules = _a.enabledModules;
    if (loading) {
        return React.createElement(LoadingPage, null);
    }
    if (!enabledModules.point) {
        return React.createElement(NotFoundPage, null);
    }
    return (React.createElement(MemberAdminLayout, null,
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { src: PointIcon, className: "mr-3" }),
            React.createElement("span", null, formatMessage(commonMessages.content.pointsAdmin))),
        currentMemberId && React.createElement(PointSummaryCard, { memberId: currentMemberId }),
        currentMemberId && React.createElement(PointHistoryCollectionTabs, { memberId: currentMemberId })));
};
var PointSummaryCard = function (_a) {
    var memberId = _a.memberId;
    var formatMessage = useIntl().formatMessage;
    var settings = useApp().settings;
    var ownedPoints = usePointStatus(memberId).ownedPoints;
    var pointUnit = settings['point.unit'] || formatMessage(messages.unitOfPoints);
    return (React.createElement(AdminCard, { className: "mb-4" },
        React.createElement("div", { className: "mb-2" },
            React.createElement(StyledCardText, null, formatMessage(messages.currentOwnedPoints))),
        React.createElement("div", null,
            React.createElement(StyledNumber, { className: "mr-2" }, ownedPoints),
            React.createElement(StyledCardText, null, pointUnit))));
};
var PointHistoryCollectionTabs = function (_a) {
    var memberId = _a.memberId;
    var formatMessage = useIntl().formatMessage;
    var settings = useApp().settings;
    var _b = usePointLogCollections(memberId), loadingPointLogs = _b.loadingPointLogs, errorPointLogs = _b.errorPointLogs, pointLogs = _b.pointLogs, refetchPointLogs = _b.refetchPointLogs, fetchMorePointLogs = _b.fetchMorePointLogs;
    var _c = useOrderLogWithPointsCollection(memberId), loadingOrderLogs = _c.loadingOrderLogs, errorOrderLogs = _c.errorOrderLogs, orderLogs = _c.orderLogs, refetchOrderLogs = _c.refetchOrderLogs, fetchMoreOrderLogs = _c.fetchMoreOrderLogs;
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    if (errorPointLogs || errorOrderLogs) {
        message.error(formatMessage(commonMessages.status.readingError));
    }
    var pointUnit = settings['point.unit'] || formatMessage(messages.unitOfPoints);
    return (React.createElement(Tabs, { defaultActiveKey: "points-log", onChange: function () {
            refetchPointLogs();
            refetchOrderLogs();
        } },
        React.createElement(Tabs.TabPane, { key: "point-logs", tab: formatMessage(messages.pointHistory), className: "pt-2" }, loadingPointLogs ? (React.createElement(Skeleton, { active: true })) : pointLogs.length === 0 ? (React.createElement(EmptyBlock, null, formatMessage(messages.noPointLog))) : (React.createElement(AdminCard, { className: "mb-5" },
            pointLogs.map(function (pointLog) {
                return pointLog.endedAt && pointLog.endedAt < new Date() ? (React.createElement(StyledInactivatedItem, { key: pointLog.id, className: "d-flex align-items-center" },
                    React.createElement("div", { className: "flex-shrink-0 mr-5" }, moment(pointLog.createdAt).format('YYYY/MM/DD')),
                    React.createElement("div", { className: "flex-grow-1" },
                        React.createElement("div", null, pointLog.description),
                        React.createElement(StyledDescription, null, pointLog.endedAt
                            ? formatMessage(messages.dueAt, { date: moment(pointLog.endedAt).format('YYYY/MM/DD') })
                            : formatMessage(messages.unlimited))),
                    React.createElement("div", { className: "flex-shrink-0 ml-5" },
                        React.createElement(StyledInactivatedLabel, { variant: "point-log" },
                            pointLog.points > 0 && '+',
                            pointLog.points,
                            " ",
                            pointUnit)))) : (React.createElement(StyledItem, { key: pointLog.id, className: "d-flex align-items-center" },
                    React.createElement("div", { className: "flex-shrink-0 mr-5" }, moment(pointLog.createdAt).format('YYYY/MM/DD')),
                    React.createElement("div", { className: "flex-grow-1" },
                        React.createElement("div", null, pointLog.description),
                        React.createElement(StyledDescription, null, pointLog.endedAt
                            ? formatMessage(messages.dueAt, { date: moment(pointLog.endedAt).format('YYYY/MM/DD') })
                            : formatMessage(messages.unlimited))),
                    React.createElement("div", { className: "flex-shrink-0 ml-5" },
                        React.createElement(StyledLabel, { variant: "point-log" },
                            pointLog.points > 0 && '+',
                            pointLog.points,
                            " ",
                            pointUnit))));
            }),
            fetchMorePointLogs && (React.createElement("div", { className: "text-center mt-4" },
                React.createElement(Button, { loading: loading, onClick: function () {
                        setLoading(true);
                        fetchMorePointLogs().finally(function () { return setLoading(false); });
                    } }, formatMessage(messages.viewMore))))))),
        React.createElement(Tabs.TabPane, { key: "order-log", tab: formatMessage(messages.orderHistory), className: "pt-2" }, loadingOrderLogs ? (React.createElement(Skeleton, { active: true })) : orderLogs.length === 0 ? (React.createElement(EmptyBlock, null, formatMessage(messages.noPointLog))) : (React.createElement(AdminCard, { className: "mb-5" },
            orderLogs.map(function (orderLog) { return (React.createElement(StyledItem, { key: orderLog.id, className: "d-flex align-items-center" },
                React.createElement("div", { className: "flex-shrink-0 mr-5" }, moment(orderLog.createdAt).format('YYYY/MM/DD')),
                React.createElement("div", { className: "flex-grow-1" }, orderLog.title),
                React.createElement("div", { className: "flex-shrink-0 ml-5" },
                    React.createElement(StyledLabel, { variant: "order-log" },
                        "-",
                        orderLog.points,
                        " ",
                        pointUnit)))); }),
            fetchMoreOrderLogs && (React.createElement("div", { className: "text-center mt-4" },
                React.createElement(Button, { loading: loading, onClick: function () {
                        setLoading(true);
                        fetchMoreOrderLogs().finally(function () { return setLoading(false); });
                    } }, formatMessage(messages.viewMore)))))))));
};
var usePointStatus = function (memberId) {
    var _a;
    var data = useQuery(gql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n      query GET_POINT_STATUS($memberId: String!) {\n        point_status(where: { member_id: { _eq: $memberId } }) {\n          points\n        }\n      }\n    "], ["\n      query GET_POINT_STATUS($memberId: String!) {\n        point_status(where: { member_id: { _eq: $memberId } }) {\n          points\n        }\n      }\n    "]))), {
        variables: { memberId: memberId },
    }).data;
    return {
        ownedPoints: ((_a = data === null || data === void 0 ? void 0 : data.point_status[0]) === null || _a === void 0 ? void 0 : _a.points) || 0,
    };
};
var usePointLogCollections = function (memberId) {
    var _a = useQuery(gql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n      query GET_POINT_LOG_COLLECTION($memberId: String!, $current: timestamptz!, $offset: Int) {\n        point_log(\n          where: {\n            member_id: { _eq: $memberId }\n            _or: [{ started_at: { _lte: $current } }, { started_at: { _is_null: true } }]\n          }\n          order_by: { created_at: desc }\n          limit: 10\n          offset: $offset\n        ) {\n          id\n          description\n          created_at\n          ended_at\n          point\n        }\n      }\n    "], ["\n      query GET_POINT_LOG_COLLECTION($memberId: String!, $current: timestamptz!, $offset: Int) {\n        point_log(\n          where: {\n            member_id: { _eq: $memberId }\n            _or: [{ started_at: { _lte: $current } }, { started_at: { _is_null: true } }]\n          }\n          order_by: { created_at: desc }\n          limit: 10\n          offset: $offset\n        ) {\n          id\n          description\n          created_at\n          ended_at\n          point\n        }\n      }\n    "]))), {
        variables: {
            memberId: memberId,
            current: useRef(new Date()).current,
        },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch, fetchMore = _a.fetchMore;
    var _b = useState(false), isNoMore = _b[0], setIsNoMore = _b[1];
    var pointLogs = loading || error || !data
        ? []
        : data.point_log.map(function (pointLog) { return ({
            id: pointLog.id,
            description: pointLog.description,
            createdAt: new Date(pointLog.created_at),
            endedAt: pointLog.ended_at && new Date(pointLog.ended_at),
            points: pointLog.point,
        }); });
    return {
        loadingPointLogs: loading,
        errorPointLogs: error,
        pointLogs: pointLogs,
        refetchPointLogs: function () {
            setIsNoMore(false);
            return refetch();
        },
        fetchMorePointLogs: isNoMore
            ? undefined
            : function () {
                return fetchMore({
                    variables: { offset: (data === null || data === void 0 ? void 0 : data.point_log.length) || 0 },
                    updateQuery: function (prev, _a) {
                        var fetchMoreResult = _a.fetchMoreResult;
                        if (!fetchMoreResult) {
                            return prev;
                        }
                        if (fetchMoreResult.point_log.length < 10) {
                            setIsNoMore(true);
                        }
                        return __assign(__assign({}, prev), { point_log: __spreadArrays(prev.point_log, fetchMoreResult.point_log) });
                    },
                });
            },
    };
};
var useOrderLogWithPointsCollection = function (memberId) {
    var _a = useQuery(gql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n      query GET_ORDER_LOG_WITH_POINTS_COLLECTION($memberId: String!, $offset: Int) {\n        order_log(\n          where: { member_id: { _eq: $memberId }, order_discounts: { type: { _eq: \"Point\" } } }\n          order_by: { created_at: desc }\n          limit: 10\n          offset: $offset\n        ) {\n          id\n          created_at\n          order_discounts(where: { type: { _eq: \"Point\" } }, limit: 1) {\n            id\n            name\n          }\n          order_discounts_aggregate(where: { type: { _eq: \"Point\" } }) {\n            aggregate {\n              sum {\n                price\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_ORDER_LOG_WITH_POINTS_COLLECTION($memberId: String!, $offset: Int) {\n        order_log(\n          where: { member_id: { _eq: $memberId }, order_discounts: { type: { _eq: \"Point\" } } }\n          order_by: { created_at: desc }\n          limit: 10\n          offset: $offset\n        ) {\n          id\n          created_at\n          order_discounts(where: { type: { _eq: \"Point\" } }, limit: 1) {\n            id\n            name\n          }\n          order_discounts_aggregate(where: { type: { _eq: \"Point\" } }) {\n            aggregate {\n              sum {\n                price\n              }\n            }\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch, fetchMore = _a.fetchMore;
    var _b = useState(false), isNoMore = _b[0], setIsNoMore = _b[1];
    var orderLogs = loading || error || !data
        ? []
        : data.order_log.map(function (orderLog) {
            var _a, _b, _c;
            return ({
                id: orderLog.id,
                createdAt: new Date(orderLog.created_at),
                title: ((_a = orderLog.order_discounts[0]) === null || _a === void 0 ? void 0 : _a.name) || '',
                points: ((_c = (_b = orderLog.order_discounts_aggregate.aggregate) === null || _b === void 0 ? void 0 : _b.sum) === null || _c === void 0 ? void 0 : _c.price) || 0,
            });
        });
    return {
        loadingOrderLogs: loading,
        errorOrderLogs: error,
        orderLogs: orderLogs,
        refetchOrderLogs: function () {
            setIsNoMore(false);
            return refetch();
        },
        fetchMoreOrderLogs: isNoMore
            ? undefined
            : function () {
                return fetchMore({
                    variables: { offset: (data === null || data === void 0 ? void 0 : data.order_log.length) || 0 },
                    updateQuery: function (prev, _a) {
                        var fetchMoreResult = _a.fetchMoreResult;
                        if (!fetchMoreResult) {
                            return prev;
                        }
                        if (fetchMoreResult.order_log.length < 10) {
                            setIsNoMore(true);
                        }
                        return __assign(__assign({}, prev), { order_log: __spreadArrays(prev.order_log, fetchMoreResult.order_log) });
                    },
                });
            },
    };
};
export default PointHistoryAdminPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
//# sourceMappingURL=PointHistoryAdminPage.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Button, Icon, Typography } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga';
import { useIntl } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
import { BooleanParam, useQueryParam } from 'use-query-params';
import AdminCard from '../components/common/AdminCard';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { commonMessages } from '../helpers/translation';
import ForbiddenPage from './ForbiddenPage';
import LoadingPage from './LoadingPage';
var OrderPage = function () {
    var formatMessage = useIntl().formatMessage;
    var orderId = useParams().orderId;
    var withTracking = useQueryParam('tracking', BooleanParam)[0];
    var settings = useApp().settings;
    var _a = useQuery(GET_ORDERS_PRODUCT, {
        variables: { orderId: orderId },
    }), loading = _a.loading, data = _a.data;
    var order = data && data.order_log_by_pk;
    // TODO: get orderId and show items
    useEffect(function () {
        var _a, _b, _c, _d, _e, _f;
        if (order && withTracking) {
            var productPrice = ((_c = (_b = (_a = order.order_products_aggregate) === null || _a === void 0 ? void 0 : _a.aggregate) === null || _b === void 0 ? void 0 : _b.sum) === null || _c === void 0 ? void 0 : _c.price) || 0;
            var discountPrice = ((_f = (_e = (_d = order.order_discounts_aggregate) === null || _d === void 0 ? void 0 : _d.aggregate) === null || _e === void 0 ? void 0 : _e.sum) === null || _f === void 0 ? void 0 : _f.price) || 0;
            var shippingFee = (order.shipping && order.shipping['fee']) || 0;
            settings['tracking.fb_pixel_id'] &&
                order.status === 'SUCCESS' &&
                ReactPixel.track('Purchase', {
                    value: productPrice - discountPrice - shippingFee,
                    currency: 'TWD',
                });
            if (settings['tracking.ga_id'] && order.status === 'SUCCESS') {
                ;
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    transactionId: order.id,
                    transactionTotal: productPrice - discountPrice - shippingFee,
                    transactionShipping: shippingFee,
                    transactionProducts: order.order_products.map(function (order_product) {
                        var _a = order_product.product_id.split('_'), productType = _a[0], productId = _a[1];
                        return {
                            sku: productId,
                            name: order_product.name,
                            category: productType,
                            price: "" + order_product.price,
                            quantity: "" + (order_product.options ? order_product.options['quantity'] || 1 : 1),
                            currency: 'TWD',
                        };
                    }),
                });
                ReactGA.plugin.execute('ecommerce', 'addTransaction', {
                    id: order.id,
                    revenue: productPrice - discountPrice - shippingFee,
                    shipping: shippingFee,
                });
                for (var _i = 0, _g = order.order_products; _i < _g.length; _i++) {
                    var order_product = _g[_i];
                    var _h = order_product.product_id.split('_'), productType = _h[0], productId = _h[1];
                    ReactGA.plugin.execute('ecommerce', 'addItem', {
                        id: order.id,
                        sku: productId,
                        name: order_product.name,
                        category: productType,
                        price: "" + order_product.price,
                        quantity: "" + (order_product.options ? order_product.options['quantity'] || 1 : 1),
                        currency: 'TWD',
                    });
                    ReactGA.plugin.execute('ec', 'addProduct', {
                        id: productId,
                        name: order_product.name,
                        category: productType,
                        price: "" + order_product.price,
                        quantity: "" + (order_product.options ? order_product.options['quantity'] || 1 : 1),
                        currency: 'TWD',
                    });
                }
                ReactGA.plugin.execute('ec', 'setAction', 'purchase', {
                    id: order.id,
                    revenue: productPrice - discountPrice - shippingFee,
                    shipping: shippingFee,
                    coupon: order.order_discounts.length > 0
                        ? order.order_discounts[0].type === 'Coupon'
                            ? order.order_discounts[0].target
                            : null
                        : null,
                });
                ReactGA.plugin.execute('ecommerce', 'send', {});
                ReactGA.plugin.execute('ecommerce', 'clear', {});
                ReactGA.ga('send', 'pageview');
            }
        }
    }, [orderId, order, withTracking, settings]);
    if (loading) {
        return React.createElement(LoadingPage, null);
    }
    if (!(data === null || data === void 0 ? void 0 : data.order_log_by_pk)) {
        return React.createElement(ForbiddenPage, null);
    }
    return (React.createElement(DefaultLayout, { noFooter: true },
        React.createElement("div", { className: "container d-flex align-items-center justify-content-center", style: { height: 'calc(100vh - 64px)' } },
            React.createElement(AdminCard, { style: { paddingTop: '3.5rem', paddingBottom: '3.5rem' } },
                React.createElement("div", { className: "d-flex flex-column align-items-center justify-content-center px-sm-5" },
                    data.order_log_by_pk.status === 'SUCCESS' ? (React.createElement(React.Fragment, null,
                        React.createElement(Icon, { className: "mb-5", type: "check-circle", theme: "twoTone", twoToneColor: "#4ed1b3", style: { fontSize: '4rem' } }),
                        React.createElement(Typography.Title, { level: 4, className: "mb-3" }, formatMessage(commonMessages.title.purchasedItemAvailable)),
                        React.createElement(Typography.Text, { className: "mb-4" }, formatMessage(commonMessages.content.atm)))) : (React.createElement(React.Fragment, null,
                        React.createElement(Icon, { className: "mb-5", type: "close-circle", theme: "twoTone", twoToneColor: "#ff7d62", style: { fontSize: '4rem' } }),
                        React.createElement(Typography.Title, { level: 4, className: "mb-3" }, formatMessage(commonMessages.title.paymentFail)),
                        React.createElement(Typography.Title, { level: 4, className: "mb-3" }, formatMessage(commonMessages.title.creditCardConfirm)))),
                    React.createElement(Link, { to: "/" },
                        React.createElement(Button, null, formatMessage(commonMessages.button.home))))))));
};
export default OrderPage;
var GET_ORDERS_PRODUCT = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_ORDERS_PRODUCT($orderId: String!) {\n    order_log_by_pk(id: $orderId) {\n      id\n      message\n      status\n      order_discounts_aggregate {\n        aggregate {\n          sum {\n            price\n          }\n        }\n      }\n      order_products_aggregate {\n        aggregate {\n          sum {\n            price\n          }\n        }\n      }\n      order_products {\n        id\n        product_id\n        name\n        price\n        options\n      }\n      order_discounts {\n        type\n        target\n      }\n      shipping\n      invoice\n    }\n  }\n"], ["\n  query GET_ORDERS_PRODUCT($orderId: String!) {\n    order_log_by_pk(id: $orderId) {\n      id\n      message\n      status\n      order_discounts_aggregate {\n        aggregate {\n          sum {\n            price\n          }\n        }\n      }\n      order_products_aggregate {\n        aggregate {\n          sum {\n            price\n          }\n        }\n      }\n      order_products {\n        id\n        product_id\n        name\n        price\n        options\n      }\n      order_discounts {\n        type\n        target\n      }\n      shipping\n      invoice\n    }\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=OrderPage.js.map
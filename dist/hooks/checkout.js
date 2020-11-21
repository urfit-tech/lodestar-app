var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useQuery } from '@apollo/react-hooks';
import Axios from 'axios';
import gql from 'graphql-tag';
import { prop, sum } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useAuth } from '../components/auth/AuthContext';
import { useApp } from '../containers/common/AppContext';
export var useCheck = function (productIds, discountId, shipping, options) {
    var _a;
    var _b = useAuth(), authToken = _b.authToken, backendEndpoint = _b.backendEndpoint;
    var appId = useApp().id;
    var _c = useState({ orderProducts: [], orderDiscounts: [], shippingOption: null }), check = _c[0], setCheck = _c[1];
    var _d = useState(false), orderChecking = _d[0], setOrderChecking = _d[1];
    var _e = useState(false), orderPlacing = _e[0], setOrderPlacing = _e[1];
    var _f = useState(null), checkError = _f[0], setCheckError = _f[1];
    useEffect(function () {
        setOrderChecking(true);
        Axios.post(backendEndpoint + "/payment/checkout-order", {
            appId: appId,
            productIds: productIds,
            discountId: discountId,
            shipping: shipping,
            options: options,
        }, {
            headers: { authorization: "Bearer " + authToken },
        })
            .then(function (_a) {
            var _b = _a.data, code = _b.code, message = _b.message, result = _b.result;
            if (code === 'SUCCESS') {
                setCheck(result);
            }
            else {
                setCheckError(new Error(message));
            }
        })
            .catch(setCheckError)
            .finally(function () { return setOrderChecking(false); });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        appId,
        authToken,
        backendEndpoint,
        discountId,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(options),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(productIds),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(shipping),
    ]);
    var placeOrder = useCallback(function (paymentType, invoice) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setOrderPlacing(true);
            return [2 /*return*/, Axios.post(backendEndpoint + "/tasks/order", {
                    paymentModel: { type: paymentType },
                    productIds: productIds,
                    discountId: discountId,
                    shipping: shipping,
                    invoice: invoice,
                    options: options,
                }, {
                    headers: { authorization: "Bearer " + authToken },
                })
                    .then(function (_a) {
                    var _b = _a.data, code = _b.code, result = _b.result, message = _b.message;
                    if (code === 'SUCCESS') {
                        ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 4 });
                        ReactGA.ga('send', 'pageview');
                        return result.id;
                    }
                    else {
                        throw new Error(message);
                    }
                })
                    .finally(function () { return setOrderPlacing(false); })];
        });
    }); }, [authToken, backendEndpoint, discountId, options, productIds, shipping]);
    return {
        check: check,
        checkError: checkError,
        orderPlacing: orderPlacing,
        orderChecking: orderChecking,
        placeOrder: placeOrder,
        totalPrice: sum(check.orderProducts.map(prop('price'))) -
            sum(check.orderDiscounts.map(prop('price'))) +
            (((_a = check.shippingOption) === null || _a === void 0 ? void 0 : _a.fee) || 0),
    };
};
export var useOrderProduct = function (orderProductId) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_ORDER_PRODUCT($orderProductId: uuid!) {\n        order_product_by_pk(id: $orderProductId) {\n          id\n          name\n          description\n          created_at\n          product {\n            id\n            type\n            target\n          }\n          order_log {\n            id\n            member_id\n            invoice\n          }\n        }\n      }\n    "], ["\n      query GET_ORDER_PRODUCT($orderProductId: uuid!) {\n        order_product_by_pk(id: $orderProductId) {\n          id\n          name\n          description\n          created_at\n          product {\n            id\n            type\n            target\n          }\n          order_log {\n            id\n            member_id\n            invoice\n          }\n        }\n      }\n    "]))), { variables: { orderProductId: orderProductId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var orderProduct = loading || error || !data || !data.order_product_by_pk
        ? {
            id: '',
            name: '',
            description: '',
            createAt: null,
            product: {
                id: '',
                type: '',
                target: '',
            },
            memberId: '',
            invoice: {},
        }
        : {
            id: data.order_product_by_pk.id,
            name: data.order_product_by_pk.name,
            description: data.order_product_by_pk.description || '',
            createAt: new Date(data.order_product_by_pk.created_at),
            product: data.order_product_by_pk.product,
            memberId: data.order_product_by_pk.order_log.member_id,
            invoice: data.order_product_by_pk.order_log.invoice,
        };
    return {
        loadingOrderProduct: loading,
        errorOrderProduct: error,
        orderProduct: orderProduct,
        refetchOrderProduct: refetch,
    };
};
export var useMemberShop = function (id) {
    var _a;
    var _b = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_MEMBER_SHOP($shopId: uuid!) {\n        member_shop_by_pk(id: $shopId) {\n          id\n          title\n          shipping_methods\n          member {\n            id\n            picture_url\n          }\n        }\n      }\n    "], ["\n      query GET_MEMBER_SHOP($shopId: uuid!) {\n        member_shop_by_pk(id: $shopId) {\n          id\n          title\n          shipping_methods\n          member {\n            id\n            picture_url\n          }\n        }\n      }\n    "]))), { variables: { shopId: id } }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var memberShop = loading || error || !data || !data.member_shop_by_pk
        ? null
        : {
            id: data.member_shop_by_pk.id,
            title: data.member_shop_by_pk.title,
            shippingMethods: data.member_shop_by_pk.shipping_methods,
            pictureUrl: (_a = data.member_shop_by_pk.member) === null || _a === void 0 ? void 0 : _a.picture_url,
        };
    return {
        loadingMemberShop: loading,
        errorMemberShop: error,
        memberShop: memberShop,
        refetchMemberShop: refetch,
    };
};
export var useCartProjectPlanCollection = function (cartProjectPlanIds) {
    var _a = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_CART_PROJECT_PLAN_COLLECTION($cartProjectPlanIds: [uuid!]!) {\n        project_plan(where: { id: { _in: $cartProjectPlanIds } }) {\n          id\n          is_physical\n        }\n      }\n    "], ["\n      query GET_CART_PROJECT_PLAN_COLLECTION($cartProjectPlanIds: [uuid!]!) {\n        project_plan(where: { id: { _in: $cartProjectPlanIds } }) {\n          id\n          is_physical\n        }\n      }\n    "]))), {
        variables: {
            cartProjectPlanIds: cartProjectPlanIds,
        },
    }), loading = _a.loading, error = _a.error, data = _a.data;
    var cartProjectPlans = loading || error || !data
        ? []
        : data.project_plan.map(function (projectPlan) { return ({
            id: projectPlan.id,
            isPhysical: projectPlan.is_physical,
        }); });
    return {
        loading: loading,
        error: error,
        cartProjectPlans: cartProjectPlans,
    };
};
export var usePhysicalProductCollection = function (productIds) {
    var _a, _b, _c, _d;
    var _e = useQuery(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      query GET_PHYSICAL_PRODUCTS($productIds: [uuid!]!) {\n        project_plan_aggregate(where: { id: { _in: $productIds }, is_physical: { _eq: true } }) {\n          aggregate {\n            count\n          }\n        }\n        merchandise_spec_aggregate(where: { id: { _in: $productIds }, merchandise: { is_physical: { _eq: true } } }) {\n          aggregate {\n            count\n          }\n        }\n      }\n    "], ["\n      query GET_PHYSICAL_PRODUCTS($productIds: [uuid!]!) {\n        project_plan_aggregate(where: { id: { _in: $productIds }, is_physical: { _eq: true } }) {\n          aggregate {\n            count\n          }\n        }\n        merchandise_spec_aggregate(where: { id: { _in: $productIds }, merchandise: { is_physical: { _eq: true } } }) {\n          aggregate {\n            count\n          }\n        }\n      }\n    "]))), {
        variables: {
            productIds: productIds,
        },
    }), loading = _e.loading, error = _e.error, data = _e.data;
    var hasPhysicalProduct = loading || error || !data
        ? false
        : !!((_b = (_a = data === null || data === void 0 ? void 0 : data.project_plan_aggregate) === null || _a === void 0 ? void 0 : _a.aggregate) === null || _b === void 0 ? void 0 : _b.count) || !!((_d = (_c = data === null || data === void 0 ? void 0 : data.merchandise_spec_aggregate) === null || _c === void 0 ? void 0 : _c.aggregate) === null || _d === void 0 ? void 0 : _d.count);
    return {
        loading: loading,
        error: error,
        hasPhysicalProduct: hasPhysicalProduct,
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=checkout.js.map
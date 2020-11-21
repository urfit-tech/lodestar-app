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
import gql from 'graphql-tag';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../containers/common/AppContext';
import LanguageContext from '../contexts/LanguageContext';
import { GET_NOTIFICATIONS } from '../contexts/NotificationContext';
export var useNotifications = function (limit) {
    var _a;
    var _b = useQuery(GET_NOTIFICATIONS, { variables: { limit: limit } }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var notifications = loading || error || !data
        ? []
        : data.notification.map(function (notification) { return ({
            id: notification.id,
            description: notification.description,
            type: notification.type,
            referenceUrl: notification.reference_url,
            extra: notification.extra,
            avatar: notification.avatar,
            readAt: notification.read_at ? new Date(notification.read_at) : null,
            updatedAt: new Date(notification.updated_at),
        }); });
    return {
        loadingNotifications: loading,
        errorNotifications: error,
        notifications: notifications,
        unreadCount: (_a = data === null || data === void 0 ? void 0 : data.notification_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count,
        refetchNotifications: refetch,
    };
};
export var useCouponCollection = function (memberId) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_COUPON_COLLECTION($memberId: String!) {\n        coupon(where: { member_id: { _eq: $memberId } }) {\n          id\n          status {\n            outdated\n            used\n          }\n          coupon_code {\n            code\n            coupon_plan {\n              id\n              title\n              amount\n              type\n              constraint\n              started_at\n              ended_at\n              description\n              scope\n              coupon_plan_products {\n                id\n                product_id\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_COUPON_COLLECTION($memberId: String!) {\n        coupon(where: { member_id: { _eq: $memberId } }) {\n          id\n          status {\n            outdated\n            used\n          }\n          coupon_code {\n            code\n            coupon_plan {\n              id\n              title\n              amount\n              type\n              constraint\n              started_at\n              ended_at\n              description\n              scope\n              coupon_plan_products {\n                id\n                product_id\n              }\n            }\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var coupons = loading || error || !data
        ? []
        : data.coupon.map(function (coupon) {
            var _a, _b;
            return ({
                id: coupon.id,
                status: {
                    used: ((_a = coupon.status) === null || _a === void 0 ? void 0 : _a.used) || false,
                    outdated: ((_b = coupon.status) === null || _b === void 0 ? void 0 : _b.outdated) || false,
                },
                couponCode: {
                    code: coupon.coupon_code.code,
                    couponPlan: {
                        id: coupon.coupon_code.coupon_plan.id,
                        startedAt: coupon.coupon_code.coupon_plan.started_at
                            ? new Date(coupon.coupon_code.coupon_plan.started_at)
                            : null,
                        endedAt: coupon.coupon_code.coupon_plan.ended_at
                            ? new Date(coupon.coupon_code.coupon_plan.ended_at)
                            : null,
                        type: coupon.coupon_code.coupon_plan.type === 1
                            ? 'cash'
                            : coupon.coupon_code.coupon_plan.type === 2
                                ? 'percent'
                                : 'cash',
                        constraint: coupon.coupon_code.coupon_plan.constraint,
                        amount: coupon.coupon_code.coupon_plan.amount,
                        title: coupon.coupon_code.coupon_plan.title,
                        description: coupon.coupon_code.coupon_plan.description,
                        count: 0,
                        remaining: 0,
                        scope: coupon.coupon_code.coupon_plan.scope,
                        productIds: coupon.coupon_code.coupon_plan.coupon_plan_products.map(function (couponPlanProduct) { return couponPlanProduct.product_id; }),
                    },
                },
            });
        });
    return {
        loadingCoupons: loading,
        errorCoupons: error,
        coupons: coupons,
        refetchCoupons: refetch,
    };
};
export var useEnrolledProductIds = function (memberId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_ENROLLED_PRODUCTS($memberId: String!) {\n        product_enrollment(where: { member_id: { _eq: $memberId } }) {\n          product_id\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PRODUCTS($memberId: String!) {\n        product_enrollment(where: { member_id: { _eq: $memberId } }) {\n          product_id\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledProductIds = loading || error || !data
        ? []
        : data.product_enrollment.map(function (productEnrollment) { return productEnrollment.product_id || ''; }).filter(function (v) { return v; });
    return {
        loadingProductIds: loading,
        errorProductIds: error,
        enrolledProductIds: enrolledProductIds,
        refetchProgramIds: refetch,
    };
};
export var useNav = function () {
    var _a;
    var location = useLocation();
    var navs = useApp().navs;
    var currentLanguage = useContext(LanguageContext).currentLanguage;
    return {
        navs: navs.filter(function (nav) { return nav.locale === currentLanguage; }),
        pageTitle: (_a = navs.filter(function (nav) {
            return nav.locale === currentLanguage && nav.block === 'header' && nav.href === location.pathname + location.search;
        })[0]) === null || _a === void 0 ? void 0 : _a.label,
    };
};
export var useMemberContract = function (memberContractId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var GET_MEMBER_CONTRACT = gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    query GET_MEMBER_CONTRACT($memberContractId: uuid!) {\n      member_contract_by_pk(id: $memberContractId) {\n        started_at\n        ended_at\n        values\n        agreed_at\n        agreed_ip\n        revoked_at\n        agreed_options\n        contract {\n          name\n          description\n          template\n        }\n      }\n    }\n  "], ["\n    query GET_MEMBER_CONTRACT($memberContractId: uuid!) {\n      member_contract_by_pk(id: $memberContractId) {\n        started_at\n        ended_at\n        values\n        agreed_at\n        agreed_ip\n        revoked_at\n        agreed_options\n        contract {\n          name\n          description\n          template\n        }\n      }\n    }\n  "])));
    var _l = useQuery(GET_MEMBER_CONTRACT, {
        variables: { memberContractId: memberContractId },
    }), data = _l.data, result = __rest(_l, ["data"]);
    return __assign(__assign({}, result), { memberContract: {
            startedAt: ((_a = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _a === void 0 ? void 0 : _a.started_at) || null,
            endedAt: ((_b = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _b === void 0 ? void 0 : _b.ended_at) || null,
            values: (_c = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _c === void 0 ? void 0 : _c.values,
            agreedAt: ((_d = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _d === void 0 ? void 0 : _d.agreed_at) || null,
            agreedIp: ((_e = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _e === void 0 ? void 0 : _e.agreed_ip) || null,
            agreedOptions: ((_f = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _f === void 0 ? void 0 : _f.agreed_options) || {},
            revokedAt: ((_g = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _g === void 0 ? void 0 : _g.revoked_at) || null,
            contract: {
                name: ((_h = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _h === void 0 ? void 0 : _h.contract.name) || '',
                description: ((_j = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _j === void 0 ? void 0 : _j.contract.description) || '',
                template: ((_k = data === null || data === void 0 ? void 0 : data.member_contract_by_pk) === null || _k === void 0 ? void 0 : _k.contract.template) || '',
            },
        } });
};
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=data.js.map
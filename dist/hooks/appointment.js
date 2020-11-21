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
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
export var useAppointmentPlanCollection = function (memberId, startedAt) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_APPOINTMENT_PLAN_COLLECTION($memberId: String!, $startedAt: timestamptz) {\n        appointment_plan(where: { creator_id: { _eq: $memberId }, published_at: { _is_null: false } }) {\n          id\n          title\n          description\n          duration\n          price\n          support_locales\n          currency {\n            id\n            label\n            unit\n            name\n          }\n          appointment_periods(\n            where: { available: { _eq: true }, started_at: { _gt: $startedAt } }\n            order_by: { started_at: asc }\n          ) {\n            started_at\n            ended_at\n            booked\n          }\n        }\n      }\n    "], ["\n      query GET_APPOINTMENT_PLAN_COLLECTION($memberId: String!, $startedAt: timestamptz) {\n        appointment_plan(where: { creator_id: { _eq: $memberId }, published_at: { _is_null: false } }) {\n          id\n          title\n          description\n          duration\n          price\n          support_locales\n          currency {\n            id\n            label\n            unit\n            name\n          }\n          appointment_periods(\n            where: { available: { _eq: true }, started_at: { _gt: $startedAt } }\n            order_by: { started_at: asc }\n          ) {\n            started_at\n            ended_at\n            booked\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId, startedAt: startedAt } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var appointmentPlans = loading || error || !data
        ? []
        : data.appointment_plan.map(function (appointmentPlan) { return ({
            id: appointmentPlan.id,
            title: appointmentPlan.title,
            description: appointmentPlan.description,
            duration: appointmentPlan.duration,
            price: appointmentPlan.price,
            phone: null,
            supportLocales: appointmentPlan.support_locales,
            currency: {
                id: appointmentPlan.currency.id,
                label: appointmentPlan.currency.label,
                unit: appointmentPlan.currency.unit,
                name: appointmentPlan.currency.name,
            },
            periods: appointmentPlan.appointment_periods.map(function (period) { return ({
                id: "" + period.started_at,
                startedAt: new Date(period.started_at),
                endedAt: new Date(period.ended_at),
                booked: !!period.booked,
            }); }),
        }); });
    return {
        loadingAppointmentPlans: loading,
        errorAppointmentPlans: error,
        appointmentPlans: appointmentPlans,
        refetchAppointmentPlans: refetch,
    };
};
export var useEnrolledAppointmentCollection = function (memberId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_ENROLLED_APPOINTMENT_PLAN($memberId: String) {\n        appointment_enrollment(where: { member_id: { _eq: $memberId } }, order_by: { started_at: desc }) {\n          started_at\n          ended_at\n          canceled_at\n          order_product_id\n          issue\n          member {\n            id\n            name\n            picture_url\n          }\n          appointment_plan {\n            id\n            title\n            creator {\n              id\n              picture_url\n              name\n              username\n            }\n          }\n          order_product {\n            id\n            deliverables\n            options\n          }\n        }\n      }\n    "], ["\n      query GET_ENROLLED_APPOINTMENT_PLAN($memberId: String) {\n        appointment_enrollment(where: { member_id: { _eq: $memberId } }, order_by: { started_at: desc }) {\n          started_at\n          ended_at\n          canceled_at\n          order_product_id\n          issue\n          member {\n            id\n            name\n            picture_url\n          }\n          appointment_plan {\n            id\n            title\n            creator {\n              id\n              picture_url\n              name\n              username\n            }\n          }\n          order_product {\n            id\n            deliverables\n            options\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId }, fetchPolicy: 'no-cache' }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledAppointments = loading || error || !data
        ? []
        : data.appointment_enrollment.map(function (enrollment) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ({
                title: enrollment.appointment_plan ? enrollment.appointment_plan.title : '',
                startedAt: new Date(enrollment.started_at),
                endedAt: new Date(enrollment.ended_at),
                canceledAt: enrollment.canceled_at ? new Date(enrollment.canceled_at) : null,
                creator: {
                    avatarUrl: ((_b = (_a = enrollment.appointment_plan) === null || _a === void 0 ? void 0 : _a.creator) === null || _b === void 0 ? void 0 : _b.picture_url) || null,
                    name: ((_d = (_c = enrollment.appointment_plan) === null || _c === void 0 ? void 0 : _c.creator) === null || _d === void 0 ? void 0 : _d.name) || ((_f = (_e = enrollment.appointment_plan) === null || _e === void 0 ? void 0 : _e.creator) === null || _f === void 0 ? void 0 : _f.username) || '',
                },
                member: {
                    name: ((_g = enrollment === null || enrollment === void 0 ? void 0 : enrollment.member) === null || _g === void 0 ? void 0 : _g.name) || '',
                    email: '',
                    phone: '',
                },
                appointmentUrl: (enrollment.order_product &&
                    enrollment.order_product.deliverables &&
                    enrollment.order_product.deliverables['join_url']) ||
                    '',
                appointmentIssue: enrollment.issue,
                orderProduct: {
                    id: enrollment.order_product_id,
                    options: (_h = enrollment.order_product) === null || _h === void 0 ? void 0 : _h.options,
                },
            });
        });
    return {
        loadingEnrolledAppointments: loading,
        errorEnrolledAppointments: error,
        enrolledAppointments: enrolledAppointments,
        refetchEnrolledAppointments: refetch,
    };
};
export var useUpdateAppointmentIssue = function (orderProductId, options) {
    var updateAppointmentIssue = useMutation(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    mutation UPDATE_APPOINTMENT_ISSUE($orderProductId: uuid!, $data: jsonb) {\n      update_order_product(where: { id: { _eq: $orderProductId } }, _set: { options: $data }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation UPDATE_APPOINTMENT_ISSUE($orderProductId: uuid!, $data: jsonb) {\n      update_order_product(where: { id: { _eq: $orderProductId } }, _set: { options: $data }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return function (appointmentIssue) {
        return updateAppointmentIssue({
            variables: {
                orderProductId: orderProductId,
                data: __assign(__assign({}, options), { appointmentIssue: appointmentIssue }),
            },
        });
    };
};
export var useCancelAppointment = function (orderProductId, options) {
    var cancelAppointment = useMutation(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    mutation CANCEL_APPOINTMENT($orderProductId: uuid!, $data: jsonb) {\n      update_order_product(where: { id: { _eq: $orderProductId } }, _set: { options: $data }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation CANCEL_APPOINTMENT($orderProductId: uuid!, $data: jsonb) {\n      update_order_product(where: { id: { _eq: $orderProductId } }, _set: { options: $data }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return function (reason) {
        return cancelAppointment({
            variables: {
                orderProductId: orderProductId,
                data: __assign(__assign({}, options), { appointmentCanceledAt: new Date(), appointmentCanceledReason: reason }),
            },
        });
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=appointment.js.map
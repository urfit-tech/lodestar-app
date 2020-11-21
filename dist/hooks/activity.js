var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { sum } from 'ramda';
export var usePublishedActivityCollection = function () {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query GET_PUBLISHED_ACTIVITY_COLLECTION {\n      activity(where: { published_at: { _is_null: false } }, order_by: [{ position: asc }, { published_at: desc }]) {\n        id\n        cover_url\n        title\n        published_at\n        is_participants_visible\n        organizer_id\n        support_locales\n        activity_categories {\n          id\n          category {\n            id\n            name\n          }\n        }\n        activity_enrollments_aggregate {\n          aggregate {\n            count\n          }\n        }\n        activity_sessions_aggregate {\n          aggregate {\n            min {\n              started_at\n            }\n            max {\n              ended_at\n            }\n          }\n        }\n        activity_tickets_aggregate {\n          aggregate {\n            sum {\n              count\n            }\n          }\n        }\n      }\n    }\n  "], ["\n    query GET_PUBLISHED_ACTIVITY_COLLECTION {\n      activity(where: { published_at: { _is_null: false } }, order_by: [{ position: asc }, { published_at: desc }]) {\n        id\n        cover_url\n        title\n        published_at\n        is_participants_visible\n        organizer_id\n        support_locales\n        activity_categories {\n          id\n          category {\n            id\n            name\n          }\n        }\n        activity_enrollments_aggregate {\n          aggregate {\n            count\n          }\n        }\n        activity_sessions_aggregate {\n          aggregate {\n            min {\n              started_at\n            }\n            max {\n              ended_at\n            }\n          }\n        }\n        activity_tickets_aggregate {\n          aggregate {\n            sum {\n              count\n            }\n          }\n        }\n      }\n    }\n  "])))), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var activities = loading || error || !data
        ? []
        : data.activity
            .filter(function (activity) { return activity.published_at && new Date(activity.published_at).getTime() < Date.now(); })
            .map(function (activity) {
            var _a, _b, _c, _d, _e, _f, _g;
            return ({
                id: activity.id,
                coverUrl: activity.cover_url,
                title: activity.title,
                description: '',
                isParticipantsVisible: activity.is_participants_visible,
                publishedAt: new Date(activity.published_at),
                startedAt: ((_b = (_a = activity.activity_sessions_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.min) === null || _b === void 0 ? void 0 : _b.started_at) &&
                    new Date(activity.activity_sessions_aggregate.aggregate.min.started_at),
                endedAt: ((_d = (_c = activity.activity_sessions_aggregate.aggregate) === null || _c === void 0 ? void 0 : _c.max) === null || _d === void 0 ? void 0 : _d.ended_at) &&
                    new Date(activity.activity_sessions_aggregate.aggregate.max.ended_at),
                organizerId: activity.organizer_id,
                supportLocales: activity.support_locales,
                categories: activity.activity_categories.map(function (activityCategory) { return ({
                    id: activityCategory.category.id,
                    name: activityCategory.category.name,
                }); }),
                participantCount: ((_e = activity.activity_enrollments_aggregate.aggregate) === null || _e === void 0 ? void 0 : _e.count) || 0,
                totalSeats: ((_g = (_f = activity.activity_tickets_aggregate.aggregate) === null || _f === void 0 ? void 0 : _f.sum) === null || _g === void 0 ? void 0 : _g.count) || 0,
            });
        });
    return {
        loadingActivities: loading,
        errorActivities: error,
        refetchActivities: refetch,
        activities: activities,
    };
};
export var useEnrolledActivityTickets = function (memberId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_ENROLLED_ACTIVITY_TICKETS($memberId: String!) {\n        activity_ticket_enrollment(where: { member_id: { _eq: $memberId } }) {\n          order_log_id\n          order_product_id\n          activity_ticket_id\n        }\n      }\n    "], ["\n      query GET_ENROLLED_ACTIVITY_TICKETS($memberId: String!) {\n        activity_ticket_enrollment(where: { member_id: { _eq: $memberId } }) {\n          order_log_id\n          order_product_id\n          activity_ticket_id\n        }\n      }\n    "]))), { variables: { memberId: memberId }, fetchPolicy: 'no-cache' }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledActivityTickets = loading || error || !data
        ? []
        : data.activity_ticket_enrollment.map(function (ticketEnrollment) { return ({
            orderLogId: ticketEnrollment.order_log_id || '',
            orderProductId: ticketEnrollment.order_product_id || '',
            activityTicketId: ticketEnrollment.activity_ticket_id,
        }); });
    return {
        loadingTickets: loading,
        errorTickets: error,
        refetchTickets: refetch,
        enrolledActivityTickets: enrolledActivityTickets,
    };
};
export var useActivitySession = function (sessionId) {
    var _a;
    var _b = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_ACTIVITY_SESSION($sessionId: uuid!) {\n        activity_session_by_pk(id: $sessionId) {\n          id\n          title\n          started_at\n          ended_at\n          location\n          description\n          threshold\n          activity {\n            is_participants_visible\n          }\n          activity_session_tickets {\n            activity_ticket {\n              count\n            }\n          }\n          activity_enrollments_aggregate {\n            aggregate {\n              count\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_ACTIVITY_SESSION($sessionId: uuid!) {\n        activity_session_by_pk(id: $sessionId) {\n          id\n          title\n          started_at\n          ended_at\n          location\n          description\n          threshold\n          activity {\n            is_participants_visible\n          }\n          activity_session_tickets {\n            activity_ticket {\n              count\n            }\n          }\n          activity_enrollments_aggregate {\n            aggregate {\n              count\n            }\n          }\n        }\n      }\n    "]))), {
        variables: {
            sessionId: sessionId,
        },
    }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var session = loading || error || !data || !data.activity_session_by_pk
        ? null
        : {
            id: data.activity_session_by_pk.id,
            title: data.activity_session_by_pk.title,
            startedAt: new Date(data.activity_session_by_pk.started_at),
            endedAt: new Date(data.activity_session_by_pk.ended_at),
            location: data.activity_session_by_pk.location,
            description: data.activity_session_by_pk.description,
            threshold: data.activity_session_by_pk.threshold,
            isParticipantsVisible: data.activity_session_by_pk.activity.is_participants_visible,
            maxAmount: sum(data.activity_session_by_pk.activity_session_tickets.map(function (sessionTicket) { var _a; return ((_a = sessionTicket.activity_ticket) === null || _a === void 0 ? void 0 : _a.count) || 0; })),
            enrollments: ((_a = data.activity_session_by_pk.activity_enrollments_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 0,
        };
    return {
        loadingSession: loading,
        errorSession: error,
        session: session,
        refetchSession: refetch,
    };
};
export var useActivityTicket = function (ticketId) {
    var _a = useQuery(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      query GET_TICKET($ticketId: uuid!) {\n        activity_ticket_by_pk(id: $ticketId) {\n          id\n          title\n          description\n          is_published\n          started_at\n          ended_at\n          count\n          price\n\n          activity_session_tickets(order_by: { activity_session: { started_at: asc } }) {\n            id\n            activity_session {\n              id\n              title\n              description\n              location\n              started_at\n              ended_at\n              threshold\n            }\n          }\n\n          activity {\n            id\n            title\n            is_participants_visible\n            cover_url\n            published_at\n            activity_categories {\n              id\n              category {\n                id\n                name\n              }\n              position\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_TICKET($ticketId: uuid!) {\n        activity_ticket_by_pk(id: $ticketId) {\n          id\n          title\n          description\n          is_published\n          started_at\n          ended_at\n          count\n          price\n\n          activity_session_tickets(order_by: { activity_session: { started_at: asc } }) {\n            id\n            activity_session {\n              id\n              title\n              description\n              location\n              started_at\n              ended_at\n              threshold\n            }\n          }\n\n          activity {\n            id\n            title\n            is_participants_visible\n            cover_url\n            published_at\n            activity_categories {\n              id\n              category {\n                id\n                name\n              }\n              position\n            }\n          }\n        }\n      }\n    "]))), {
        variables: { ticketId: ticketId },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var ticket = loading || error || !data || !data.activity_ticket_by_pk
        ? null
        : {
            id: data.activity_ticket_by_pk.id,
            startedAt: new Date(data.activity_ticket_by_pk.started_at),
            endedAt: new Date(data.activity_ticket_by_pk.ended_at),
            price: data.activity_ticket_by_pk.price,
            count: data.activity_ticket_by_pk.count,
            description: data.activity_ticket_by_pk.description,
            isPublished: data.activity_ticket_by_pk.is_published,
            title: data.activity_ticket_by_pk.title,
            sessionTickets: data.activity_ticket_by_pk.activity_session_tickets.map(function (activitySessionTicket) {
                var _a;
                return ({
                    id: activitySessionTicket.id,
                    session: {
                        id: activitySessionTicket.activity_session.id,
                        title: activitySessionTicket.activity_session.title,
                        description: activitySessionTicket.activity_session.description,
                        threshold: activitySessionTicket.activity_session.threshold,
                        startedAt: new Date(activitySessionTicket.activity_session.started_at),
                        endedAt: new Date(activitySessionTicket.activity_session.ended_at),
                        location: activitySessionTicket.activity_session.location,
                        activityId: ((_a = data.activity_ticket_by_pk) === null || _a === void 0 ? void 0 : _a.activity.id) || '',
                    },
                });
            }),
            activity: {
                id: data.activity_ticket_by_pk.activity.id,
                title: data.activity_ticket_by_pk.activity.title,
                coverUrl: data.activity_ticket_by_pk.activity.cover_url,
                categories: data.activity_ticket_by_pk.activity.activity_categories.map(function (activityCategory) { return ({
                    id: activityCategory.id,
                    category: {
                        id: activityCategory.category.id,
                        name: activityCategory.category.name,
                    },
                    position: activityCategory.position,
                }); }),
            },
        };
    return {
        loadingTicket: loading,
        errorTicket: error,
        ticket: ticket,
        refetchTicket: refetch,
    };
};
export var useActivityAttendance = function (memberId, activityTicketId) {
    var _a = useQuery(gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      query GET_ACTIVITY_ATTENDANCE($memberId: String!, $activityTicketId: uuid!) {\n        activity_enrollment(where: { member_id: { _eq: $memberId }, activity_ticket_id: { _eq: $activityTicketId } }) {\n          activity_session_id\n          attended\n        }\n      }\n    "], ["\n      query GET_ACTIVITY_ATTENDANCE($memberId: String!, $activityTicketId: uuid!) {\n        activity_enrollment(where: { member_id: { _eq: $memberId }, activity_ticket_id: { _eq: $activityTicketId } }) {\n          activity_session_id\n          attended\n        }\n      }\n    "]))), {
        variables: {
            memberId: memberId,
            activityTicketId: activityTicketId,
        },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var attendance = {};
    data &&
        data.activity_enrollment.forEach(function (enrollment) {
            enrollment.attended && (attendance[enrollment.activity_session_id] = enrollment.attended);
        });
    return {
        loadingAttendance: loading,
        errorAttendance: error,
        attendance: attendance,
        refetchAttendance: refetch,
    };
};
export var useAttendSession = function () {
    var attendActivitySession = useMutation(gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      mutation ATTEND_ACTIVITY_SESSION($orderProductId: uuid!, $activitySessionId: uuid!) {\n        insert_activity_attendance(\n          objects: { order_product_id: $orderProductId, activity_session_id: $activitySessionId }\n        ) {\n          affected_rows\n        }\n      }\n    "], ["\n      mutation ATTEND_ACTIVITY_SESSION($orderProductId: uuid!, $activitySessionId: uuid!) {\n        insert_activity_attendance(\n          objects: { order_product_id: $orderProductId, activity_session_id: $activitySessionId }\n        ) {\n          affected_rows\n        }\n      }\n    "]))))[0];
    var leaveActivitySession = useMutation(gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    mutation LEAVE_ACTIVITY_SESSION($orderProductId: uuid!, $activitySessionId: uuid!) {\n      delete_activity_attendance(\n        where: { order_product_id: { _eq: $orderProductId }, activity_session_id: { _eq: $activitySessionId } }\n      ) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation LEAVE_ACTIVITY_SESSION($orderProductId: uuid!, $activitySessionId: uuid!) {\n      delete_activity_attendance(\n        where: { order_product_id: { _eq: $orderProductId }, activity_session_id: { _eq: $activitySessionId } }\n      ) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return {
        attendActivitySession: attendActivitySession,
        leaveActivitySession: leaveActivitySession,
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=activity.js.map
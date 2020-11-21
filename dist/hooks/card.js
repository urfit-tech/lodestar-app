var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
export var useEnrolledMembershipCardIds = function (memberId) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_ENROLLED_CARD_IDS($memberId: String!) {\n        card_enrollment(where: { member_id: { _eq: $memberId } }) {\n          card_id\n        }\n      }\n    "], ["\n      query GET_ENROLLED_CARD_IDS($memberId: String!) {\n        card_enrollment(where: { member_id: { _eq: $memberId } }) {\n          card_id\n        }\n      }\n    "]))), {
        variables: { memberId: memberId },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledMembershipCardIds = loading || error || !data ? [] : data.card_enrollment.map(function (card) { return card.card_id; });
    return {
        loadingMembershipCardIds: loading,
        errorMembershipCardIds: error,
        enrolledMembershipCardIds: enrolledMembershipCardIds,
        refetchMembershipCardIds: refetch,
    };
};
export var useMembershipCard = function (cardId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_ENROLLED_CARD($cardId: uuid!) {\n        card_by_pk(id: $cardId) {\n          id\n          title\n          description\n          template\n          app_id\n        }\n      }\n    "], ["\n      query GET_ENROLLED_CARD($cardId: uuid!) {\n        card_by_pk(id: $cardId) {\n          id\n          title\n          description\n          template\n          app_id\n        }\n      }\n    "]))), { variables: { cardId: cardId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var membershipCard = loading || error || !data || !data.card_by_pk
        ? null
        : {
            id: data.card_by_pk.id,
            title: data.card_by_pk.title,
            description: data.card_by_pk.description,
            template: data.card_by_pk.template,
        };
    return {
        loadingMembershipCard: loading,
        errorMembershipCard: error,
        membershipCard: membershipCard,
        refetchMembershipCard: refetch,
    };
};
export var useEnrolledMembershipCards = function (memberId) {
    var _a = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_ENROLLED_CARDS($memberId: String!) {\n        card_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: card_id) {\n          card {\n            id\n            title\n            description\n            template\n          }\n          updated_at\n        }\n      }\n    "], ["\n      query GET_ENROLLED_CARDS($memberId: String!) {\n        card_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: card_id) {\n          card {\n            id\n            title\n            description\n            template\n          }\n          updated_at\n        }\n      }\n    "]))), {
        variables: { memberId: memberId },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledMembershipCards = loading || error || !data
        ? []
        : data.card_enrollment.map(function (cardEnrollment) {
            var _a, _b, _c, _d;
            return ({
                card: {
                    id: ((_a = cardEnrollment.card) === null || _a === void 0 ? void 0 : _a.id) || '',
                    title: ((_b = cardEnrollment.card) === null || _b === void 0 ? void 0 : _b.title) || '',
                    description: ((_c = cardEnrollment.card) === null || _c === void 0 ? void 0 : _c.description) || '',
                    template: ((_d = cardEnrollment.card) === null || _d === void 0 ? void 0 : _d.template) || '',
                },
                updatedAt: cardEnrollment.updated_at ? new Date(cardEnrollment.updated_at) : null,
            });
        });
    return {
        loadingMembershipCards: loading,
        errorMembershipCards: error,
        enrolledMembershipCards: enrolledMembershipCards,
        refetchMembershipCards: refetch,
    };
};
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=card.js.map
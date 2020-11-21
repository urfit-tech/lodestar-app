var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
export var useProgramPackageIntroduction = function (programPackageId) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_PROGRAM_PACKAGE_INTRODUCTION($programPackageId: uuid!) {\n        program_package_by_pk(id: $programPackageId) {\n          id\n          title\n          cover_url\n          description\n          program_package_programs(order_by: { position: asc, program: { position: asc, published_at: desc } }) {\n            id\n            program {\n              id\n              title\n              cover_url\n              program_categories {\n                id\n                category {\n                  id\n                  name\n                }\n              }\n            }\n          }\n          program_package_plans(\n            where: { published_at: { _is_null: false } }\n            order_by: { position: asc, created_at: desc }\n          ) {\n            id\n            title\n            description\n            is_subscription\n            is_participants_visible\n            period_amount\n            period_type\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            program_package_plan_enrollments_aggregate {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PROGRAM_PACKAGE_INTRODUCTION($programPackageId: uuid!) {\n        program_package_by_pk(id: $programPackageId) {\n          id\n          title\n          cover_url\n          description\n          program_package_programs(order_by: { position: asc, program: { position: asc, published_at: desc } }) {\n            id\n            program {\n              id\n              title\n              cover_url\n              program_categories {\n                id\n                category {\n                  id\n                  name\n                }\n              }\n            }\n          }\n          program_package_plans(\n            where: { published_at: { _is_null: false } }\n            order_by: { position: asc, created_at: desc }\n          ) {\n            id\n            title\n            description\n            is_subscription\n            is_participants_visible\n            period_amount\n            period_type\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            program_package_plan_enrollments_aggregate {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n      }\n    "]))), { variables: { programPackageId: programPackageId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var programPackageIntroduction = loading || error || !data || !data.program_package_by_pk
        ? {
            id: '',
            title: '',
            coverUrl: '',
            description: null,
            programPackagePlans: [],
            includedPrograms: [],
        }
        : {
            id: programPackageId,
            title: data.program_package_by_pk.title,
            coverUrl: data.program_package_by_pk.cover_url,
            description: data.program_package_by_pk.description,
            programPackagePlans: data.program_package_by_pk.program_package_plans.map(function (programPackagePlan) {
                var _a;
                return ({
                    id: programPackagePlan.id,
                    title: programPackagePlan.title,
                    description: programPackagePlan.description,
                    isSubscription: programPackagePlan.is_subscription,
                    isParticipantsVisible: programPackagePlan.is_participants_visible,
                    periodAmount: programPackagePlan.period_amount,
                    periodType: programPackagePlan.period_type,
                    listPrice: programPackagePlan.list_price,
                    salePrice: programPackagePlan.sale_price,
                    soldAt: programPackagePlan.sold_at ? new Date(programPackagePlan.sold_at) : null,
                    discountDownPrice: programPackagePlan.discount_down_price,
                    enrollmentCount: ((_a = programPackagePlan.program_package_plan_enrollments_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 0,
                });
            }),
            includedPrograms: data.program_package_by_pk.program_package_programs.map(function (packageProgram) { return ({
                id: packageProgram.program.id,
                title: packageProgram.program.title,
                coverUrl: packageProgram.program.cover_url,
                categories: packageProgram.program.program_categories.map(function (programCategory) { return ({
                    id: programCategory.category.id,
                    name: programCategory.category.name,
                }); }),
            }); }),
        };
    return {
        loadingProgramPackage: loading,
        errorProgramPackage: error,
        programPackageIntroduction: programPackageIntroduction,
        refetchProgramPackage: refetch,
    };
};
export var useEnrolledProgramPackagePlanIds = function (memberId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS($memberId: String!) {\n        program_package_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          program_package_plan_id\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS($memberId: String!) {\n        program_package_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          program_package_plan_id\n        }\n      }\n    "]))), { variables: { memberId: memberId }, fetchPolicy: 'no-cache' }), loading = _a.loading, data = _a.data, error = _a.error, refetch = _a.refetch;
    var enrolledProgramPackagePlanIds = loading || !!error || !data
        ? []
        : data.program_package_plan_enrollment.map(function (programPackagePlanEnrollment) { return programPackagePlanEnrollment.program_package_plan_id; });
    return {
        loadingProgramPackageIds: loading,
        enrolledProgramPackagePlanIds: enrolledProgramPackagePlanIds,
        errorProgramPackageIds: error,
        refetchProgramPackageIds: refetch,
    };
};
export var useEnrolledProgramPackageIds = function (memberId, programPackageId) {
    var _a = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_ENROLLED_PROGRAM_PACKAGE($memberId: String!, $programPackageId: uuid!) {\n        program_package_plan_enrollment(\n          where: {\n            member_id: { _eq: $memberId }\n            program_package_plan: { program_package_id: { _eq: $programPackageId } }\n          }\n        ) {\n          program_package_plan_id\n          program_package_plan {\n            program_package_id\n          }\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PROGRAM_PACKAGE($memberId: String!, $programPackageId: uuid!) {\n        program_package_plan_enrollment(\n          where: {\n            member_id: { _eq: $memberId }\n            program_package_plan: { program_package_id: { _eq: $programPackageId } }\n          }\n        ) {\n          program_package_plan_id\n          program_package_plan {\n            program_package_id\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId, programPackageId: programPackageId } }), loading = _a.loading, data = _a.data, error = _a.error, refetch = _a.refetch;
    var enrolledProgramPackageIds = loading || !!error || !data
        ? []
        : data.program_package_plan_enrollment.map(function (programPackagePlanEnrollment) { var _a; return (_a = programPackagePlanEnrollment.program_package_plan) === null || _a === void 0 ? void 0 : _a.program_package_id; });
    return {
        loadingProgramPackageIds: loading,
        enrolledProgramPackageIds: enrolledProgramPackageIds,
        errorProgramPackageIds: error,
        refetchProgramPackageIds: refetch,
    };
};
export var useProgramPackage = function (programPackageId, memberId) {
    var _a, _b;
    var _c = useQuery(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      query GET_PROGRAM_PACKAGE_CONTENT($programPackageId: uuid!, $memberId: String) {\n        program_package_by_pk(id: $programPackageId) {\n          id\n          cover_url\n          title\n          published_at\n          program_package_programs(\n            where: { program: { published_at: { _is_null: false } } }\n            order_by: { position: asc }\n          ) {\n            id\n            program {\n              id\n              cover_url\n              title\n              program_categories {\n                id\n                category {\n                  id\n                  name\n                }\n              }\n            }\n          }\n        }\n        program_package_plan_enrollment(\n          where: {\n            program_package_plan: { program_package_id: { _eq: $programPackageId } }\n            member_id: { _eq: $memberId }\n          }\n        ) {\n          program_package_plan {\n            is_tempo_delivery\n          }\n        }\n        program_tempo_delivery(\n          where: {\n            program_package_program: { program_package_id: { _eq: $programPackageId } }\n            member_id: { _eq: $memberId }\n          }\n        ) {\n          delivered_at\n          program_package_program_id\n        }\n      }\n    "], ["\n      query GET_PROGRAM_PACKAGE_CONTENT($programPackageId: uuid!, $memberId: String) {\n        program_package_by_pk(id: $programPackageId) {\n          id\n          cover_url\n          title\n          published_at\n          program_package_programs(\n            where: { program: { published_at: { _is_null: false } } }\n            order_by: { position: asc }\n          ) {\n            id\n            program {\n              id\n              cover_url\n              title\n              program_categories {\n                id\n                category {\n                  id\n                  name\n                }\n              }\n            }\n          }\n        }\n        program_package_plan_enrollment(\n          where: {\n            program_package_plan: { program_package_id: { _eq: $programPackageId } }\n            member_id: { _eq: $memberId }\n          }\n        ) {\n          program_package_plan {\n            is_tempo_delivery\n          }\n        }\n        program_tempo_delivery(\n          where: {\n            program_package_program: { program_package_id: { _eq: $programPackageId } }\n            member_id: { _eq: $memberId }\n          }\n        ) {\n          delivered_at\n          program_package_program_id\n        }\n      }\n    "]))), { variables: { programPackageId: programPackageId, memberId: memberId } }), loading = _c.loading, error = _c.error, data = _c.data, refetch = _c.refetch;
    var programPackage = {
        id: programPackageId,
        title: ((_a = data === null || data === void 0 ? void 0 : data.program_package_by_pk) === null || _a === void 0 ? void 0 : _a.title) || '',
        coverUrl: ((_b = data === null || data === void 0 ? void 0 : data.program_package_by_pk) === null || _b === void 0 ? void 0 : _b.cover_url) || null,
        description: null,
        isEnrolled: !!(data === null || data === void 0 ? void 0 : data.program_package_plan_enrollment.length),
    };
    var isTempoDelivery = (data === null || data === void 0 ? void 0 : data.program_package_plan_enrollment.some(function (planEnrollment) { var _a; return (_a = planEnrollment.program_package_plan) === null || _a === void 0 ? void 0 : _a.is_tempo_delivery; })) || false;
    var programs = loading || error || !data || !data.program_package_by_pk
        ? []
        : data.program_package_by_pk.program_package_programs
            .filter(function (programPackageProgram) {
            return !isTempoDelivery ||
                data.program_tempo_delivery.some(function (programTempoDelivery) {
                    return programTempoDelivery.program_package_program_id === programPackageProgram.id &&
                        new Date(programTempoDelivery.delivered_at).getTime() < Date.now();
                });
        })
            .map(function (programPackageProgram) { return ({
            id: programPackageProgram.program.id,
            title: programPackageProgram.program.title,
            coverUrl: programPackageProgram.program.cover_url || undefined,
            categories: programPackageProgram.program.program_categories.map(function (programCategory) { return ({
                id: programCategory.category.id,
                name: programCategory.category.name,
            }); }),
        }); });
    return {
        loading: loading,
        error: error,
        programPackage: programPackage,
        programs: programs,
        refetch: refetch,
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=programPackage.js.map
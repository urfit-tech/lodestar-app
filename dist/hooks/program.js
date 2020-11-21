var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { sum, uniq } from 'ramda';
export var usePublishedProgramCollection = function (options) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_PUBLISHED_PROGRAM_COLLECTION($instructorId: String, $isPrivate: Boolean, $categoryId: String) {\n        program(\n          where: {\n            published_at: { _is_null: false }\n            program_roles: { name: { _eq: \"instructor\" }, member_id: { _eq: $instructorId } }\n            is_private: { _eq: $isPrivate }\n            is_deleted: { _eq: false }\n            _or: [{ _not: { program_categories: {} } }, { program_categories: { category_id: { _eq: $categoryId } } }]\n          }\n          order_by: [{ position: asc }, { published_at: desc }]\n        ) {\n          id\n          cover_url\n          title\n          abstract\n          support_locales\n          published_at\n          is_subscription\n          is_sold_out\n          is_private\n\n          list_price\n          sale_price\n          sold_at\n\n          program_categories {\n            id\n            category {\n              id\n              name\n            }\n          }\n          program_roles(where: { name: { _eq: \"instructor\" } }) {\n            id\n            name\n            member_id\n          }\n          program_plans(order_by: { created_at: asc }, limit: 1) {\n            id\n            type\n            title\n            description\n            gains\n            currency {\n              id\n              label\n              unit\n              name\n            }\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            period_amount\n            period_type\n            started_at\n            ended_at\n            is_participants_visible\n            published_at\n          }\n          program_content_sections {\n            id\n            program_contents_aggregate {\n              aggregate {\n                sum {\n                  duration\n                }\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PUBLISHED_PROGRAM_COLLECTION($instructorId: String, $isPrivate: Boolean, $categoryId: String) {\n        program(\n          where: {\n            published_at: { _is_null: false }\n            program_roles: { name: { _eq: \"instructor\" }, member_id: { _eq: $instructorId } }\n            is_private: { _eq: $isPrivate }\n            is_deleted: { _eq: false }\n            _or: [{ _not: { program_categories: {} } }, { program_categories: { category_id: { _eq: $categoryId } } }]\n          }\n          order_by: [{ position: asc }, { published_at: desc }]\n        ) {\n          id\n          cover_url\n          title\n          abstract\n          support_locales\n          published_at\n          is_subscription\n          is_sold_out\n          is_private\n\n          list_price\n          sale_price\n          sold_at\n\n          program_categories {\n            id\n            category {\n              id\n              name\n            }\n          }\n          program_roles(where: { name: { _eq: \"instructor\" } }) {\n            id\n            name\n            member_id\n          }\n          program_plans(order_by: { created_at: asc }, limit: 1) {\n            id\n            type\n            title\n            description\n            gains\n            currency {\n              id\n              label\n              unit\n              name\n            }\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            period_amount\n            period_type\n            started_at\n            ended_at\n            is_participants_visible\n            published_at\n          }\n          program_content_sections {\n            id\n            program_contents_aggregate {\n              aggregate {\n                sum {\n                  duration\n                }\n              }\n            }\n          }\n        }\n      }\n    "]))), {
        variables: {
            instructorId: options === null || options === void 0 ? void 0 : options.instructorId,
            isPrivate: options === null || options === void 0 ? void 0 : options.isPrivate,
            categoryId: options === null || options === void 0 ? void 0 : options.categoryId,
        },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var programs = loading || error || !data
        ? []
        : data.program
            .filter(function (program) {
            return !(options === null || options === void 0 ? void 0 : options.categoryId) || program.program_categories.some(function (v) { return v.category.id === options.categoryId; });
        })
            .map(function (program) { return ({
            id: program.id,
            coverUrl: program.cover_url,
            title: program.title,
            abstract: program.abstract,
            supportLocales: program.support_locales,
            publishedAt: program.published_at && new Date(program.published_at),
            isSubscription: program.is_subscription,
            isSoldOut: program.is_sold_out,
            isPrivate: program.is_private,
            listPrice: program.list_price,
            salePrice: program.sale_price,
            soldAt: program.sold_at && new Date(program.sold_at),
            categories: program.program_categories.map(function (programCategory) { return ({
                id: programCategory.category.id,
                name: programCategory.category.name,
            }); }),
            roles: program.program_roles.map(function (programRole) { return ({
                id: programRole.id,
                name: programRole.name,
                memberId: programRole.member_id,
            }); }),
            plans: program.program_plans.map(function (programPlan) { return ({
                id: programPlan.id,
                type: programPlan.type === 1 ? 'subscribeFromNow' : programPlan.type === 2 ? 'subscribeAll' : 'unknown',
                title: programPlan.title || '',
                description: programPlan.description,
                gains: programPlan.gains,
                currency: {
                    id: programPlan.currency.id,
                    label: programPlan.currency.label,
                    unit: programPlan.currency.unit,
                    name: programPlan.currency.name,
                },
                listPrice: programPlan.list_price,
                salePrice: programPlan.sale_price,
                soldAt: programPlan.sold_at && new Date(programPlan.sold_at),
                discountDownPrice: programPlan.discount_down_price,
                periodAmount: programPlan.period_amount,
                periodType: programPlan.period_type,
                startedAt: programPlan.started_at && new Date(programPlan.started_at),
                endedAt: programPlan.ended_at && new Date(programPlan.ended_at),
                isParticipantsVisible: programPlan.is_participants_visible,
                publishedAt: programPlan.published_at,
                isCountdownTimerVisible: false,
            }); }),
            totalDuration: sum(program.program_content_sections.map(function (section) { var _a, _b; return ((_b = (_a = section.program_contents_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.sum) === null || _b === void 0 ? void 0 : _b.duration) || 0; })),
        }); });
    return {
        loadingPrograms: loading,
        errorPrograms: error,
        programs: programs,
        refetchPrograms: refetch,
    };
};
export var useLatestProgramIds = function (_a) {
    var limit = _a.limit, language = _a.language;
    var _b = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_LATEST_PROGRAM_IDS($limit: Int) {\n        program(\n          where: { published_at: { _is_null: false }, is_private: { _eq: false }, is_deleted: { _eq: false } }\n          order_by: [{ published_at: desc }]\n          limit: $limit\n        ) {\n          id\n          support_locales\n        }\n      }\n    "], ["\n      query GET_LATEST_PROGRAM_IDS($limit: Int) {\n        program(\n          where: { published_at: { _is_null: false }, is_private: { _eq: false }, is_deleted: { _eq: false } }\n          order_by: [{ published_at: desc }]\n          limit: $limit\n        ) {\n          id\n          support_locales\n        }\n      }\n    "]))), { variables: { limit: limit } }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var programIds = loading || error || !data
        ? []
        : data.program
            .filter(function (program) { return !program.support_locales || program.support_locales.includes(language); })
            .map(function (program) { return program.id; });
    return {
        loadingProgramIds: loading,
        errorProgramIds: error,
        programIds: programIds,
        refetchProgramIds: refetch,
    };
};
export var useProgram = function (programId) {
    var _a = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_PROGRAM($programId: uuid!) {\n        program_by_pk(id: $programId) {\n          id\n          cover_url\n          title\n          abstract\n          published_at\n          is_subscription\n          is_sold_out\n          list_price\n          sale_price\n          sold_at\n\n          description\n          cover_video_url\n          is_issues_open\n          is_private\n          is_countdown_timer_visible\n\n          program_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          program_tags(order_by: { position: asc }) {\n            tag {\n              name\n            }\n          }\n          program_roles {\n            id\n            name\n            member_id\n          }\n          program_plans(order_by: { created_at: asc }) {\n            id\n            type\n            title\n            description\n            gains\n            currency {\n              id\n              label\n              unit\n              name\n            }\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            period_amount\n            period_type\n            started_at\n            ended_at\n            is_participants_visible\n            published_at\n            is_countdown_timer_visible\n          }\n          program_content_sections(\n            where: { program_contents: { published_at: { _is_null: false } } }\n            order_by: { position: asc }\n          ) {\n            id\n            title\n            description\n            program_contents(where: { published_at: { _is_null: false } }, order_by: { position: asc }) {\n              id\n              title\n              abstract\n              metadata\n              duration\n              published_at\n              list_price\n              sale_price\n              sold_at\n              program_content_type {\n                id\n                type\n              }\n            }\n            program_contents_aggregate(where: { published_at: { _is_null: false } }) {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PROGRAM($programId: uuid!) {\n        program_by_pk(id: $programId) {\n          id\n          cover_url\n          title\n          abstract\n          published_at\n          is_subscription\n          is_sold_out\n          list_price\n          sale_price\n          sold_at\n\n          description\n          cover_video_url\n          is_issues_open\n          is_private\n          is_countdown_timer_visible\n\n          program_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          program_tags(order_by: { position: asc }) {\n            tag {\n              name\n            }\n          }\n          program_roles {\n            id\n            name\n            member_id\n          }\n          program_plans(order_by: { created_at: asc }) {\n            id\n            type\n            title\n            description\n            gains\n            currency {\n              id\n              label\n              unit\n              name\n            }\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            period_amount\n            period_type\n            started_at\n            ended_at\n            is_participants_visible\n            published_at\n            is_countdown_timer_visible\n          }\n          program_content_sections(\n            where: { program_contents: { published_at: { _is_null: false } } }\n            order_by: { position: asc }\n          ) {\n            id\n            title\n            description\n            program_contents(where: { published_at: { _is_null: false } }, order_by: { position: asc }) {\n              id\n              title\n              abstract\n              metadata\n              duration\n              published_at\n              list_price\n              sale_price\n              sold_at\n              program_content_type {\n                id\n                type\n              }\n            }\n            program_contents_aggregate(where: { published_at: { _is_null: false } }) {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n      }\n    "]))), { variables: { programId: programId } }), loading = _a.loading, data = _a.data, error = _a.error, refetch = _a.refetch;
    var program = loading || error || !data || !data.program_by_pk
        ? null
        : {
            id: data.program_by_pk.id,
            coverUrl: data.program_by_pk.cover_url,
            title: data.program_by_pk.title,
            abstract: data.program_by_pk.abstract,
            publishedAt: new Date(data.program_by_pk.published_at),
            isSubscription: data.program_by_pk.is_subscription,
            isSoldOut: data.program_by_pk.is_sold_out,
            listPrice: data.program_by_pk.list_price,
            salePrice: data.program_by_pk.sale_price,
            soldAt: data.program_by_pk.sold_at && new Date(data.program_by_pk.sold_at),
            description: data.program_by_pk.description,
            coverVideoUrl: data.program_by_pk.cover_video_url,
            isIssuesOpen: data.program_by_pk.is_issues_open,
            isPrivate: data.program_by_pk.is_private,
            isCountdownTimerVisible: data.program_by_pk.is_countdown_timer_visible,
            tags: data.program_by_pk.program_tags.map(function (programTag) { return programTag.tag.name; }),
            categories: data.program_by_pk.program_categories.map(function (programCategory) { return ({
                id: programCategory.category.id,
                name: programCategory.category.name,
            }); }),
            roles: data.program_by_pk.program_roles.map(function (programRole) { return ({
                id: programRole.id,
                name: programRole.name,
                memberId: programRole.member_id,
            }); }),
            plans: data.program_by_pk.program_plans.map(function (programPlan) { return ({
                id: programPlan.id,
                type: programPlan.type === 1 ? 'subscribeFromNow' : programPlan.type === 2 ? 'subscribeAll' : 'unknown',
                title: programPlan.title || '',
                description: programPlan.description,
                gains: programPlan.gains,
                currency: {
                    id: programPlan.currency.id,
                    label: programPlan.currency.label,
                    unit: programPlan.currency.unit,
                    name: programPlan.currency.name,
                },
                listPrice: programPlan.list_price,
                salePrice: programPlan.sale_price,
                soldAt: programPlan.sold_at && new Date(programPlan.sold_at),
                discountDownPrice: programPlan.discount_down_price,
                periodAmount: programPlan.period_amount,
                periodType: programPlan.period_type,
                startedAt: programPlan.started_at,
                endedAt: programPlan.ended_at,
                isParticipantsVisible: programPlan.is_participants_visible,
                publishedAt: programPlan.published_at,
                isCountdownTimerVisible: programPlan.is_countdown_timer_visible,
            }); }),
            contentSections: data.program_by_pk.program_content_sections.map(function (programContentSection) { return ({
                id: programContentSection.id,
                title: programContentSection.title,
                description: programContentSection.description,
                contents: programContentSection.program_contents.map(function (programContent) {
                    var _a;
                    return ({
                        id: programContent.id,
                        title: programContent.title,
                        abstract: programContent.abstract,
                        metadata: programContent.metadata,
                        duration: programContent.duration,
                        contentType: ((_a = programContent.program_content_type) === null || _a === void 0 ? void 0 : _a.type) || '',
                        publishedAt: new Date(programContent.published_at),
                        listPrice: programContent.list_price,
                        salePrice: programContent.sale_price,
                        soldAt: programContent.sold_at && new Date(programContent.sold_at),
                    });
                }),
            }); }),
        };
    return {
        loadingProgram: loading,
        errorProgram: error,
        program: program,
        refetchProgram: refetch,
    };
};
export var useProgramContent = function (programContentId) {
    var _a;
    var _b = useQuery(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      query GET_PROGRAM_CONTENT($programContentId: uuid!) {\n        program_content_by_pk(id: $programContentId) {\n          id\n          title\n          abstract\n          created_at\n          published_at\n          list_price\n          sale_price\n          sold_at\n          metadata\n          duration\n          program_content_plans {\n            id\n            program_plan {\n              id\n              title\n            }\n          }\n          program_content_body {\n            id\n            description\n            data\n            type\n          }\n        }\n      }\n    "], ["\n      query GET_PROGRAM_CONTENT($programContentId: uuid!) {\n        program_content_by_pk(id: $programContentId) {\n          id\n          title\n          abstract\n          created_at\n          published_at\n          list_price\n          sale_price\n          sold_at\n          metadata\n          duration\n          program_content_plans {\n            id\n            program_plan {\n              id\n              title\n            }\n          }\n          program_content_body {\n            id\n            description\n            data\n            type\n          }\n        }\n      }\n    "]))), { variables: { programContentId: programContentId } }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var programContent = loading || error || !data || !data.program_content_by_pk
        ? null
        : {
            id: data.program_content_by_pk.id,
            title: data.program_content_by_pk.title,
            abstract: data.program_content_by_pk.abstract,
            metadata: data.program_content_by_pk.metadata,
            duration: data.program_content_by_pk.duration,
            contentType: (_a = data.program_content_by_pk.program_content_body) === null || _a === void 0 ? void 0 : _a.type,
            publishedAt: new Date(data.program_content_by_pk.published_at),
            listPrice: data.program_content_by_pk.list_price,
            salePrice: data.program_content_by_pk.sale_price,
            soldAt: data.program_content_by_pk.sold_at && new Date(data.program_content_by_pk.sold_at),
            programContentBody: data.program_content_by_pk.program_content_body
                ? {
                    id: data.program_content_by_pk.program_content_body.id,
                    type: data.program_content_by_pk.program_content_body.type,
                    description: data.program_content_by_pk.program_content_body.description,
                    data: data.program_content_by_pk.program_content_body.data,
                }
                : null,
        };
    return {
        loadingProgramContent: loading,
        errorProgramContent: error,
        programContent: programContent,
        refetchProgramContent: refetch,
    };
};
export var useEnrolledProgramIds = function (memberId) {
    var _a = useQuery(gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      query GET_ENROLLED_PROGRAMS($memberId: String!) {\n        program_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: program_id) {\n          program_id\n        }\n        program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          program_plan {\n            id\n            program_id\n          }\n        }\n        program_content_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: program_id) {\n          program_id\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PROGRAMS($memberId: String!) {\n        program_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: program_id) {\n          program_id\n        }\n        program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          program_plan {\n            id\n            program_id\n          }\n        }\n        program_content_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: program_id) {\n          program_id\n        }\n      }\n    "]))), {
        variables: { memberId: memberId },
        fetchPolicy: 'no-cache',
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledProgramIds = loading || error || !data
        ? []
        : uniq(__spreadArrays(data.program_enrollment.map(function (enrollment) { return enrollment.program_id; }), data.program_plan_enrollment.map(function (enrollment) { var _a; return ((_a = enrollment.program_plan) === null || _a === void 0 ? void 0 : _a.program_id) || ''; }), data.program_content_enrollment.map(function (enrollment) { return enrollment.program_id; })));
    return {
        enrolledProgramIds: loading || error ? [] : enrolledProgramIds,
        errorProgramIds: error,
        loadingProgramIds: loading,
        refetchProgramIds: refetch,
    };
};
export var useEnrolledPlanIds = function (memberId) {
    var _a = useQuery(gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      query GET_ENROLLED_PROGRAM_PLANS($memberId: String!) {\n        program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          program_plan_id\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PROGRAM_PLANS($memberId: String!) {\n        program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          program_plan_id\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, data = _a.data, error = _a.error, refetch = _a.refetch;
    var programPlanIds = loading || error || !data ? [] : data.program_plan_enrollment.map(function (value) { return value.program_plan_id; });
    return {
        programPlanIds: programPlanIds,
        loadingProgramPlanIds: loading,
        refetchProgramPlanIds: refetch,
    };
};
export var useProgramPlanEnrollment = function (programPlanId) {
    var _a = useQuery(gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      query GET_PROGRAM_PLAN_ENROLLMENT($programPlanId: uuid!) {\n        program_plan_enrollment_aggregate(where: { program_plan_id: { _eq: $programPlanId } }) {\n          aggregate {\n            count\n          }\n        }\n      }\n    "], ["\n      query GET_PROGRAM_PLAN_ENROLLMENT($programPlanId: uuid!) {\n        program_plan_enrollment_aggregate(where: { program_plan_id: { _eq: $programPlanId } }) {\n          aggregate {\n            count\n          }\n        }\n      }\n    "]))), { variables: { programPlanId: programPlanId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    return {
        numProgramPlanEnrollments: loading || error || !data || !data.program_plan_enrollment_aggregate.aggregate
            ? 0
            : data.program_plan_enrollment_aggregate.aggregate.count || 0,
        loadingProgramPlanEnrollments: loading,
        refetchProgramPlanEnrollments: refetch,
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=program.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { sum } from 'ramda';
import { useAuth } from '../components/auth/AuthContext';
export var usePhysicalEnrolledProjectPlanIds = function (memberId) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS($memberId: String!) {\n        project_plan_enrollment(\n          where: { member_id: { _eq: $memberId }, project_plan: { is_physical: { _eq: false } } }\n        ) {\n          member_id\n          project_plan_id\n        }\n      }\n    "], ["\n      query GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS($memberId: String!) {\n        project_plan_enrollment(\n          where: { member_id: { _eq: $memberId }, project_plan: { is_physical: { _eq: false } } }\n        ) {\n          member_id\n          project_plan_id\n        }\n      }\n    "]))), {
        variables: { memberId: memberId },
        fetchPolicy: 'no-cache',
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledProjectPlanIds = loading || error || !data ? [] : data.project_plan_enrollment.map(function (enrollment) { return enrollment.project_plan_id; });
    return {
        loadingEnrolledProjectPlanIds: loading,
        errorEnrolledProjectPlanIds: error,
        enrolledProjectPlanIds: enrolledProjectPlanIds,
        refetchEnrolledProjectPlanIds: refetch,
    };
};
export var useEnrolledProjectPlanIds = function (memberId) {
    var GET_ENROLLED_PROJECT_PLAN_IDS = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    query GET_ENROLLED_PROJECT_PLAN_IDS($memberId: String!) {\n      product_enrollment(\n        where: { _and: [{ product_id: { _like: \"ProjectPlan%\" } }, { member_id: { _eq: $memberId } }] }\n      ) {\n        product_id\n        is_physical\n      }\n    }\n  "], ["\n    query GET_ENROLLED_PROJECT_PLAN_IDS($memberId: String!) {\n      product_enrollment(\n        where: { _and: [{ product_id: { _like: \"ProjectPlan%\" } }, { member_id: { _eq: $memberId } }] }\n      ) {\n        product_id\n        is_physical\n      }\n    }\n  "])));
    var _a = useQuery(GET_ENROLLED_PROJECT_PLAN_IDS, {
        variables: { memberId: memberId },
        fetchPolicy: 'no-cache',
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    return {
        loadingEnrolledProjectPlanIds: loading,
        errorEnrolledProjectPlanIds: error,
        enrolledProjectPlanIds: data && data.product_enrollment
            ? data.product_enrollment.map(function (projectPlan) { return projectPlan.product_id && projectPlan.product_id.split('_')[1]; })
            : [],
        refetchEnrolledProjectPlanIds: refetch,
    };
};
export var useProject = function (projectId) {
    var _a;
    var currentMemberId = useAuth().currentMemberId;
    var enrolledProjectPlanIds = usePhysicalEnrolledProjectPlanIds(currentMemberId || '').enrolledProjectPlanIds;
    var _b = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_PROJECT($projectId: uuid!) {\n        project_by_pk(id: $projectId) {\n          id\n          type\n          title\n          cover_type\n          cover_url\n          preview_url\n          abstract\n          description\n          target_amount\n          target_unit\n          template\n          introduction\n          updates\n          comments\n          contents\n          created_at\n          published_at\n          expired_at\n          is_participants_visible\n          is_countdown_timer_visible\n          project_sales {\n            total_sales\n          }\n\n          project_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          project_sections(order_by: { position: asc }) {\n            id\n            type\n            options\n          }\n          project_plans(order_by: { position: asc }) {\n            id\n            cover_url\n            title\n            description\n            is_subscription\n            period_amount\n            period_type\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            created_at\n            is_participants_visible\n            is_physical\n            is_limited\n\n            project_plan_inventory_status {\n              buyable_quantity\n            }\n            project_plan_enrollments_aggregate {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PROJECT($projectId: uuid!) {\n        project_by_pk(id: $projectId) {\n          id\n          type\n          title\n          cover_type\n          cover_url\n          preview_url\n          abstract\n          description\n          target_amount\n          target_unit\n          template\n          introduction\n          updates\n          comments\n          contents\n          created_at\n          published_at\n          expired_at\n          is_participants_visible\n          is_countdown_timer_visible\n          project_sales {\n            total_sales\n          }\n\n          project_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          project_sections(order_by: { position: asc }) {\n            id\n            type\n            options\n          }\n          project_plans(order_by: { position: asc }) {\n            id\n            cover_url\n            title\n            description\n            is_subscription\n            period_amount\n            period_type\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            created_at\n            is_participants_visible\n            is_physical\n            is_limited\n\n            project_plan_inventory_status {\n              buyable_quantity\n            }\n            project_plan_enrollments_aggregate {\n              aggregate {\n                count\n              }\n            }\n          }\n        }\n      }\n    "]))), {
        variables: { projectId: projectId },
    }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var project = loading || error || !data || !data.project_by_pk
        ? null
        : {
            id: data.project_by_pk.id,
            type: data.project_by_pk.type,
            title: data.project_by_pk.title,
            coverType: data.project_by_pk.cover_type,
            coverUrl: data.project_by_pk.cover_url,
            previewUrl: data.project_by_pk.preview_url,
            abstract: data.project_by_pk.abstract,
            description: data.project_by_pk.description,
            targetAmount: data.project_by_pk.target_amount,
            targetUnit: data.project_by_pk.target_unit,
            template: data.project_by_pk.template,
            introduction: data.project_by_pk.introduction,
            updates: data.project_by_pk.updates || [],
            comments: data.project_by_pk.comments || [],
            contents: data.project_by_pk.contents || [],
            createdAt: new Date(data.project_by_pk.created_at),
            publishedAt: data.project_by_pk.published_at ? new Date(data.project_by_pk.published_at) : null,
            expiredAt: data.project_by_pk.expired_at ? new Date(data.project_by_pk.expired_at) : null,
            isParticipantsVisible: data.project_by_pk.is_participants_visible,
            isCountdownTimerVisible: data.project_by_pk.is_countdown_timer_visible,
            totalSales: ((_a = data.project_by_pk.project_sales) === null || _a === void 0 ? void 0 : _a.total_sales) || 0,
            enrollmentCount: sum(data.project_by_pk.project_plans.map(function (projectPlan) { var _a; return ((_a = projectPlan.project_plan_enrollments_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 0; })),
            categories: data.project_by_pk.project_categories.map(function (projectCategory) { return ({
                id: projectCategory.category.id,
                name: projectCategory.category.name,
            }); }),
            projectSections: data.project_by_pk.project_sections,
            projectPlans: data.project_by_pk.project_plans.map(function (projectPlan) {
                var _a, _b, _c, _d;
                return ({
                    id: projectPlan.id,
                    projectTitle: (_a = data.project_by_pk) === null || _a === void 0 ? void 0 : _a.title,
                    coverUrl: projectPlan.cover_url,
                    title: projectPlan.title,
                    description: projectPlan.description,
                    isSubscription: projectPlan.is_subscription,
                    periodAmount: projectPlan.period_amount,
                    periodType: projectPlan.period_type,
                    listPrice: projectPlan.list_price,
                    salePrice: projectPlan.sale_price,
                    soldAt: projectPlan.sold_at ? new Date(projectPlan.sold_at) : null,
                    discountDownPrice: projectPlan.discount_down_price,
                    createdAt: new Date(projectPlan.created_at),
                    isParticipantsVisible: projectPlan.is_participants_visible,
                    isPhysical: projectPlan.is_physical,
                    isLimited: projectPlan.is_limited,
                    createAt: new Date(projectPlan.created_at),
                    isExpired: data.project_by_pk && data.project_by_pk.expired_at
                        ? new Date(data.project_by_pk.expired_at).getTime() < Date.now()
                        : false,
                    isEnrolled: enrolledProjectPlanIds.includes(projectPlan.id),
                    buyableQuantity: (_c = (_b = projectPlan.project_plan_inventory_status) === null || _b === void 0 ? void 0 : _b.buyable_quantity) !== null && _c !== void 0 ? _c : null,
                    projectPlanEnrollmentCount: ((_d = projectPlan.project_plan_enrollments_aggregate.aggregate) === null || _d === void 0 ? void 0 : _d.count) || 0,
                });
            }),
        };
    return {
        loadingProject: loading,
        errorProject: error,
        project: project,
        refetchProject: refetch,
    };
};
export var useProjectIntroCollection = function (filter) {
    var _a = useQuery(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      query GET_PROJECT_INTRO_COLLECTION($categoryId: String) {\n        project(\n          where: {\n            type: { _in: [\"on-sale\", \"pre-order\", \"funding\"] }\n            _or: [{ _not: { project_categories: {} } }, { project_categories: { category_id: { _eq: $categoryId } } }]\n          }\n          order_by: { position: asc }\n        ) {\n          id\n          type\n          title\n          cover_type\n          cover_url\n          preview_url\n          abstract\n          description\n          target_amount\n          target_unit\n          expired_at\n          is_participants_visible\n          is_countdown_timer_visible\n          project_sales {\n            total_sales\n          }\n          project_plans {\n            id\n            cover_url\n            title\n            description\n            is_subscription\n            period_amount\n            period_type\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            created_at\n            is_participants_visible\n            is_physical\n            is_limited\n            project_plan_enrollments_aggregate {\n              aggregate {\n                count\n              }\n            }\n          }\n          project_categories {\n            id\n            category {\n              id\n              name\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PROJECT_INTRO_COLLECTION($categoryId: String) {\n        project(\n          where: {\n            type: { _in: [\"on-sale\", \"pre-order\", \"funding\"] }\n            _or: [{ _not: { project_categories: {} } }, { project_categories: { category_id: { _eq: $categoryId } } }]\n          }\n          order_by: { position: asc }\n        ) {\n          id\n          type\n          title\n          cover_type\n          cover_url\n          preview_url\n          abstract\n          description\n          target_amount\n          target_unit\n          expired_at\n          is_participants_visible\n          is_countdown_timer_visible\n          project_sales {\n            total_sales\n          }\n          project_plans {\n            id\n            cover_url\n            title\n            description\n            is_subscription\n            period_amount\n            period_type\n            list_price\n            sale_price\n            sold_at\n            discount_down_price\n            created_at\n            is_participants_visible\n            is_physical\n            is_limited\n            project_plan_enrollments_aggregate {\n              aggregate {\n                count\n              }\n            }\n          }\n          project_categories {\n            id\n            category {\n              id\n              name\n            }\n          }\n        }\n      }\n    "]))), { variables: { categoryId: filter === null || filter === void 0 ? void 0 : filter.categoryId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var projects = loading || error || !data
        ? []
        : data.project
            .filter(function (project) { return !(filter === null || filter === void 0 ? void 0 : filter.categoryId) || project.project_categories.some(function (v) { return v.category.id === filter.categoryId; }); })
            .map(function (project) {
            var _a;
            return ({
                id: project.id,
                type: project.type,
                title: project.title,
                coverType: project.cover_type,
                coverUrl: project.cover_url,
                previewUrl: project.preview_url,
                abstract: project.abstract,
                description: project.description,
                targetAmount: project.target_amount,
                targetUnit: project.target_unit,
                expiredAt: project.expired_at ? new Date(project.expired_at) : null,
                isParticipantsVisible: project.is_participants_visible,
                isCountdownTimerVisible: project.is_countdown_timer_visible,
                totalSales: (_a = project.project_sales) === null || _a === void 0 ? void 0 : _a.total_sales,
                enrollmentCount: sum(project.project_plans.map(function (projectPlan) { var _a; return ((_a = projectPlan.project_plan_enrollments_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 0; })),
                categories: project.project_categories.map(function (projectCategory) { return ({
                    id: projectCategory.category.id,
                    name: projectCategory.category.name,
                }); }),
                projectPlans: project.project_plans.map(function (project_plan) { return ({
                    id: project_plan.id,
                    coverUrl: project_plan.cover_url,
                    title: project_plan.title,
                    description: project_plan.description,
                    isSubscription: project_plan.is_subscription,
                    periodAmount: project_plan.period_amount,
                    periodType: project_plan.period_type,
                    listPrice: project_plan.list_price,
                    salePrice: project_plan.sale_price,
                    soldAt: project_plan.sold_at ? new Date(project_plan.sold_at) : null,
                    discountDownPrice: project_plan.discount_down_price,
                    createdAt: new Date(project_plan.created_at),
                    createAt: new Date(project_plan.created_at),
                }); }),
            });
        });
    return {
        loadingProjects: loading,
        errorProjects: error,
        projects: projects,
        refetchProjects: refetch,
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=project.js.map
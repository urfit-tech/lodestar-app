var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import ProjectPlanCollectionBlockComponent from '../../components/project/ProjectPlanCollectionBlock';
import { notEmpty } from '../../helpers';
var ProjectPlanCollectionBlock = function (_a) {
    var memberId = _a.memberId;
    var _b = useQuery(GET_ENROLLED_PROJECT_PLANS, { variables: { memberId: memberId } }), loading = _b.loading, error = _b.error, data = _b.data;
    var projectPlans = loading || error || !data
        ? []
        : data.project_plan_enrollment
            .map(function (projectPlan) {
            return projectPlan.project_plan
                ? {
                    id: projectPlan.project_plan.id,
                    title: projectPlan.project_plan.title,
                    description: projectPlan.project_plan.description,
                    project: {
                        id: projectPlan.project_plan.project.id,
                        title: projectPlan.project_plan.project.title,
                        expiredAt: new Date(projectPlan.project_plan.project.expired_at),
                    },
                }
                : null;
        })
            .filter(notEmpty);
    return React.createElement(ProjectPlanCollectionBlockComponent, { projectPlans: projectPlans });
};
var GET_ENROLLED_PROJECT_PLANS = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_ENROLLED_PROJECT_PLANS($memberId: String!) {\n    project_plan_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: project_plan_id) {\n      project_plan {\n        id\n        title\n        description\n        project {\n          id\n          title\n          expired_at\n        }\n      }\n    }\n  }\n"], ["\n  query GET_ENROLLED_PROJECT_PLANS($memberId: String!) {\n    project_plan_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: project_plan_id) {\n      project_plan {\n        id\n        title\n        description\n        project {\n          id\n          title\n          expired_at\n        }\n      }\n    }\n  }\n"])));
export default ProjectPlanCollectionBlock;
var templateObject_1;
//# sourceMappingURL=ProjectPlanCollectionBlock.js.map
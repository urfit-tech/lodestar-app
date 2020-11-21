var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { useIntl } from 'react-intl';
import { commonMessages, productMessages } from '../../helpers/translation';
var ProjectPlanEnrollmentCount = function (_a) {
    var projectPlanId = _a.projectPlanId;
    var formatMessage = useIntl().formatMessage;
    var _b = useQuery(GET_PROJECT_PLAN_ENROLLMENT_COUNT, { variables: { projectPlanId: projectPlanId } }), loading = _b.loading, error = _b.error, data = _b.data;
    if (loading || error || !data) {
        return React.createElement("span", null, formatMessage(productMessages.project.paragraph.noPerson));
    }
    if (!data.project_plan_enrollment_aggregate.aggregate) {
        return React.createElement("span", null, formatMessage(productMessages.project.paragraph.zeroPerson));
    }
    return (React.createElement("span", null,
        data.project_plan_enrollment_aggregate.aggregate.count || 0,
        " ",
        formatMessage(commonMessages.unit.people)));
};
var GET_PROJECT_PLAN_ENROLLMENT_COUNT = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_PROJECT_PLAN_ENROLLMENT_COUNT($projectPlanId: uuid!) {\n    project_plan_enrollment_aggregate(where: { project_plan_id: { _eq: $projectPlanId } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n"], ["\n  query GET_PROJECT_PLAN_ENROLLMENT_COUNT($projectPlanId: uuid!) {\n    project_plan_enrollment_aggregate(where: { project_plan_id: { _eq: $projectPlanId } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n"])));
export default ProjectPlanEnrollmentCount;
var templateObject_1;
//# sourceMappingURL=ProjectPlanEnrollmentCount.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Spin } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { useIntl } from 'react-intl';
import { commonMessages, productMessages } from '../../helpers/translation';
var ProjectEnrollmentCounts = function (_a) {
    var projectId = _a.projectId, numberOnly = _a.numberOnly;
    var formatMessage = useIntl().formatMessage;
    var _b = useQuery(GET_PROJECT_ENROLLMENT_COUNT, {
        variables: {
            projectId: projectId,
        },
    }), loading = _b.loading, error = _b.error, data = _b.data;
    if (loading) {
        return React.createElement(Spin, null);
    }
    if (error || !data) {
        return React.createElement("span", null, formatMessage(commonMessages.status.readingError));
    }
    var count = (data.project_plan_enrollment_aggregate.aggregate &&
        data.project_plan_enrollment_aggregate.aggregate.count &&
        data.project_plan_enrollment_aggregate.aggregate.count) ||
        0;
    if (numberOnly) {
        return React.createElement(React.Fragment, null, count);
    }
    return React.createElement(React.Fragment, null, formatMessage(productMessages.project.paragraph.numberOfParticipants) + " " + count);
};
var GET_PROJECT_ENROLLMENT_COUNT = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_PROJECT_ENROLLMENT_COUNT($projectId: uuid!) {\n    project_plan_enrollment_aggregate(where: { project_plan: { project_id: { _eq: $projectId } } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n"], ["\n  query GET_PROJECT_ENROLLMENT_COUNT($projectId: uuid!) {\n    project_plan_enrollment_aggregate(where: { project_plan: { project_id: { _eq: $projectId } } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n"])));
export default ProjectEnrollmentCounts;
var templateObject_1;
//# sourceMappingURL=ProjectEnrollmentCounts.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
var ProjectSwitchDisplaySection = function (_a) {
    var onDisplayProjectSectionTypesSet = _a.onDisplayProjectSectionTypesSet, projectId = _a.projectId;
    var currentMemberId = useAuth().currentMemberId;
    var apolloClient = useApolloClient();
    useEffect(function () {
        apolloClient
            .query({
            query: gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            query GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENT($projectId: uuid!, $memberId: String!) {\n              project_plan_enrollment(\n                where: { project_plan: { project: { id: { _eq: $projectId } } }, member_id: { _eq: $memberId } }\n              ) {\n                member_id\n              }\n            }\n          "], ["\n            query GET_PRIVATE_TEACH_PROJECT_PLAN_ENROLLMENT($projectId: uuid!, $memberId: String!) {\n              project_plan_enrollment(\n                where: { project_plan: { project: { id: { _eq: $projectId } } }, member_id: { _eq: $memberId } }\n              ) {\n                member_id\n              }\n            }\n          "]))),
            variables: {
                memberId: currentMemberId || '',
                projectId: projectId,
            },
        })
            .then(function (_a) {
            var data = _a.data;
            var isEnrolled = !!data.project_plan_enrollment.length;
            var displayProjectTypes = isEnrolled
                ? ['programSearch', 'programCollection', 'modularBriefFooter']
                : [
                    'messenger',
                    'banner',
                    'statistics',
                    'static',
                    'card',
                    'comparison',
                    'promotion',
                    'comment',
                    'callout',
                    'instructor',
                ];
            onDisplayProjectSectionTypesSet(displayProjectTypes);
        });
    }, [apolloClient, currentMemberId, onDisplayProjectSectionTypesSet, projectId]);
    return React.createElement(React.Fragment, null);
};
export default ProjectSwitchDisplaySection;
var templateObject_1;
//# sourceMappingURL=ProjectSwitchDisplaySection.js.map
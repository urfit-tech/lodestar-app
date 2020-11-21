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
import { Skeleton, Typography } from 'antd';
import gql from 'graphql-tag';
import { flatten, uniq } from 'ramda';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { commonMessages, productMessages } from '../../helpers/translation';
import ProgramCard from './ProgramCard';
var EnrolledProgramCollectionBlock = function (_a) {
    var memberId = _a.memberId;
    var formatMessage = useIntl().formatMessage;
    var _b = useQuery(GET_OWNED_PROGRAMS, { variables: { memberId: memberId } }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    useEffect(function () {
        refetch && refetch();
    });
    if (loading) {
        return (React.createElement("div", { className: "container py-3" },
            React.createElement(Typography.Title, { level: 4 }, formatMessage(productMessages.program.title.course)),
            React.createElement(Skeleton, { active: true, avatar: true })));
    }
    if (error || !data) {
        return (React.createElement("div", { className: "container py-3" },
            React.createElement(Typography.Title, { level: 4 }, formatMessage(productMessages.program.title.course)),
            React.createElement("div", null, formatMessage(commonMessages.status.loadingUnable))));
    }
    var programIds = uniq(flatten(__spreadArrays(data.program_enrollment.map(function (programEnrollment) { return programEnrollment.program_id; }), data.program_plan_enrollment.map(function (programPlanEnrollment) {
        return programPlanEnrollment.program_plan ? programPlanEnrollment.program_plan.program_id : null;
    }))));
    return (React.createElement("div", { className: "container py-3" },
        React.createElement(Typography.Title, { level: 4 }, formatMessage(productMessages.program.title.course)),
        programIds.length === 0 ? (React.createElement("div", null, formatMessage(productMessages.program.content.noProgram))) : (React.createElement("div", { className: "row" }, programIds.map(function (programId) { return (React.createElement("div", { key: programId, className: "col-12 mb-4 col-md-6 col-lg-4" },
            React.createElement(ProgramCard, { memberId: memberId, programId: programId, withProgress: true }))); })))));
};
var GET_OWNED_PROGRAMS = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_OWNED_PROGRAMS($memberId: String!) {\n    program_enrollment(where: { member_id: { _eq: $memberId } }) {\n      program_id\n    }\n    program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n      program_plan {\n        program_id\n      }\n    }\n  }\n"], ["\n  query GET_OWNED_PROGRAMS($memberId: String!) {\n    program_enrollment(where: { member_id: { _eq: $memberId } }) {\n      program_id\n    }\n    program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n      program_plan {\n        program_id\n      }\n    }\n  }\n"])));
export default EnrolledProgramCollectionBlock;
var templateObject_1;
//# sourceMappingURL=EnrolledProgramCollectionBlock.js.map
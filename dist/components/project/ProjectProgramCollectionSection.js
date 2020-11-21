var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Skeleton } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import RocketIcon from '../../images/icon-rocket.svg';
import { useAuth } from '../auth/AuthContext';
import ProgramCollection from '../package/ProgramCollection';
import { ProgramDisplayedListItem } from '../program/ProgramDisplayedListItem';
var messages = defineMessages({
    learningStart: { id: 'project.text.learningStart', defaultMessage: '學習旅程即將開始' },
    support: { id: 'project.text.support', defaultMessage: '將會有領航員聯繫你，協助你開始上課！' },
});
var StyledEmptyBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 60vh;\n"], ["\n  height: 60vh;\n"])));
var StyledTitle = styled.h2(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    font-size: 20px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n    text-align: center;\n    color: var(--gray-darker);\n  }\n"], ["\n  && {\n    font-size: 20px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n    text-align: center;\n    color: var(--gray-darker);\n  }\n"])));
var StyledSubtitle = styled.h3(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    margin: 0;\n    font-size: 14px;\n    font-weight: 500;\n    line-height: 1.57;\n    letter-spacing: 0.18px;\n    color: var(--gray-darker);\n  }\n"], ["\n  && {\n    margin: 0;\n    font-size: 14px;\n    font-weight: 500;\n    line-height: 1.57;\n    letter-spacing: 0.18px;\n    color: var(--gray-darker);\n  }\n"])));
var StyledSection = styled.section(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  height: 100%;\n  min-height: 60vh;\n"], ["\n  height: 100%;\n  min-height: 60vh;\n"])));
var ProjectProgramCollectionSection = function (_a) {
    var projectId = _a.projectId, programCategory = _a.programCategory;
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var _b = useEnrolledPrivateTeachProgram(currentMemberId || '', programCategory), loading = _b.loading, error = _b.error, programs = _b.programs;
    if (loading || error) {
        return React.createElement(Skeleton, { active: true });
    }
    if (programs.length === 0) {
        return (React.createElement(StyledEmptyBlock, { className: "d-flex justify-content-center align-items-center" },
            React.createElement("div", { className: "d-flex flex-column align-items-center" },
                React.createElement(Icon, { src: RocketIcon, className: "mb-4" }),
                React.createElement(StyledTitle, { className: "mb-1" }, formatMessage(messages.learningStart)),
                React.createElement(StyledSubtitle, null, formatMessage(messages.support)))));
    }
    return (React.createElement(StyledSection, { className: "mt-3" },
        React.createElement(ProgramCollection, { programs: programs, renderItem: function (_a) {
                var program = _a.program;
                return (React.createElement(Link, { className: "col-12", to: "/programs/" + program.id + "/contents?back=project_" + projectId },
                    React.createElement(ProgramDisplayedListItem, { key: program.id, program: program, memberId: currentMemberId })));
            }, noDisplayTypeButton: true })));
};
var normalizeTimeToSecond = function (time) {
    var t = new Date(time || 0).getTime();
    if (isNaN(t)) {
        return 0;
    }
    return Math.floor(t / 1000);
};
var useEnrolledPrivateTeachProgram = function (memberId, programCategory) {
    var _a = useQuery(gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      query GET_ENROLLED_PRIVATE_TEACH_PROGRAMS($memberId: String!, $programCategory: String!) {\n        program_plan_enrollment(\n          where: {\n            program_plan: { program: { program_categories: { category: { name: { _eq: $programCategory } } } } }\n            member_id: { _eq: $memberId }\n          }\n        ) {\n          started_at\n          ended_at\n          options\n          program_plan {\n            id\n            program {\n              id\n              title\n              cover_url\n              program_categories {\n                id\n                category {\n                  id\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PRIVATE_TEACH_PROGRAMS($memberId: String!, $programCategory: String!) {\n        program_plan_enrollment(\n          where: {\n            program_plan: { program: { program_categories: { category: { name: { _eq: $programCategory } } } } }\n            member_id: { _eq: $memberId }\n          }\n        ) {\n          started_at\n          ended_at\n          options\n          program_plan {\n            id\n            program {\n              id\n              title\n              cover_url\n              program_categories {\n                id\n                category {\n                  id\n                  name\n                }\n              }\n            }\n          }\n        }\n      }\n    "]))), {
        variables: {
            memberId: memberId,
            programCategory: programCategory,
        },
        fetchPolicy: 'no-cache',
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var programs = (data === null || data === void 0 ? void 0 : data.program_plan_enrollment.sort(function (a, b) {
        var _a, _b;
        var dateCompare = normalizeTimeToSecond(a.ended_at) - normalizeTimeToSecond(b.ended_at);
        if (dateCompare) {
            return dateCompare;
        }
        return (((_a = a.options) === null || _a === void 0 ? void 0 : _a.position) || 0) - (((_b = b.options) === null || _b === void 0 ? void 0 : _b.position) || 0);
    }).map(function (programPlan) {
        var _a, _b, _c, _d, _e;
        return ({
            id: ((_a = programPlan.program_plan) === null || _a === void 0 ? void 0 : _a.program.id) || '',
            title: ((_b = programPlan.program_plan) === null || _b === void 0 ? void 0 : _b.program.title) || '',
            coverUrl: (_c = programPlan.program_plan) === null || _c === void 0 ? void 0 : _c.program.cover_url,
            categories: ((_e = (_d = programPlan.program_plan) === null || _d === void 0 ? void 0 : _d.program) === null || _e === void 0 ? void 0 : _e.program_categories.map(function (programCategory) { return ({
                id: programCategory.category.id,
                name: programCategory.category.name,
            }); }).filter(function (category) { return category.name !== programCategory; })) || [],
            expiredAt: programPlan.ended_at ? new Date(programPlan.ended_at) : null,
        });
    })) || [];
    return {
        loading: loading,
        error: error,
        programs: programs,
        refetch: refetch,
    };
};
export default ProjectProgramCollectionSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=ProjectProgramCollectionSection.js.map
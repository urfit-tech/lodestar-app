var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import { Skeleton, Typography } from 'antd';
import gql from 'graphql-tag';
import { sum, uniqBy } from 'ramda';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import EmptyCover from '../../images/empty-cover.png';
var StyledCard = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow: hidden;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);\n"], ["\n  overflow: hidden;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);\n"])));
var StyledCover = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-top: 56.25%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"], ["\n  padding-top: 56.25%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"])), function (props) { return props.src; });
var StyledDescription = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 1.25rem;\n"], ["\n  padding: 1.25rem;\n"])));
var StyledTitle = styled(Typography.Title)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  && {\n    margin-bottom: 1.25rem;\n    color: var(--gray-darker);\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n    height: 3rem;\n  }\n"], ["\n  && {\n    margin-bottom: 1.25rem;\n    color: var(--gray-darker);\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n    height: 3rem;\n  }\n"])));
var ProgramPackageCollectionBlock = function (_a) {
    var memberId = _a.memberId;
    var formatMessage = useIntl().formatMessage;
    var _b = useEnrolledProgramPackage(memberId), loading = _b.loading, error = _b.error, programPackages = _b.programPackages;
    if (loading) {
        return (React.createElement("div", { className: "container py-3" },
            React.createElement(Typography.Title, { level: 4 }, formatMessage(commonMessages.ui.packages)),
            React.createElement(Skeleton, { active: true })));
    }
    if (error) {
        return (React.createElement("div", { className: "container py-3" },
            React.createElement(Typography.Title, { level: 4 }, formatMessage(commonMessages.ui.packages)),
            React.createElement("div", null, formatMessage(commonMessages.status.readingError))));
    }
    return (React.createElement("div", { className: "container py-3" },
        React.createElement(Typography.Title, { level: 4, className: "mb-4" }, formatMessage(commonMessages.ui.packages)),
        React.createElement("div", { className: "row" }, programPackages.map(function (programPackage) { return (React.createElement("div", { key: programPackage.id, className: "col-12 col-md-6 col-lg-4 mb-4" },
            React.createElement(Link, { to: "/program-packages/" + programPackage.id + "/contents?memberId=" + memberId },
                React.createElement(StyledCard, null,
                    React.createElement(StyledCover, { src: programPackage.coverUrl || EmptyCover }),
                    React.createElement(StyledDescription, null,
                        React.createElement(StyledTitle, { level: 2, ellipsis: { rows: 2 } }, programPackage.title)))))); }))));
};
export default ProgramPackageCollectionBlock;
var useEnrolledProgramPackage = function (memberId) {
    var _a = useQuery(gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      query GET_ENROLLED_PROGRAM_PACKAGES($memberId: String!) {\n        program_package(\n          where: { program_package_plans: { program_package_plan_enrollments: { member_id: { _eq: $memberId } } } }\n          distinct_on: id\n        ) {\n          id\n          cover_url\n          title\n          published_at\n          program_package_programs(where: { program: { published_at: { _is_null: false } } }) {\n            id\n            program {\n              id\n              program_content_sections {\n                id\n                program_contents {\n                  id\n                  duration\n                }\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PROGRAM_PACKAGES($memberId: String!) {\n        program_package(\n          where: { program_package_plans: { program_package_plan_enrollments: { member_id: { _eq: $memberId } } } }\n          distinct_on: id\n        ) {\n          id\n          cover_url\n          title\n          published_at\n          program_package_programs(where: { program: { published_at: { _is_null: false } } }) {\n            id\n            program {\n              id\n              program_content_sections {\n                id\n                program_contents {\n                  id\n                  duration\n                }\n              }\n            }\n          }\n        }\n      }\n    "]))), {
        variables: {
            memberId: memberId,
        },
    }), loading = _a.loading, error = _a.error, data = _a.data;
    var programPackages = loading || !!error || !data
        ? []
        : uniqBy(function (programPackage) { return programPackage.id; }, data.program_package).map(function (programPackage) { return ({
            id: programPackage.id,
            coverUrl: programPackage.cover_url || undefined,
            title: programPackage.title,
            programCount: programPackage.program_package_programs.length,
            totalDuration: sum(programPackage.program_package_programs
                .map(function (programPackageProgram) {
                return programPackageProgram.program.program_content_sections
                    .map(function (programContentSection) {
                    return programContentSection.program_contents.map(function (programContent) { return programContent.duration; });
                })
                    .flat();
            })
                .flat()),
        }); });
    return {
        loading: loading,
        error: error,
        programPackages: programPackages,
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=ProgramPackageCollectionBlock.js.map
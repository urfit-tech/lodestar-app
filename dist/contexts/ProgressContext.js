var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { flatten } from 'ramda';
import React, { createContext } from 'react';
export var ProgressContext = createContext({ programContentProgress: [] });
export var ProgressProvider = function (_a) {
    var programId = _a.programId, memberId = _a.memberId, children = _a.children;
    var _b = useProgramContentProgress(programId, memberId), programContentProgress = _b.programContentProgress, refetchProgress = _b.refetchProgress;
    var insertProgress = useInsertProgress(memberId);
    return (React.createElement(ProgressContext.Provider, { value: {
            programContentProgress: programContentProgress,
            refetchProgress: refetchProgress,
            insertProgress: insertProgress,
        } }, children));
};
var useInsertProgress = function (memberId) {
    var insertProgramContentProgress = useMutation(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation INSERT_PROGRAM_CONTENT_PROGRESS(\n      $memberId: String!\n      $programContentId: uuid!\n      $progress: numeric!\n      $lastProgress: numeric!\n    ) {\n      insert_program_content_progress(\n        objects: {\n          member_id: $memberId\n          program_content_id: $programContentId\n          progress: $progress\n          last_progress: $lastProgress\n        }\n        on_conflict: {\n          constraint: program_content_progress_member_id_program_content_id_key\n          update_columns: [progress, last_progress]\n        }\n      ) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation INSERT_PROGRAM_CONTENT_PROGRESS(\n      $memberId: String!\n      $programContentId: uuid!\n      $progress: numeric!\n      $lastProgress: numeric!\n    ) {\n      insert_program_content_progress(\n        objects: {\n          member_id: $memberId\n          program_content_id: $programContentId\n          progress: $progress\n          last_progress: $lastProgress\n        }\n        on_conflict: {\n          constraint: program_content_progress_member_id_program_content_id_key\n          update_columns: [progress, last_progress]\n        }\n      ) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    var insertProgress = function (programContentId, _a) {
        var progress = _a.progress, lastProgress = _a.lastProgress;
        return insertProgramContentProgress({
            variables: {
                memberId: memberId,
                programContentId: programContentId,
                progress: progress,
                lastProgress: lastProgress,
            },
        });
    };
    return insertProgress;
};
export var useProgramContentProgress = function (programId, memberId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_PROGRAM_CONTENT_PROGRESS($programId: uuid!, $memberId: String!) {\n        program_content_body(\n          where: { program_contents: { program_content_section: { program_id: { _eq: $programId } } } }\n        ) {\n          program_contents(order_by: { published_at: desc }) {\n            id\n            content_section_id\n            program_content_progress(where: { member_id: { _eq: $memberId } }) {\n              id\n              progress\n              last_progress\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PROGRAM_CONTENT_PROGRESS($programId: uuid!, $memberId: String!) {\n        program_content_body(\n          where: { program_contents: { program_content_section: { program_id: { _eq: $programId } } } }\n        ) {\n          program_contents(order_by: { published_at: desc }) {\n            id\n            content_section_id\n            program_content_progress(where: { member_id: { _eq: $memberId } }) {\n              id\n              progress\n              last_progress\n            }\n          }\n        }\n      }\n    "]))), { variables: { programId: programId, memberId: memberId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var programContentProgress = loading || error || !data
        ? []
        : flatten(data.program_content_body.map(function (contentBody) {
            return contentBody.program_contents.map(function (content) {
                var _a, _b;
                return ({
                    programContentId: content.id,
                    programContentSectionId: content.content_section_id,
                    progress: ((_a = content.program_content_progress[0]) === null || _a === void 0 ? void 0 : _a.progress) || 0,
                    lastProgress: ((_b = content.program_content_progress[0]) === null || _b === void 0 ? void 0 : _b.last_progress) || 0,
                });
            });
        }));
    return {
        loadingProgress: loading,
        errorProgress: error,
        programContentProgress: programContentProgress,
        refetchProgress: refetch,
    };
};
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProgressContext.js.map
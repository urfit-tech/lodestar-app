var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Skeleton, Tabs } from 'antd';
import BraftEditor from 'braft-editor';
import { flatten } from 'ramda';
import React, { useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { ProgressContext } from '../../contexts/ProgressContext';
import { productMessages } from '../../helpers/translation';
import { usePublicMember } from '../../hooks/member';
import { useProgramContent } from '../../hooks/program';
import CreatorCard from '../common/CreatorCard';
import { BraftContent } from '../common/StyledBraftEditor';
import IssueThreadBlock from '../issue/IssueThreadBlock';
import ProgramContentPlayer from './ProgramContentPlayer';
var StyledContentBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1.25rem;\n  background-color: white;\n"], ["\n  padding: 1.25rem;\n  background-color: white;\n"])));
var StyledTitle = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-bottom: 1.25rem;\n  border-bottom: 1px solid #e8e8e8;\n  font-size: 20px;\n"], ["\n  padding-bottom: 1.25rem;\n  border-bottom: 1px solid #e8e8e8;\n  font-size: 20px;\n"])));
var ProgramContentBlock = function (_a) {
    var _b, _c, _d, _e;
    var program = _a.program, programContentId = _a.programContentId;
    var formatMessage = useIntl().formatMessage;
    var _f = useContext(ProgressContext), programContentProgress = _f.programContentProgress, refetchProgress = _f.refetchProgress, insertProgress = _f.insertProgress;
    var _g = useProgramContent(programContentId), loadingProgramContent = _g.loadingProgramContent, programContent = _g.programContent;
    var instructor = program.roles.filter(function (role) { return role.name === 'instructor'; })[0];
    var _h = usePublicMember((instructor === null || instructor === void 0 ? void 0 : instructor.memberId) || ''), loadingMember = _h.loadingMember, member = _h.member;
    var programContentBodyType = (_b = programContent === null || programContent === void 0 ? void 0 : programContent.programContentBody) === null || _b === void 0 ? void 0 : _b.type;
    var initialProgress = ((_c = programContentProgress.find(function (progress) { return progress.programContentId === programContentId; })) === null || _c === void 0 ? void 0 : _c.progress) || 0;
    var nextProgramContent = flatten(program.contentSections.map(function (v) { return v.contents; })).find(function (_, i, contents) { var _a; return ((_a = contents[i - 1]) === null || _a === void 0 ? void 0 : _a.id) === programContentId; });
    useEffect(function () {
        if (!loadingProgramContent && programContentBodyType !== 'video' && insertProgress) {
            insertProgress(programContentId, {
                progress: 1,
                lastProgress: 1,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingProgramContent, programContentBodyType, programContentId]);
    if (!programContent || !insertProgress || !refetchProgress) {
        return React.createElement(Skeleton, { active: true });
    }
    return (React.createElement("div", { id: "program_content_block", className: "pt-4 p-sm-4" },
        !programContent.programContentBody && formatMessage(productMessages.program.content.unpurchased),
        ((_d = programContent.programContentBody) === null || _d === void 0 ? void 0 : _d.type) === 'video' && (React.createElement(ProgramContentPlayer, { programContentId: programContent.id, programContentBody: programContent.programContentBody, nextProgramContent: nextProgramContent, lastProgress: ((_e = programContentProgress.find(function (progress) { return progress.programContentId === programContentId; })) === null || _e === void 0 ? void 0 : _e.lastProgress) || 0, onProgress: function (_a) {
                var played = _a.played;
                var currentProgress = Math.ceil(played * 20) / 20; // every 5% as a tick
                insertProgress(programContentId, {
                    progress: currentProgress > initialProgress ? currentProgress : initialProgress,
                    lastProgress: played,
                }).then(function () { return refetchProgress(); });
            }, onEnded: function () {
                setTimeout(function () {
                    insertProgress(programContentId, {
                        progress: 1,
                        lastProgress: 1,
                    });
                }, 3000);
            } })),
        React.createElement(StyledContentBlock, { className: "mb-3" },
            React.createElement(StyledTitle, { className: "mb-4 text-center" }, programContent.title),
            programContent.programContentBody &&
                !BraftEditor.createEditorState(programContent.programContentBody.description).isEmpty() && (React.createElement(BraftContent, null, programContent.programContentBody.description))),
        React.createElement("div", { className: "mb-3" }, loadingMember ? (React.createElement(Skeleton, { active: true, avatar: true })) : member ? (React.createElement(CreatorCard, { id: member.id, avatarUrl: member.pictureUrl, title: member.name || member.username, labels: [{ id: 'instructor', name: 'instructor' }], jobTitle: member.title, description: member.abstract, withProgram: true, withPodcast: true, withAppointment: true, withBlog: true })) : null),
        program.isIssuesOpen && (React.createElement(StyledContentBlock, null,
            React.createElement(Tabs, { defaultActiveKey: "issue" },
                React.createElement(Tabs.TabPane, { tab: formatMessage(productMessages.program.tab.discussion), key: "issue", className: "py-3" },
                    React.createElement(IssueThreadBlock, { programRoles: program.roles || [], threadId: "/programs/" + program.id + "/contents/" + programContentId })))))));
};
export default ProgramContentBlock;
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProgramContentBlock.js.map
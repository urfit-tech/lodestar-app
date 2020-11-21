var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { sum } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CustomRatioImage } from '../../components/common/Image';
import MemberAvatar from '../../components/common/MemberAvatar';
import ProgressBar from '../../components/common/ProgressBar';
import { useProgramContentProgress } from '../../contexts/ProgressContext';
import { useEnrolledProgramIds, useProgram } from '../../hooks/program';
import EmptyCover from '../../images/empty-cover.png';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow: hidden;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"], ["\n  overflow: hidden;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"])));
var StyledMeta = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 1.25rem;\n"], ["\n  padding: 1.25rem;\n"])));
var StyledTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-bottom: 1.25rem;\n  height: 3em;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-bottom: 1.25rem;\n  height: 3em;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledDescription = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-bottom: 1.25rem;\n  height: 3em;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-bottom: 1.25rem;\n  height: 3em;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var AvatarPlaceHolder = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  height: 2rem;\n"], ["\n  height: 2rem;\n"])));
var ProgramCard = function (_a) {
    var memberId = _a.memberId, programId = _a.programId, programType = _a.programType, noInstructor = _a.noInstructor, noPrice = _a.noPrice, withProgress = _a.withProgress;
    var program = useProgram(programId).program;
    var enrolledProgramIds = useEnrolledProgramIds(memberId).enrolledProgramIds;
    var _b = useProgramContentProgress(programId, memberId), loadingProgress = _b.loadingProgress, programContentProgress = _b.programContentProgress;
    var viewRate = programContentProgress.length
        ? sum(programContentProgress.map(function (contentProgress) { return contentProgress.progress; })) / programContentProgress.length
        : 0;
    var isEnrolled = enrolledProgramIds.includes(programId);
    return (React.createElement(React.Fragment, null,
        !noInstructor && (program === null || program === void 0 ? void 0 : program.roles) && (React.createElement(AvatarPlaceHolder, { className: "my-3" }, program.roles
            .filter(function (role) { return role.name === 'instructor'; })
            .slice(0, 1)
            .map(function (role) { return (React.createElement(MemberAvatar, { key: role.memberId, memberId: role.memberId, withName: true })); }))),
        React.createElement(Link, { to: isEnrolled
                ? "/programs/" + programId + "/contents"
                : "/programs/" + programId + (programType ? "?type=" + programType : '') },
            React.createElement(StyledWrapper, null,
                React.createElement(CustomRatioImage, { width: "100%", ratio: 9 / 16, src: program && program.coverUrl ? program.coverUrl : EmptyCover, shape: "rounded" }),
                React.createElement(StyledMeta, null,
                    React.createElement(StyledTitle, null, program && program.title),
                    React.createElement(StyledDescription, null, program && program.abstract),
                    withProgress && !loadingProgress && React.createElement(ProgressBar, { percent: Math.floor(viewRate * 100) }))))));
};
export default ProgramCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=ProgramCard.js.map
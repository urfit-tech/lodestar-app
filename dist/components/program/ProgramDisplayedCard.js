var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Typography } from 'antd';
import { sum } from 'ramda';
import React from 'react';
import styled from 'styled-components';
import { useProgramContentProgress } from '../../contexts/ProgressContext';
import EmptyCover from '../../images/empty-cover.png';
import ProgressBar from '../common/ProgressBar';
var StyledProgramCover = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-top: 56.25%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n  border-radius: 4px;\n"], ["\n  padding-top: 56.25%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n  border-radius: 4px;\n"])), function (props) { return props.src; });
var StyledProgramTitle = styled(Typography.Title)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    height: 3rem;\n    overflow: hidden;\n    color: var(--gray-darker);\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n  }\n"], ["\n  && {\n    height: 3rem;\n    overflow: hidden;\n    color: var(--gray-darker);\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n  }\n"])));
export var ProgramDisplayedCard = function (_a) {
    var program = _a.program, memberId = _a.memberId;
    var programContentProgress = useProgramContentProgress(program.id, memberId || '').programContentProgress;
    var viewRate = programContentProgress.length
        ? Math.floor((sum(programContentProgress.map(function (contentProgress) { return contentProgress.progress; })) / programContentProgress.length) *
            100)
        : 0;
    return (React.createElement("div", { className: "mb-4" },
        React.createElement(StyledProgramCover, { className: "mb-3", src: program.coverUrl || EmptyCover }),
        React.createElement(StyledProgramTitle, { level: 2, ellipsis: { rows: 2 }, className: "mb-3" }, program.title),
        memberId && React.createElement(ProgressBar, { percent: viewRate })));
};
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProgramDisplayedCard.js.map
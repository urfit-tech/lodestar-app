var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Typography } from 'antd';
import moment from 'moment';
import { sum } from 'ramda';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useProgramContentProgress } from '../../contexts/ProgressContext';
import { commonMessages } from '../../helpers/translation';
import CalendarOIcon from '../../images/calendar-alt-o.svg';
import EmptyCover from '../../images/empty-cover.png';
import ProgressBar from '../common/ProgressBar';
import { BREAK_POINT } from '../common/Responsive';
var StyledProgramDisplayItem = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-bottom: 1px solid var(--gray-light);\n  margin-bottom: 12px;\n\n  @media (min-width: ", "px) {\n    margin-bottom: 24px;\n  }\n"], ["\n  border-bottom: 1px solid var(--gray-light);\n  margin-bottom: 12px;\n\n  @media (min-width: ", "px) {\n    margin-bottom: 24px;\n  }\n"])), BREAK_POINT);
var StyledWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  padding-bottom: 12px;\n\n  @media (min-width: ", "px) {\n    padding: 0 20px 24px;\n  }\n"], ["\n  width: 100%;\n  padding-bottom: 12px;\n\n  @media (min-width: ", "px) {\n    padding: 0 20px 24px;\n  }\n"])), BREAK_POINT);
var StyledProgramCover = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  border-radius: 4px;\n  width: 7rem;\n  height: 3.9rem;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"], ["\n  border-radius: 4px;\n  width: 7rem;\n  height: 3.9rem;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"])), function (props) { return props.src; });
var StyledProgramInfo = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: column;\n  justify-content: space-between;\n\n  @media (min-width: ", "px) {\n    flex-flow: row;\n    align-items: center;\n  }\n"], ["\n  display: flex;\n  flex-flow: column;\n  justify-content: space-between;\n\n  @media (min-width: ", "px) {\n    flex-flow: row;\n    align-items: center;\n  }\n"])), BREAK_POINT);
var StyledProgramTitle = styled(Typography.Title)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  && {\n    margin: 0;\n    overflow: hidden;\n    color: var(--gray-darker);\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n  }\n"], ["\n  && {\n    margin: 0;\n    overflow: hidden;\n    color: var(--gray-darker);\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n  }\n"])));
var StyledExpiredTime = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.4px;\n  color: var(--gray-dark);\n"], ["\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.4px;\n  color: var(--gray-dark);\n"])));
var StyledProgressBar = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  width: 100%;\n  margin-top: 12px;\n\n  @media (min-width: ", "px) {\n    width: 100px;\n    margin-top: 0;\n  }\n"], ["\n  width: 100%;\n  margin-top: 12px;\n\n  @media (min-width: ", "px) {\n    width: 100px;\n    margin-top: 0;\n  }\n"])), BREAK_POINT);
export var ProgramDisplayedListItem = function (_a) {
    var program = _a.program, memberId = _a.memberId;
    var formatMessage = useIntl().formatMessage;
    var programContentProgress = useProgramContentProgress(program.id, memberId || '').programContentProgress;
    var viewRate = programContentProgress.length
        ? Math.floor((sum(programContentProgress.map(function (contentProgress) { return contentProgress.progress; })) / programContentProgress.length) *
            100)
        : 0;
    return (React.createElement(StyledProgramDisplayItem, null,
        React.createElement(StyledWrapper, { className: "d-flex justify-content-between align-items-center" },
            React.createElement(StyledProgramCover, { className: "flex-shrink-0 mr-4", src: program.coverUrl || EmptyCover }),
            React.createElement(StyledProgramInfo, { className: "flex-grow-1" },
                React.createElement("div", null,
                    React.createElement(StyledProgramTitle, { level: 2, ellipsis: { rows: 2 } }, program.title),
                    program.expiredAt && (React.createElement(StyledExpiredTime, { className: "mt-1 d-flex align-items-center" },
                        React.createElement(Icon, { src: CalendarOIcon, className: "mr-1" }),
                        React.createElement("span", { className: "mr-1" }, moment(program.expiredAt).format('YYYY-MM-DD')),
                        React.createElement("span", null, formatMessage(commonMessages.term.expiredAt))))),
                memberId && (React.createElement(StyledProgressBar, { className: "flex-shrink-0" },
                    React.createElement(ProgressBar, { percent: viewRate })))))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=ProgramDisplayedListItem.js.map
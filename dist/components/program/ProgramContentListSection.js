var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Divider, Icon, Tag, Typography } from 'antd';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import styled, { ThemeContext } from 'styled-components';
import { durationFormatter } from '../../helpers';
import { productMessages } from '../../helpers/translation';
import { useEnrolledProgramIds } from '../../hooks/program';
import ProgramContentTrialModal from './ProgramContentTrialModal';
var StyledTitle = styled.h2(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 24px;\n  letter-spacing: 0.2px;\n  color: #585858;\n"], ["\n  font-size: 24px;\n  letter-spacing: 0.2px;\n  color: #585858;\n"])));
var ProgramSectionBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 2.5rem;\n"], ["\n  margin-bottom: 2.5rem;\n"])));
var ProgramSectionTitle = styled.h3(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 20px;\n  font-weight: bold;\n"], ["\n  font-size: 20px;\n  font-weight: bold;\n"])));
var ProgramContentItem = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  position: relative;\n  margin-bottom: 12px;\n  padding: 1rem;\n  border-radius: 4px;\n  background-color: #f7f8f8;\n  font-size: 14px;\n  cursor: pointer;\n\n  .ant-typography-secondary {\n    font-size: 12px;\n  }\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  position: relative;\n  margin-bottom: 12px;\n  padding: 1rem;\n  border-radius: 4px;\n  background-color: #f7f8f8;\n  font-size: 14px;\n  cursor: pointer;\n\n  .ant-typography-secondary {\n    font-size: 12px;\n  }\n"])));
var StyledObscure = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  &::before {\n    content: ' ';\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    left: 0px;\n    top: 0px;\n    cursor: pointer;\n  }\n"], ["\n  &::before {\n    content: ' ';\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    left: 0px;\n    top: 0px;\n    cursor: pointer;\n  }\n"])));
var StyledTag = styled(Tag)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  && {\n    border: none;\n  }\n"], ["\n  && {\n    border: none;\n  }\n"])));
var StyledDuration = styled.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: rgb(155, 155, 155);\n"], ["\n  color: rgb(155, 155, 155);\n"])));
var ProgramContentListSection = function (_a) {
    var memberId = _a.memberId, program = _a.program, trialOnly = _a.trialOnly;
    var formatMessage = useIntl().formatMessage;
    var theme = useContext(ThemeContext);
    var enrolledProgramIds = useEnrolledProgramIds(memberId).enrolledProgramIds;
    var isEnrolled = enrolledProgramIds.includes(program.id);
    var trialProgramContents = program.contentSections.flatMap(function (programContentSection) {
        return programContentSection.contents.filter(function (programContent) { return programContent.listPrice === 0; }) || [];
    }) || [];
    if (trialOnly && trialProgramContents.length === 0) {
        return null;
    }
    if (trialOnly) {
        // subscription program
        return (React.createElement(React.Fragment, null,
            React.createElement(StyledTitle, null, formatMessage(productMessages.program.title.trial)),
            React.createElement(Divider, { className: "mt-1" }),
            trialProgramContents.map(function (programContent) {
                return (React.createElement(ProgramContentTrialModal, { key: programContent.id, programContentId: programContent.id, render: function (_a) {
                        var setVisible = _a.setVisible;
                        return (React.createElement(ProgramContentItem, { onClick: function () { return setVisible(true); } },
                            React.createElement(Typography.Text, null,
                                programContent.duration ? (React.createElement(Icon, { type: "video-camera", className: "mr-2" })) : (React.createElement(Icon, { type: "file-text", className: "mr-2" })),
                                programContent.title),
                            React.createElement(StyledDuration, null, durationFormatter(programContent.duration) || '')));
                    } }));
            })));
    }
    // perpetual program
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledTitle, null, formatMessage(productMessages.program.title.content)),
        React.createElement(Divider, { className: "mt-1" }),
        program.contentSections
            .filter(function (programContentSection) { return programContentSection.contents.length; })
            .map(function (programContentSection) { return (React.createElement(ProgramSectionBlock, { key: programContentSection.id },
            React.createElement(ProgramSectionTitle, { className: "mb-3" }, programContentSection.title),
            programContentSection.contents.map(function (programContent) { return (React.createElement(ProgramContentItem, { key: programContent.id },
                React.createElement(Typography.Text, null,
                    programContent.contentType === 'video' ? (React.createElement(Icon, { type: "video-camera", className: "mr-2" })) : (React.createElement(Icon, { type: "file-text", className: "mr-2" })),
                    React.createElement("span", null, programContent.title)),
                React.createElement(StyledDuration, null,
                    programContent.listPrice === 0 && !isEnrolled && (React.createElement(ProgramContentTrialModal, { programContentId: programContent.id, render: function (_a) {
                            var setVisible = _a.setVisible;
                            return (React.createElement(StyledObscure, { onClick: function () { return setVisible(true); } },
                                React.createElement(StyledTag, { color: theme['@primary-color'] }, formatMessage(productMessages.program.content.trial))));
                        } })),
                    durationFormatter(programContent.duration) || ''))); }))); })));
};
export default ProgramContentListSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=ProgramContentListSection.js.map
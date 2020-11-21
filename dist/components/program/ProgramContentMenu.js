var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Card, Icon, Select } from 'antd';
import { flatten, sum } from 'ramda';
import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ProgressContext } from '../../contexts/ProgressContext';
import { dateFormatter, durationFormatter, rgba } from '../../helpers';
import { productMessages } from '../../helpers/translation';
var StyledProgramContentMenu = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: white;\n  font-size: 14px;\n"], ["\n  background: white;\n  font-size: 14px;\n"])));
var StyledHead = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 1.25rem;\n"], ["\n  padding: 1.25rem;\n"])));
var StyledSelectBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  .ant-select-selection--single {\n    height: 32px;\n  }\n  .ant-select-selection-selected-value {\n    padding-right: 0.5rem;\n    font-size: 14px;\n  }\n  .ant-select-selection__rendered {\n    line-height: 32px;\n  }\n"], ["\n  .ant-select-selection--single {\n    height: 32px;\n  }\n  .ant-select-selection-selected-value {\n    padding-right: 0.5rem;\n    font-size: 14px;\n  }\n  .ant-select-selection__rendered {\n    line-height: 32px;\n  }\n"])));
var StyledContentSection = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  border-top: 1px solid #ececec;\n"], ["\n  border-top: 1px solid #ececec;\n"])));
var StyledContentSectionTitle = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 1.25rem;\n  padding-right: 0.75rem;\n  font-size: 16px;\n  font-weight: bold;\n  cursor: pointer;\n"], ["\n  padding: 1.25rem;\n  padding-right: 0.75rem;\n  font-size: 16px;\n  font-weight: bold;\n  cursor: pointer;\n"])));
var StyledContentSectionBody = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  overflow: hidden;\n  height: ", ";\n  /* not working */\n  /* transition: all 0.3s ease-out; */\n"], ["\n  overflow: hidden;\n  height: ", ";\n  /* not working */\n  /* transition: all 0.3s ease-out; */\n"])), function (props) { return (props.active ? '100%' : '0'); });
var StyledProgressLabel = styled.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  padding: 0 0.5rem;\n  border-radius: 11px;\n  background-color: ", ";\n  color: ", ";\n  font-size: 12px;\n  font-weight: normal;\n  letter-spacing: 0.6px;\n  line-height: 22px;\n"], ["\n  padding: 0 0.5rem;\n  border-radius: 11px;\n  background-color: ", ";\n  color: ", ";\n  font-size: 12px;\n  font-weight: normal;\n  letter-spacing: 0.6px;\n  line-height: 22px;\n"])), function (props) { return (props.active ? rgba(props.theme['@primary-color'], 0.1) : 'var(--gray-lighter)'); }, function (props) { return (props.active ? props.theme['@primary-color'] : 'var(--gray-dark)'); });
var StyledItemTitle = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: #585858;\n  font-size: 14px;\n"], ["\n  color: #585858;\n  font-size: 14px;\n"])));
var StyledIconWrapper = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  position: absolute;\n  top: 16px;\n  right: 12px;\n  width: 20px;\n  height: 20px;\n  border: 1px solid transparent;\n  border-radius: 50%;\n  text-align: center;\n  font-size: 10px;\n  line-height: 20px;\n"], ["\n  position: absolute;\n  top: 16px;\n  right: 12px;\n  width: 20px;\n  height: 20px;\n  border: 1px solid transparent;\n  border-radius: 50%;\n  text-align: center;\n  font-size: 10px;\n  line-height: 20px;\n"])));
var StyledItem = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  position: relative;\n  padding: 0.75rem 2rem;\n  padding-right: 4rem;\n  color: #9b9b9b;\n  font-size: 12px;\n  cursor: pointer;\n\n  &.active {\n    background: ", ";\n    color: ", ";\n  }\n  &.unread ", " {\n    border-color: #cdcdcd;\n    color: transparent;\n  }\n  &.half ", " {\n    background: #cdcdcd;\n    color: #9b9b9b;\n  }\n  &.done ", " {\n    background: ", ";\n    color: white;\n  }\n"], ["\n  position: relative;\n  padding: 0.75rem 2rem;\n  padding-right: 4rem;\n  color: #9b9b9b;\n  font-size: 12px;\n  cursor: pointer;\n\n  &.active {\n    background: ", ";\n    color: ", ";\n  }\n  &.unread ", " {\n    border-color: #cdcdcd;\n    color: transparent;\n  }\n  &.half ", " {\n    background: #cdcdcd;\n    color: #9b9b9b;\n  }\n  &.done ", " {\n    background: ", ";\n    color: white;\n  }\n"])), function (props) { return rgba(props.theme['@primary-color'], 0.1); }, function (props) { return props.theme['@primary-color']; }, StyledIconWrapper, StyledIconWrapper, StyledIconWrapper, function (props) { return props.theme['@primary-color']; });
var ProgramContentMenu = function (_a) {
    var program = _a.program, onSelect = _a.onSelect;
    var formatMessage = useIntl().formatMessage;
    var _b = useState('section'), sortBy = _b[0], setSortBy = _b[1];
    var search = useLocation().search;
    var query = new URLSearchParams(search);
    var programPackageId = query.get('back');
    return (React.createElement(StyledProgramContentMenu, null,
        React.createElement(StyledHead, { className: "d-flex justify-content-between align-items-center" },
            React.createElement("span", null, formatMessage(productMessages.program.content.programList)),
            React.createElement(StyledSelectBlock, null,
                React.createElement(Select, { size: "default", value: sortBy, onChange: function (value) { return setSortBy(value); } },
                    React.createElement(Select.Option, { value: "section" }, formatMessage(productMessages.program.select.option.unit)),
                    React.createElement(Select.Option, { value: "date" }, formatMessage(productMessages.program.select.option.time))))),
        sortBy === 'section' && (React.createElement(ProgramContentMenuBySection, { program: program, programPackageId: programPackageId, onSelect: onSelect })),
        sortBy === 'date' && (React.createElement(ProgramContentMenuByDate, { program: program, programPackageId: programPackageId, onSelect: onSelect }))));
};
var ProgramContentMenuBySection = function (_a) {
    var program = _a.program, programPackageId = _a.programPackageId, onSelect = _a.onSelect;
    var programContentId = useParams().programContentId;
    if (!program.contentSections || program.contentSections.length === 0) {
        return React.createElement(EmptyMenu, null);
    }
    return (React.createElement(React.Fragment, null, program.contentSections.map(function (v, i) { return (React.createElement(ContentSection, { key: v.id, defaultCollapse: programContentId ? v.contents.some(function (w) { return w.id === programContentId; }) : i === 0, programContentSection: v, programPackageId: programPackageId, onSelect: onSelect })); })));
};
var ContentSection = function (_a) {
    var _b;
    var programContentSection = _a.programContentSection, programPackageId = _a.programPackageId, defaultCollapse = _a.defaultCollapse, onSelect = _a.onSelect;
    var programContentProgress = useContext(ProgressContext).programContentProgress;
    var _c = useState(defaultCollapse), isCollapse = _c[0], setIsCollapse = _c[1];
    var contentProgress = programContentProgress.filter(function (progress) { return progress.programContentSectionId === programContentSection.id; });
    var sectionProgress = contentProgress.length
        ? Math.floor((sum(contentProgress.map(function (progress) { return progress.progress; })) * 100) / contentProgress.length)
        : 0;
    return (React.createElement(StyledContentSection, { key: programContentSection.id },
        React.createElement(StyledContentSectionTitle, { className: "d-flex justify-content-between align-items-center", onClick: function () { return setIsCollapse(!isCollapse); } },
            React.createElement("span", null, programContentSection.title),
            React.createElement(StyledProgressLabel, { active: sectionProgress === 100 },
                sectionProgress,
                "%")),
        React.createElement(StyledContentSectionBody, { active: isCollapse }, (_b = programContentSection.contents) === null || _b === void 0 ? void 0 : _b.map(function (programContent) {
            var _a;
            return (React.createElement(SortBySectionItem, { key: programContent.id, programContent: programContent, progress: ((_a = contentProgress.find(function (progress) { return progress.programContentId === programContent.id; })) === null || _a === void 0 ? void 0 : _a.progress) || 0, programPackageId: programPackageId, onSetIsCollapse: setIsCollapse, onClick: function () { return onSelect === null || onSelect === void 0 ? void 0 : onSelect(programContent.id); } }));
        }))));
};
var SortBySectionItem = function (_a) {
    var programContent = _a.programContent, progress = _a.progress, programPackageId = _a.programPackageId, onSetIsCollapse = _a.onSetIsCollapse, onClick = _a.onClick;
    var history = useHistory();
    var _b = useParams(), programId = _b.programId, programContentId = _b.programContentId;
    var progressStatus = progress === 0 ? 'unread' : progress === 1 ? 'done' : 'half';
    var isActive = programContent.id === programContentId;
    useEffect(function () {
        if (isActive) {
            onSetIsCollapse === null || onSetIsCollapse === void 0 ? void 0 : onSetIsCollapse(true);
        }
    }, [isActive, onSetIsCollapse]);
    return (React.createElement(StyledItem, { className: progressStatus + " " + (isActive ? 'active' : ''), onClick: function () {
            onClick === null || onClick === void 0 ? void 0 : onClick();
            history.push("/programs/" + programId + "/contents/" + programContent.id + (programPackageId !== null ? "?back=" + programPackageId : ''));
        } },
        React.createElement(StyledItemTitle, { className: "mb-2" }, programContent.title),
        React.createElement(StyledIconWrapper, null,
            React.createElement(Icon, { type: "check" })),
        programContent.contentType === 'video' ? (React.createElement("div", null,
            React.createElement(Icon, { type: "video-camera", className: "mr-2" }),
            durationFormatter(programContent.duration))) : (React.createElement("div", null,
            React.createElement(Icon, { type: "file-text" })))));
};
var ProgramContentMenuByDate = function (_a) {
    var program = _a.program, programPackageId = _a.programPackageId, onSelect = _a.onSelect;
    var programContentProgress = useContext(ProgressContext).programContentProgress;
    var programContents = flatten(program.contentSections.map(function (programContentSection) { return programContentSection.contents; }));
    if (programContents.length === 0) {
        return React.createElement(EmptyMenu, null);
    }
    return (React.createElement("div", null, programContents.map(function (programContent) {
        var _a;
        return (React.createElement(SortByDateItem, { key: programContent.id, programContent: programContent, progress: ((_a = programContentProgress.find(function (progress) { return progress.programContentId === programContent.id; })) === null || _a === void 0 ? void 0 : _a.progress) || 0, programPackageId: programPackageId, onClick: function () { return onSelect && onSelect(programContent.id); } }));
    })));
};
var SortByDateItem = function (_a) {
    var programContent = _a.programContent, progress = _a.progress, programPackageId = _a.programPackageId, onClick = _a.onClick;
    var history = useHistory();
    var _b = useParams(), programId = _b.programId, programContentId = _b.programContentId;
    var progressStatus = progress === 0 ? 'unread' : progress === 1 ? 'done' : 'half';
    return (React.createElement(StyledItem, { className: progressStatus + " " + (programContent.id === programContentId ? 'active' : ''), onClick: function () {
            onClick === null || onClick === void 0 ? void 0 : onClick();
            history.push("/programs/" + programId + "/contents/" + programContent.id + (programPackageId !== null ? "?back=" + programPackageId : ''));
        } },
        React.createElement(StyledItemTitle, { className: "mb-3" }, programContent.title),
        React.createElement(StyledIconWrapper, null,
            React.createElement(Icon, { type: "check" })),
        React.createElement("div", null,
            React.createElement(Icon, { type: "calendar", className: "mr-2" }),
            programContent.publishedAt && dateFormatter(programContent.publishedAt))));
};
var EmptyMenu = function () { return (React.createElement(Card, { style: { textAlign: 'center', color: '#9b9b9b' } }, "\u521D\u6B21\u8CFC\u8CB7\u9084\u6C92\u6709\u65B0\u7684\u5167\u5BB9\u5594\uFF5E")); };
export default ProgramContentMenu;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=ProgramContentMenu.js.map
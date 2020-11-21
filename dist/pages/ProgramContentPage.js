var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Layout, PageHeader } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../components/auth/AuthContext';
import { BREAK_POINT } from '../components/common/Responsive';
import { StyledLayoutContent } from '../components/layout/DefaultLayout.styled';
import ProgramContentBlock from '../components/program/ProgramContentBlock';
import ProgramContentMenu from '../components/program/ProgramContentMenu';
import { ProgressProvider } from '../contexts/ProgressContext';
import { commonMessages } from '../helpers/translation';
import { useProgram } from '../hooks/program';
var StyledPageHeader = styled(PageHeader)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    padding: 1rem 1.5rem;\n    height: 4rem;\n    background: white;\n  }\n\n  .ant-page-header-heading {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .ant-page-header-heading-title,\n  .ant-divider {\n    display: none;\n  }\n\n  .ant-page-header-heading-extra {\n    width: auto;\n    padding: 0;\n  }\n\n  @media (min-width: ", "px) {\n    .ant-page-header-heading-title {\n      display: block;\n      flex-grow: 1;\n      font-size: 16px;\n      line-height: 32px;\n    }\n  }\n"], ["\n  && {\n    padding: 1rem 1.5rem;\n    height: 4rem;\n    background: white;\n  }\n\n  .ant-page-header-heading {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .ant-page-header-heading-title,\n  .ant-divider {\n    display: none;\n  }\n\n  .ant-page-header-heading-extra {\n    width: auto;\n    padding: 0;\n  }\n\n  @media (min-width: ", "px) {\n    .ant-page-header-heading-title {\n      display: block;\n      flex-grow: 1;\n      font-size: 16px;\n      line-height: 32px;\n    }\n  }\n"])), BREAK_POINT);
var StyledSideBar = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  height: calc(100vh - 64px);\n  overflow-y: auto;\n  background: white;\n  box-shadow: rgba(0, 0, 0, 0.1) -3px 10px 10px 0px;\n"], ["\n  height: calc(100vh - 64px);\n  overflow-y: auto;\n  background: white;\n  box-shadow: rgba(0, 0, 0, 0.1) -3px 10px 10px 0px;\n"])));
var ProgramContentPage = function () {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _a = useParams(), programId = _a.programId, programContentId = _a.programContentId;
    var currentMemberId = useAuth().currentMemberId;
    var _b = useProgram(programId), loadingProgram = _b.loadingProgram, program = _b.program;
    var _c = useState(window.innerWidth >= BREAK_POINT), menuVisible = _c[0], setMenuVisible = _c[1];
    var search = useLocation().search;
    var query = new URLSearchParams(search);
    var programPackageId = query.get('back');
    if (loadingProgram || !program || !currentMemberId) {
        return (React.createElement(Layout, null,
            React.createElement(StyledPageHeader, { title: "", extra: React.createElement("div", null,
                    React.createElement(Button, { type: "link", size: "small", icon: "profile", onClick: function () { return window.open("/programs/" + programId); } }, formatMessage(commonMessages.button.intro)),
                    React.createElement(Button, { type: "link", size: "small", icon: "unordered-list", onClick: function () { return setMenuVisible(!menuVisible); } }, formatMessage(commonMessages.button.list))) })));
    }
    return (React.createElement(Layout, null,
        React.createElement(StyledPageHeader, { title: program.title, extra: React.createElement("div", null,
                React.createElement(Button, { type: "link", size: "small", icon: "profile", onClick: function () { return window.open("/programs/" + programId); } }, formatMessage(commonMessages.button.intro)),
                React.createElement(Button, { type: "link", size: "small", icon: "unordered-list", onClick: function () { return setMenuVisible(!menuVisible); } }, formatMessage(commonMessages.button.list))), onBack: function () {
                return history.push("/programs/" + programId + "/contents" + (programPackageId !== null ? "?back=" + programPackageId : ''));
            } }),
        React.createElement(ProgressProvider, { programId: program.id, memberId: currentMemberId },
            React.createElement(StyledLayoutContent, null,
                React.createElement("div", { className: "row no-gutters" },
                    React.createElement("div", { className: menuVisible ? 'd-none d-lg-block col-lg-9' : 'col-12' },
                        React.createElement(StyledLayoutContent, null,
                            React.createElement(ProgramContentBlock, { program: program, programContentId: programContentId }))),
                    React.createElement("div", { className: menuVisible ? 'col-12 col-lg-3' : 'd-none' },
                        React.createElement(StyledSideBar, null,
                            React.createElement(ProgramContentMenu, { program: program, onSelect: function () { return window.innerWidth < BREAK_POINT && setMenuVisible(false); } }))))))));
};
export default ProgramContentPage;
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProgramContentPage.js.map
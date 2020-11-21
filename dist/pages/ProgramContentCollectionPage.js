var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Layout, PageHeader, Spin } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useAuth } from '../components/auth/AuthContext';
import AdminCard from '../components/common/AdminCard';
import { StyledLayoutContent } from '../components/layout/DefaultLayout.styled';
import ProgramContentMenu from '../components/program/ProgramContentMenu';
import { ProgressProvider } from '../contexts/ProgressContext';
import { commonMessages } from '../helpers/translation';
import { useProgram } from '../hooks/program';
var StyledPCPageHeader = styled(PageHeader)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    padding: 10px 24px;\n    height: 64px;\n    background: white;\n  }\n\n  .ant-page-header-heading {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .ant-page-header-heading-title {\n    display: block;\n    flex-grow: 1;\n    overflow: hidden;\n    font-size: 16px;\n    line-height: 44px;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .ant-page-header-heading-extra {\n    padding: 0;\n  }\n"], ["\n  && {\n    padding: 10px 24px;\n    height: 64px;\n    background: white;\n  }\n\n  .ant-page-header-heading {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  }\n\n  .ant-page-header-heading-title {\n    display: block;\n    flex-grow: 1;\n    overflow: hidden;\n    font-size: 16px;\n    line-height: 44px;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .ant-page-header-heading-extra {\n    padding: 0;\n  }\n"])));
var ProgramContentCollectionPage = function () {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var programId = useParams().programId;
    var productId = useQueryParam('back', StringParam)[0];
    var currentMemberId = useAuth().currentMemberId;
    var _a = useProgram(programId), loadingProgram = _a.loadingProgram, program = _a.program;
    return (React.createElement(Layout, null,
        React.createElement(StyledPCPageHeader, { className: "d-flex align-items-center", title: program && program.title, extra: React.createElement(Button, { icon: "profile", type: "link", onClick: function () { return history.push("/programs/" + programId); } }, formatMessage(commonMessages.button.intro)), onBack: function () {
                if (productId) {
                    var _a = productId.split('_'), productType = _a[0], id = _a[1];
                    if (productType === 'program-package') {
                        history.push("/program-packages/" + id + "/contents");
                    }
                    if (productType === 'project') {
                        history.push("/projects/" + id);
                    }
                }
                else {
                    history.push("/members/" + currentMemberId);
                }
            } }),
        React.createElement(StyledLayoutContent, null,
            React.createElement("div", { className: "container py-5" },
                React.createElement(AdminCard, null, !currentMemberId || loadingProgram || !program ? (React.createElement(Spin, null)) : (React.createElement(ProgressProvider, { programId: program.id, memberId: currentMemberId },
                    React.createElement(ProgramContentMenu, { program: program }))))))));
};
export default ProgramContentCollectionPage;
var templateObject_1;
//# sourceMappingURL=ProgramContentCollectionPage.js.map
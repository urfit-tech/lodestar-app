var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Modal } from 'antd';
import BraftEditor from 'braft-editor';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useProgramContent } from '../../hooks/program';
import { BraftContent } from '../common/StyledBraftEditor';
import ProgramContentPlayer from './ProgramContentPlayer';
var StyledModal = styled(Modal)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin: 0;\n  padding: 0;\n  width: 100% !important;\n  max-width: 720px;\n\n  .ant-modal-content {\n    padding-bottom: 24px;\n  }\n\n  .ant-modal-header {\n    padding: 24px;\n    border-bottom: none;\n    font-weight: bold;\n  }\n\n  .ant-modal-title {\n    font-size: 18px;\n  }\n\n  .ant-modal-body {\n    max-height: 70vh;\n    overflow-y: auto;\n    padding: 0 24px;\n  }\n\n  .ant-modal-body > div:not(:last-child) {\n    margin-bottom: 40px;\n  }\n"], ["\n  margin: 0;\n  padding: 0;\n  width: 100% !important;\n  max-width: 720px;\n\n  .ant-modal-content {\n    padding-bottom: 24px;\n  }\n\n  .ant-modal-header {\n    padding: 24px;\n    border-bottom: none;\n    font-weight: bold;\n  }\n\n  .ant-modal-title {\n    font-size: 18px;\n  }\n\n  .ant-modal-body {\n    max-height: 70vh;\n    overflow-y: auto;\n    padding: 0 24px;\n  }\n\n  .ant-modal-body > div:not(:last-child) {\n    margin-bottom: 40px;\n  }\n"])));
var ProgramContentTrialModal = function (_a) {
    var render = _a.render, programContentId = _a.programContentId, modalProps = __rest(_a, ["render", "programContentId"]);
    var programContent = useProgramContent(programContentId).programContent;
    var _b = useState(false), visible = _b[0], setVisible = _b[1];
    return (React.createElement(React.Fragment, null,
        render && render({ setVisible: setVisible }),
        React.createElement(StyledModal, __assign({ title: programContent && programContent.title, footer: null, visible: visible, centered: true, destroyOnClose: true, onCancel: function () {
                setVisible(false);
            } }, modalProps), programContent && programContent.programContentBody && (React.createElement(React.Fragment, null,
            programContent.programContentBody.type === 'video' && (React.createElement(ProgramContentPlayer, { programContentBody: programContent.programContentBody })),
            !BraftEditor.createEditorState(programContent.programContentBody.description).isEmpty() && (React.createElement(BraftContent, null, programContent.programContentBody.description)))))));
};
export default ProgramContentTrialModal;
var templateObject_1;
//# sourceMappingURL=ProgramContentTrialModal.js.map
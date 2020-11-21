var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Divider, Modal } from 'antd';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { BREAK_POINT } from '../common/Responsive';
import LoginSection from './LoginSection';
import RegisterSection from './RegisterSection';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ant-form-explain {\n    font-size: 14px;\n  }\n\n  .ant-form-item {\n    margin-bottom: 1.25rem;\n  }\n\n  @media (min-width: ", "px) {\n    padding: 1rem;\n  }\n"], ["\n  .ant-form-explain {\n    font-size: 14px;\n  }\n\n  .ant-form-item {\n    margin-bottom: 1.25rem;\n  }\n\n  @media (min-width: ", "px) {\n    padding: 1rem;\n  }\n"])), BREAK_POINT);
export var StyledTitle = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 1.5rem;\n  color: #585858;\n  font-size: 24px;\n  font-weight: bold;\n  text-align: center;\n  letter-spacing: 0.2px;\n"], ["\n  margin-bottom: 1.5rem;\n  color: #585858;\n  font-size: 24px;\n  font-weight: bold;\n  text-align: center;\n  letter-spacing: 0.2px;\n"])));
export var StyledDivider = styled(Divider)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    padding: 1rem;\n\n    .ant-divider-inner-text {\n      color: #9b9b9b;\n      font-size: 12px;\n    }\n  }\n"], ["\n  && {\n    padding: 1rem;\n\n    .ant-divider-inner-text {\n      color: #9b9b9b;\n      font-size: 12px;\n    }\n  }\n"])));
export var StyledAction = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: #9b9b9b;\n  font-size: 14px;\n  text-align: center;\n"], ["\n  color: #9b9b9b;\n  font-size: 14px;\n  text-align: center;\n"])));
export var AuthModalContext = React.createContext({ visible: false });
var AuthModal = function (_a) {
    var defaultAuthState = _a.defaultAuthState, onAuthStateChange = _a.onAuthStateChange;
    var _b = useContext(AuthModalContext), visible = _b.visible, setVisible = _b.setVisible;
    var _c = useState(defaultAuthState || 'login'), authState = _c[0], setAuthState = _c[1];
    return (React.createElement(Modal, { centered: true, width: window.innerWidth > BREAK_POINT ? window.innerWidth / 3 : window.innerWidth, footer: null, onCancel: function () { return setVisible && setVisible(false); }, visible: visible },
        React.createElement(StyledContainer, null, authState === 'login' ? (React.createElement(LoginSection, { onAuthStateChange: setAuthState })) : authState === 'register' ? (React.createElement(RegisterSection, { onAuthStateChange: setAuthState })) : null)));
};
export default AuthModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=AuthModal.js.map
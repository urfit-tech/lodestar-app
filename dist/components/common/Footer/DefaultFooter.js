var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Divider, Dropdown, Icon, Menu } from 'antd';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { NavLinks, SocialLinks, StyledFooter } from '.';
import { useApp } from '../../../containers/common/AppContext';
import LanguageContext from '../../../contexts/LanguageContext';
import { BREAK_POINT } from '../Responsive';
var StyledLinkBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-top: 1.25rem;\n"], ["\n  padding-top: 1.25rem;\n"])));
var StyledContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    button {\n      padding: 0;\n      color: var(--gray-dark);\n      > * {\n        font-size: 12px;\n      }\n    }\n  }\n\n  @media (min-width: ", "px) {\n    > .copyright {\n      order: -1;\n    }\n  }\n"], ["\n  && {\n    button {\n      padding: 0;\n      color: var(--gray-dark);\n      > * {\n        font-size: 12px;\n      }\n    }\n  }\n\n  @media (min-width: ", "px) {\n    > .copyright {\n      order: -1;\n    }\n  }\n"])), BREAK_POINT);
var StyledButton = styled(Button)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    color: var(--gray-dark);\n    font-size: 14px;\n  }\n"], ["\n  && {\n    color: var(--gray-dark);\n    font-size: 14px;\n  }\n"])));
var StyledCopyright = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 0.75rem;\n"], ["\n  font-size: 0.75rem;\n"])));
var DefaultFooter = function () {
    var _a = useContext(LanguageContext), currentLanguage = _a.currentLanguage, setCurrentLanguage = _a.setCurrentLanguage;
    var _b = useApp(), enabledModules = _b.enabledModules, name = _b.name;
    return (React.createElement(StyledFooter, null,
        React.createElement(StyledContainer, { className: "container d-flex align-items-center justify-content-center flex-wrap" },
            React.createElement("div", { className: "order-1 d-flex align-items-center" },
                React.createElement(StyledLinkBlock, { className: "d-flex align-items-center justify-content-center flex-wrap" },
                    React.createElement(NavLinks, null),
                    React.createElement("div", { className: "blank" }),
                    React.createElement(SocialLinks, null)),
                enabledModules.locale && (React.createElement("div", null,
                    React.createElement(Divider, { type: "vertical", className: "mx-3" }),
                    React.createElement(Dropdown, { trigger: ['click'], overlay: React.createElement(Menu, null,
                            React.createElement(Menu.Item, { key: "zh" },
                                React.createElement(StyledButton, { type: "link", size: "small", onClick: function () { return setCurrentLanguage && setCurrentLanguage('zh'); } }, "\u7E41\u9AD4\u4E2D\u6587")),
                            React.createElement(Menu.Item, { key: "en" },
                                React.createElement(StyledButton, { type: "link", size: "small", onClick: function () { return setCurrentLanguage && setCurrentLanguage('en'); } }, "English")),
                            React.createElement(Menu.Item, { key: "vi" },
                                React.createElement(StyledButton, { type: "link", size: "small", onClick: function () { return setCurrentLanguage && setCurrentLanguage('vi'); } }, "Ti\u1EBFng vi\u1EC7t"))) },
                        React.createElement(StyledButton, { type: "link", size: "small" },
                            currentLanguage === 'en' ? 'EN' : currentLanguage === 'vi' ? 'Tiếng việt' : '繁中',
                            React.createElement(Icon, { type: "down" })))))),
            React.createElement("div", { className: "blank" }),
            React.createElement(StyledCopyright, { className: "py-3 copyright" },
                "Copyright \u00A9 ",
                new Date().getFullYear(),
                " ",
                name,
                " Inc. All rights reserved"))));
};
export default DefaultFooter;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=DefaultFooter.js.map
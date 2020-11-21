var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { StyledFooter, StyledNavAnchor, StyledNavLink } from '.';
import { useApp } from '../../../containers/common/AppContext';
import { BREAK_POINT } from '../Responsive';
var StyledLinkBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-top: 1.25rem;\n"], ["\n  padding-top: 1.25rem;\n"])));
var StyledContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    button {\n      padding: 0;\n      color: var(--gray-dark);\n      > * {\n        font-size: 12px;\n      }\n    }\n  }\n\n  @media (min-width: ", "px) {\n    > .copyright {\n      order: -1;\n    }\n  }\n"], ["\n  && {\n    button {\n      padding: 0;\n      color: var(--gray-dark);\n      > * {\n        font-size: 12px;\n      }\n    }\n  }\n\n  @media (min-width: ", "px) {\n    > .copyright {\n      order: -1;\n    }\n  }\n"])), BREAK_POINT);
var StyledCopyright = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 0.75rem;\n"], ["\n  font-size: 0.75rem;\n"])));
var ModularBriefFooter = function (_a) {
    var navs = _a.navs;
    var name = useApp().name;
    return (React.createElement(StyledFooter, null,
        React.createElement(StyledContainer, { className: "container d-flex align-items-center justify-content-center flex-wrap" },
            React.createElement("div", { className: "order-1 d-flex align-items-center" },
                React.createElement(StyledLinkBlock, { className: "d-flex align-items-center justify-content-center flex-wrap" }, navs.map(function (nav) {
                    return nav.external ? (React.createElement(StyledNavAnchor, { key: nav.label, href: nav.href, target: "_blank", rel: "noopener noreferrer" }, nav.label)) : (React.createElement(StyledNavLink, { key: nav.label, to: nav.href }, nav.label));
                }))),
            React.createElement("div", { className: "blank" }),
            React.createElement(StyledCopyright, { className: "py-3 copyright" },
                "Copyright \u00A9 ",
                new Date().getFullYear(),
                " ",
                name,
                " Inc. All rights reserved"))));
};
export default ModularBriefFooter;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ModularBriefFooter.js.map
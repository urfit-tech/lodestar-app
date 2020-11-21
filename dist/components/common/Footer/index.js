var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useContext } from 'react';
import Icon from 'react-inlinesvg';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../../../containers/common/AppContext';
import LanguageContext from '../../../contexts/LanguageContext';
import FacebookIcon from '../../../images/facebook-icon.svg';
import GroupIcon from '../../../images/group-icon.svg';
import InstagramIcon from '../../../images/instagram-icon.svg';
import YoutubeIcon from '../../../images/youtube-icon.svg';
import { BREAK_POINT } from '../Responsive';
import DefaultFooter from './DefaultFooter';
import MultilineFooter from './MultilineFooter';
export var StyledFooter = styled.footer(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: white;\n  border-top: 1px solid #ececec;\n  color: #9b9b9b;\n\n  a {\n    margin-bottom: 1.25rem;\n    line-height: 1;\n  }\n\n  .blank {\n    width: 100%;\n  }\n  .divider {\n    border-top: 1px solid #ececec;\n  }\n\n  @media (min-width: ", "px) {\n    .blank {\n      width: auto;\n      flex-grow: 1;\n    }\n  }\n"], ["\n  background: white;\n  border-top: 1px solid #ececec;\n  color: #9b9b9b;\n\n  a {\n    margin-bottom: 1.25rem;\n    line-height: 1;\n  }\n\n  .blank {\n    width: 100%;\n  }\n  .divider {\n    border-top: 1px solid #ececec;\n  }\n\n  @media (min-width: ", "px) {\n    .blank {\n      width: auto;\n      flex-grow: 1;\n    }\n  }\n"])), BREAK_POINT);
export var StyledNavLink = styled(Link)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 14px;\n  color: #9b9b9b;\n  &:not(:first-child) {\n    margin-left: 2rem;\n  }\n"], ["\n  font-size: 14px;\n  color: #9b9b9b;\n  &:not(:first-child) {\n    margin-left: 2rem;\n  }\n"])));
export var StyledNavAnchor = styled.a(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 14px;\n  color: #9b9b9b;\n  &:not(:first-child) {\n    margin-left: 2rem;\n  }\n"], ["\n  font-size: 14px;\n  color: #9b9b9b;\n  &:not(:first-child) {\n    margin-left: 2rem;\n  }\n"])));
var StyledSocialAnchor = styled.a(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  border: solid 0.5px #ececec;\n  border-radius: 50%;\n  color: #585858;\n\n  &:not(:first-child) {\n    margin-left: 0.75rem;\n  }\n\n  @media (min-width: ", "px) {\n    .blank + & {\n      margin-left: 2rem;\n    }\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  border: solid 0.5px #ececec;\n  border-radius: 50%;\n  color: #585858;\n\n  &:not(:first-child) {\n    margin-left: 0.75rem;\n  }\n\n  @media (min-width: ", "px) {\n    .blank + & {\n      margin-left: 2rem;\n    }\n  }\n"])), BREAK_POINT);
export var NavLinks = function () {
    var navs = useApp().navs;
    var currentLanguage = useContext(LanguageContext).currentLanguage;
    return (React.createElement(React.Fragment, null, navs
        .filter(function (nav) { return nav.block === 'footer' && nav.locale === currentLanguage; })
        .map(function (nav) {
        return nav.external ? (React.createElement(StyledNavAnchor, { key: nav.label, href: nav.href, target: "_blank", rel: "noopener noreferrer" }, nav.label)) : (React.createElement(StyledNavLink, { key: nav.label, to: nav.href }, nav.label));
    })));
};
export var SocialLinks = function () {
    var navs = useApp().navs;
    return (React.createElement(React.Fragment, null, navs
        .filter(function (nav) { return nav.block === 'social_media'; })
        .map(function (socialLink) { return (React.createElement(StyledSocialAnchor, { key: socialLink.label, href: socialLink.href, target: "_blank", rel: "noopener noreferrer" },
        socialLink.label === 'facebook' && React.createElement(Icon, { src: FacebookIcon }),
        socialLink.label === 'group' && React.createElement(Icon, { src: GroupIcon }),
        socialLink.label === 'youtube' && React.createElement(Icon, { src: YoutubeIcon }),
        socialLink.label === 'instagram' && React.createElement(Icon, { src: InstagramIcon }))); })));
};
var Footer = function () {
    var settings = useApp().settings;
    if (settings['footer.type'] === 'multiline') {
        return React.createElement(MultilineFooter, null);
    }
    return React.createElement(DefaultFooter, null);
};
export default Footer;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=index.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { desktopViewMixin } from '../../helpers';
import { commonMessages } from '../../helpers/translation';
import { AvatarImage } from './Image';
import ProgramRoleFormatter from './ProgramRoleFormatter';
import { BREAK_POINT } from './Responsive';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 2.5rem 1.5rem;\n  background: white;\n  text-align: center;\n\n  @media (min-width: ", "px) {\n    display: flex;\n    align-items: center;\n    padding: 2.5rem;\n    text-align: left;\n  }\n"], ["\n  padding: 2.5rem 1.5rem;\n  background: white;\n  text-align: center;\n\n  @media (min-width: ", "px) {\n    display: flex;\n    align-items: center;\n    padding: 2.5rem;\n    text-align: left;\n  }\n"])), BREAK_POINT);
var AvatarBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 2.5rem;\n\n  @media (min-width: ", "px) {\n    margin-bottom: 0;\n    margin-right: 2.5rem;\n  }\n"], ["\n  margin-bottom: 2.5rem;\n\n  @media (min-width: ", "px) {\n    margin-bottom: 0;\n    margin-right: 2.5rem;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  justify-content: center;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n\n  a {\n    color: var(--gray-darker);\n  }\n\n  @media (min-width: ", "px) {\n    justify-content: start;\n  }\n"], ["\n  justify-content: center;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n\n  a {\n    color: var(--gray-darker);\n  }\n\n  @media (min-width: ", "px) {\n    justify-content: start;\n  }\n"])), BREAK_POINT);
var StyledLabel = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 2px 0.5rem;\n  background: ", ";\n  color: white;\n  font-size: 12px;\n  font-weight: normal;\n  line-height: normal;\n  letter-spacing: 0.58px;\n  border-radius: 11px;\n"], ["\n  padding: 2px 0.5rem;\n  background: ", ";\n  color: white;\n  font-size: 12px;\n  font-weight: normal;\n  line-height: normal;\n  letter-spacing: 0.58px;\n  border-radius: 11px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledJobTitle = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-top: 0.75rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  margin-top: 0.75rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledDescription = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-top: 1.5rem;\n  max-height: 3rem;\n  color: var(--gray-darker);\n  letter-spacing: 0.2px;\n  text-align: center;\n  white-space: pre-line;\n\n  ", "\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-top: 1.5rem;\n  max-height: 3rem;\n  color: var(--gray-darker);\n  letter-spacing: 0.2px;\n  text-align: center;\n  white-space: pre-line;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    text-align: justify;\n  "], ["\n    text-align: justify;\n  "])))));
var StyledAction = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: inline-block;\n  margin-top: 1.5rem;\n  padding: 0 1rem;\n  font-size: 14px;\n\n  &:not(:first-child) {\n    border-left: 1px solid var(--gray-light);\n  }\n\n  @media (min-width: ", "px) {\n    &:first-child {\n      padding-left: 0;\n    }\n  }\n"], ["\n  display: inline-block;\n  margin-top: 1.5rem;\n  padding: 0 1rem;\n  font-size: 14px;\n\n  &:not(:first-child) {\n    border-left: 1px solid var(--gray-light);\n  }\n\n  @media (min-width: ", "px) {\n    &:first-child {\n      padding-left: 0;\n    }\n  }\n"])), BREAK_POINT);
var CreatorCard = function (_a) {
    var id = _a.id, avatarUrl = _a.avatarUrl, title = _a.title, labels = _a.labels, jobTitle = _a.jobTitle, description = _a.description, withProgram = _a.withProgram, withPodcast = _a.withPodcast, withAppointment = _a.withAppointment, withBlog = _a.withBlog, noPadding = _a.noPadding;
    var formatMessage = useIntl().formatMessage;
    var enabledModules = useApp().enabledModules;
    return (React.createElement(StyledWrapper, { className: noPadding ? 'p-0' : '' },
        React.createElement(AvatarBlock, { className: "flex-shrink-0" },
            React.createElement(Link, { to: "/creators/" + id + "?tabkey=introduction" },
                React.createElement(AvatarImage, { src: avatarUrl, size: 128, className: "mx-auto" }))),
        React.createElement("div", { className: "flex-grow-1" },
            React.createElement(StyledTitle, { className: "d-flex align-items-center" },
                React.createElement(Link, { to: "/creators/" + id + "?tabkey=introduction" }, title),
                !!labels &&
                    labels.map(function (label) { return (React.createElement(StyledLabel, { key: label.id, className: "ml-2" },
                        React.createElement(ProgramRoleFormatter, { value: label.name }))); })),
            !!jobTitle && React.createElement(StyledJobTitle, null, jobTitle),
            !!description && React.createElement(StyledDescription, null, description),
            React.createElement("div", null,
                withProgram && (React.createElement(StyledAction, null,
                    React.createElement(Link, { to: "/creators/" + id + "?tabkey=programs" }, formatMessage(commonMessages.content.addCourse)))),
                withPodcast && enabledModules.podcast && (React.createElement(StyledAction, null,
                    React.createElement(Link, { to: "/creators/" + id + "?tabkey=podcasts" }, formatMessage(commonMessages.content.podcasts)))),
                withAppointment && enabledModules.appointment && (React.createElement(StyledAction, null,
                    React.createElement(Link, { to: "/creators/" + id + "?tabkey=appointments" }, formatMessage(commonMessages.content.appointments)))),
                withBlog && enabledModules.blog && (React.createElement(StyledAction, null,
                    React.createElement(Link, { to: "/creators/" + id + "?tabkey=posts" }, formatMessage(commonMessages.content.blog))))))));
};
export default CreatorCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=CreatorCard.js.map
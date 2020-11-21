var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ListOIcon from '../../images/list-o.svg';
import BlurredBanner from '../common/BlurredBanner';
import { BREAK_POINT } from '../common/Responsive';
var messages = defineMessages({
    decorationPart1: { id: 'programPackage.label.decorationPart1', defaultMessage: '課程' },
    decorationPart2: { id: 'programPackage.label.decorationPart2', defaultMessage: '組合' },
    introduction: { id: 'programPackage.label.introduction', defaultMessage: '簡介' },
});
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  @media (min-width: ", "px) {\n    padding: 4rem 0;\n  }\n"], ["\n  @media (min-width: ", "px) {\n    padding: 4rem 0;\n  }\n"])), BREAK_POINT);
var StyledCenterBox = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n  margin: 0 auto;\n  padding: 2.5rem 6rem 2.5rem 1.5rem;\n  width: 100%;\n  max-width: 600px;\n  color: white;\n\n  @media (min-width: ", "px) {\n    padding: 5.25rem 6rem;\n    border: 1px solid white;\n    text-align: center;\n  }\n"], ["\n  position: relative;\n  margin: 0 auto;\n  padding: 2.5rem 6rem 2.5rem 1.5rem;\n  width: 100%;\n  max-width: 600px;\n  color: white;\n\n  @media (min-width: ", "px) {\n    padding: 5.25rem 6rem;\n    border: 1px solid white;\n    text-align: center;\n  }\n"])), BREAK_POINT);
var StyledDecoration = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  right: 1rem;\n  overflow: hidden;\n  padding: 10px 12px 20px;\n\n  span {\n    z-index: 2;\n    position: relative;\n    font-size: 14px;\n    font-weight: bold;\n    line-height: 1.29;\n    letter-spacing: 0.18px;\n  }\n\n  ::before,\n  ::after {\n    z-index: 1;\n    display: block;\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    background: ", ";\n    content: '';\n  }\n\n  ::before {\n    transform-origin: left bottom;\n    transform: skewY(-20deg);\n  }\n\n  ::after {\n    transform-origin: right bottom;\n    transform: skewY(20deg);\n  }\n"], ["\n  position: absolute;\n  top: 0;\n  right: 1rem;\n  overflow: hidden;\n  padding: 10px 12px 20px;\n\n  span {\n    z-index: 2;\n    position: relative;\n    font-size: 14px;\n    font-weight: bold;\n    line-height: 1.29;\n    letter-spacing: 0.18px;\n  }\n\n  ::before,\n  ::after {\n    z-index: 1;\n    display: block;\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    background: ", ";\n    content: '';\n  }\n\n  ::before {\n    transform-origin: left bottom;\n    transform: skewY(-20deg);\n  }\n\n  ::after {\n    transform-origin: right bottom;\n    transform: skewY(20deg);\n  }\n"])), function (props) { return props.theme['@primary-color']; });
var StyledTitle = styled.h1(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: white;\n  font-size: 28px;\n  font-weight: bold;\n  letter-spacing: 0.23px;\n\n  @media (min-width: ", "px) {\n    font-size: 40px;\n  }\n"], ["\n  color: white;\n  font-size: 28px;\n  font-weight: bold;\n  letter-spacing: 0.23px;\n\n  @media (min-width: ", "px) {\n    font-size: 40px;\n  }\n"])), BREAK_POINT);
var StyledEntrolledLink = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: absolute;\n  top: 24px;\n  right: 24px;\n  a {\n    font-size: 14px;\n    font-weight: normal;\n    letter-spacing: 0.18px;\n    color: white;\n  }\n  i {\n    vertical-align: sub;\n  }\n"], ["\n  position: absolute;\n  top: 24px;\n  right: 24px;\n  a {\n    font-size: 14px;\n    font-weight: normal;\n    letter-spacing: 0.18px;\n    color: white;\n  }\n  i {\n    vertical-align: sub;\n  }\n"])));
var ProgramPackageBanner = function (_a) {
    var title = _a.title, coverUrl = _a.coverUrl, programPackageId = _a.programPackageId, isEnrolled = _a.isEnrolled;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(BlurredBanner, { coverUrl: coverUrl },
        isEnrolled && (React.createElement(StyledEntrolledLink, null,
            React.createElement(Link, { to: "/program-packages/" + programPackageId },
                React.createElement(Icon, { src: ListOIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(messages.introduction))))),
        React.createElement(StyledWrapper, null,
            React.createElement(StyledCenterBox, null,
                React.createElement(StyledDecoration, null,
                    React.createElement("div", { dangerouslySetInnerHTML: {
                            __html: '<span>{{part1}}<br>{{part2}}</span>'
                                .replace('{{part1}}', formatMessage(messages.decorationPart1))
                                .replace('{{part2}}', formatMessage(messages.decorationPart2)),
                        } })),
                React.createElement(StyledTitle, { className: "mb-3" }, title)))));
};
export default ProgramPackageBanner;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=ProgramPackageBanner.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import Icon from 'react-inlinesvg';
import styled from 'styled-components';
import CalendarOIcon from '../../images/calendar-alt-o.svg';
import CountDownTimeBlock from '../common/CountDownTimeBlock';
import { BREAK_POINT } from '../common/Responsive';
import FundingCoverBlock from './FundingCoverBlock';
import ProjectCalloutButton from './ProjectCalloutButton';
var StyledSection = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n\n  > img {\n    display: none;\n  }\n  @media (min-width: ", "px) {\n    > img {\n      display: block;\n      position: absolute;\n      top: 0;\n      right: 0;\n      width: 300px;\n      z-index: 1;\n    }\n  }\n"], ["\n  position: relative;\n\n  > img {\n    display: none;\n  }\n  @media (min-width: ", "px) {\n    > img {\n      display: block;\n      position: absolute;\n      top: 0;\n      right: 0;\n      width: 300px;\n      z-index: 1;\n    }\n  }\n"])), BREAK_POINT);
var StyledCountDownBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  z-index: 10;\n"], ["\n  z-index: 10;\n"])));
var StyledCover = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding-bottom: 40px;\n  .row {\n    padding-top: 40px;\n  }\n  .col-lg-7 {\n    z-index: 4;\n  }\n  img {\n    display: none;\n  }\n  @media (min-width: ", "px) {\n    padding-bottom: 100px;\n    .row {\n      padding-top: 60px;\n      align-items: flex-end;\n    }\n    .col-lg-7 {\n      align-items: flex-end;\n    }\n    img {\n      display: block;\n    }\n  }\n"], ["\n  padding-bottom: 40px;\n  .row {\n    padding-top: 40px;\n  }\n  .col-lg-7 {\n    z-index: 4;\n  }\n  img {\n    display: none;\n  }\n  @media (min-width: ", "px) {\n    padding-bottom: 100px;\n    .row {\n      padding-top: 60px;\n      align-items: flex-end;\n    }\n    .col-lg-7 {\n      align-items: flex-end;\n    }\n    img {\n      display: block;\n    }\n  }\n"])), BREAK_POINT);
var StyledCountDownTime = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  background-color: #fff;\n  border-radius: 4px;\n  width: 100%;\n  height: 56px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);\n\n  .text-primary {\n    color: ", ";\n  }\n\n  @media (max-width: ", "px) {\n    .discount-down::before {\n      content: '\u512A\u60E0';\n    }\n  }\n"], ["\n  background-color: #fff;\n  border-radius: 4px;\n  width: 100%;\n  height: 56px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);\n\n  .text-primary {\n    color: ", ";\n  }\n\n  @media (max-width: ", "px) {\n    .discount-down::before {\n      content: '\u512A\u60E0';\n    }\n  }\n"])), function (props) { return props.theme['@primary-color']; }, BREAK_POINT);
var StyledTitle = styled.h1(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-weight: bold;\n  font-stretch: normal;\n  font-style: normal;\n  font-size: 40px;\n  line-height: 1.3;\n  letter-spacing: 1px;\n  @media (min-width: ", "px) {\n    font-size: 60px;\n    line-height: 1.35;\n    letter-spacing: 1.5px;\n  }\n"], ["\n  font-weight: bold;\n  font-stretch: normal;\n  font-style: normal;\n  font-size: 40px;\n  line-height: 1.3;\n  letter-spacing: 1px;\n  @media (min-width: ", "px) {\n    font-size: 60px;\n    line-height: 1.35;\n    letter-spacing: 1.5px;\n  }\n"])), BREAK_POINT);
var StyledSubtitle = styled.h2(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 28px;\n  font-weight: bold;\n  font-stretch: normal;\n  font-style: normal;\n  line-height: normal;\n  letter-spacing: 4px;\n  color: #ffc129;\n"], ["\n  font-size: 28px;\n  font-weight: bold;\n  font-stretch: normal;\n  font-style: normal;\n  line-height: normal;\n  letter-spacing: 4px;\n  color: #ffc129;\n"])));
var StyledDescription = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-bottom: 40px;\n  font-size: 16px;\n  font-weight: 500;\n  line-height: 1.69;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n  > div:first-child {\n    display: inline-block;\n    border-top: 4px solid #ffc129;\n    padding: 40px 0;\n  }\n"], ["\n  margin-bottom: 40px;\n  font-size: 16px;\n  font-weight: 500;\n  line-height: 1.69;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n  > div:first-child {\n    display: inline-block;\n    border-top: 4px solid #ffc129;\n    padding: 40px 0;\n  }\n"])));
var ProjectBannerSection = function (_a) {
    var title = _a.title, abstract = _a.abstract, description = _a.description, url = _a.url, type = _a.type, expiredAt = _a.expiredAt, backgroundImage = _a.backgroundImage, callout = _a.callout;
    return (React.createElement(StyledSection, null,
        React.createElement("img", { src: backgroundImage, alt: "background" }),
        React.createElement("div", { className: "container pt-5" },
            React.createElement("div", { className: "row flex-row-reverse" },
                React.createElement(StyledCountDownBlock, { className: "col-12 col-lg-4" },
                    React.createElement(StyledCountDownTime, { className: "d-flex align-items-center justify-content-center" },
                        React.createElement(Icon, { src: CalendarOIcon, className: "mr-2" }),
                        expiredAt && React.createElement(CountDownTimeBlock, { text: "\u958B\u8AB2\u5012\u6578", expiredAt: expiredAt }))))),
        React.createElement(StyledCover, { className: "container" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-12 col-lg-5" },
                    React.createElement(StyledTitle, null, title),
                    React.createElement(StyledSubtitle, null, abstract),
                    React.createElement(StyledDescription, null, description.split('\n').map(function (description) { return (React.createElement("div", { key: description }, description)); })),
                    callout && (React.createElement("div", { style: { marginBottom: 40 } },
                        React.createElement(ProjectCalloutButton, { href: callout.href, label: callout.label })))),
                React.createElement("div", { className: "col-12 col-lg-7" },
                    React.createElement(FundingCoverBlock, { coverType: type, coverUrl: url }))))));
};
export default ProjectBannerSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=ProjectBannerSection.js.map
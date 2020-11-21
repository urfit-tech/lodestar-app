var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import BlurredBanner from './BlurredBanner';
import { AvatarImage } from './Image';
import { BREAK_POINT } from './Responsive';
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: -1px;\n  padding-top: 7.5rem;\n  padding-bottom: calc(2rem + 1px);\n  background: linear-gradient(to bottom, transparent 240px, white 240px);\n"], ["\n  margin-bottom: -1px;\n  padding-top: 7.5rem;\n  padding-bottom: calc(2rem + 1px);\n  background: linear-gradient(to bottom, transparent 240px, white 240px);\n"])));
var StyledCard = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 1.5rem;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n\n  @media (min-width: ", "px) {\n    display: flex;\n    align-items: flex-start;\n    padding: 2.5rem;\n  }\n"], ["\n  padding: 1.5rem;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n\n  @media (min-width: ", "px) {\n    display: flex;\n    align-items: flex-start;\n    padding: 2.5rem;\n  }\n"])), BREAK_POINT);
var AvatarBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: calc(-48px - 1.5rem) auto 1rem;\n  width: 96px;\n  height: 96px;\n\n  @media (min-width: ", "px) {\n    flex-shrink: 0;\n    margin: 0 2.5rem 0 0;\n    width: 128px;\n    height: 128px;\n  }\n"], ["\n  margin: calc(-48px - 1.5rem) auto 1rem;\n  width: 96px;\n  height: 96px;\n\n  @media (min-width: ", "px) {\n    flex-shrink: 0;\n    margin: 0 2.5rem 0 0;\n    width: 128px;\n    height: 128px;\n  }\n"])), BREAK_POINT);
var DescriptionBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  @media (min-width: ", "px) {\n    flex-grow: 1;\n  }\n"], ["\n  @media (min-width: ", "px) {\n    flex-grow: 1;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n  text-align: center;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n\n  @media (min-width: ", "px) {\n    text-align: left;\n  }\n"], ["\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n  text-align: center;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n\n  @media (min-width: ", "px) {\n    text-align: left;\n  }\n"])), BREAK_POINT);
var StyledSubTitle = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin-bottom: 1.25rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  text-align: center;\n  letter-spacing: 0.4px;\n\n  @media (min-width: ", "px) {\n    text-align: left;\n  }\n"], ["\n  margin-bottom: 1.25rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  text-align: center;\n  letter-spacing: 0.4px;\n\n  @media (min-width: ", "px) {\n    text-align: left;\n  }\n"])), BREAK_POINT);
var StyledDescription = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  white-space: pre-line;\n"], ["\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  white-space: pre-line;\n"])));
var StyledTag = styled.span(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n  letter-spacing: 0.4px;\n\n  :not(:first-child) {\n    margin-left: 0.5rem;\n  }\n"], ["\n  color: ", ";\n  font-size: 14px;\n  letter-spacing: 0.4px;\n\n  :not(:first-child) {\n    margin-left: 0.5rem;\n  }\n"])), function (props) { return props.theme['@primary-color']; });
var CreatorIntroBlock = function (_a) {
    var avatarUrl = _a.avatarUrl, title = _a.title, subTitle = _a.subTitle, tags = _a.tags, description = _a.description;
    return (React.createElement(BlurredBanner, { coverUrl: avatarUrl },
        React.createElement(Wrapper, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledCard, null,
                    React.createElement(AvatarBlock, { className: "mb-3" },
                        React.createElement(AvatarImage, { src: avatarUrl, size: "100%" })),
                    React.createElement(DescriptionBlock, null,
                        React.createElement(StyledTitle, { className: "mb-2" }, title),
                        React.createElement(StyledSubTitle, null, subTitle),
                        React.createElement(StyledDescription, { className: "mb-4" }, description),
                        React.createElement("div", null, !!tags && tags.map(function (tag) { return React.createElement(StyledTag, { key: tag },
                            "#",
                            tag); }))))))));
};
export default CreatorIntroBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=CreatorIntroBlock.js.map
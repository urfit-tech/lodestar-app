var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Carousel } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Responsive, { BREAK_POINT } from '../common/Responsive';
var StyledSection = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n\n  > .container {\n    position: relative;\n    top: -80px;\n    background-color: white;\n\n    > .wrapper {\n      padding: 80px 0 0 0;\n    }\n  }\n"], ["\n  position: relative;\n\n  > .container {\n    position: relative;\n    top: -80px;\n    background-color: white;\n\n    > .wrapper {\n      padding: 80px 0 0 0;\n    }\n  }\n"])));
var StyledHeader = styled.header(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-bottom: 40px;\n\n  h3 {\n    width: 100%;\n    max-width: 425px;\n    font-size: 28px;\n    font-weight: bold;\n    letter-spacing: 0.23px;\n    text-align: center;\n    margin: 0 auto;\n    padding-bottom: 24px;\n\n    span {\n      display: inline-block;\n    }\n  }\n  h4 {\n    font-size: 16px;\n    font-weight: 500;\n    line-height: 1.5;\n    letter-spacing: 0.2px;\n    text-align: center;\n  }\n\n  @media (min-width: ", "px) {\n    padding-bottom: 60px;\n\n    h3 {\n      max-width: 615px;\n      font-size: 40px;\n      line-height: 1.4;\n      letter-spacing: 1px;\n    }\n  }\n"], ["\n  padding-bottom: 40px;\n\n  h3 {\n    width: 100%;\n    max-width: 425px;\n    font-size: 28px;\n    font-weight: bold;\n    letter-spacing: 0.23px;\n    text-align: center;\n    margin: 0 auto;\n    padding-bottom: 24px;\n\n    span {\n      display: inline-block;\n    }\n  }\n  h4 {\n    font-size: 16px;\n    font-weight: 500;\n    line-height: 1.5;\n    letter-spacing: 0.2px;\n    text-align: center;\n  }\n\n  @media (min-width: ", "px) {\n    padding-bottom: 60px;\n\n    h3 {\n      max-width: 615px;\n      font-size: 40px;\n      line-height: 1.4;\n      letter-spacing: 1px;\n    }\n  }\n"])), BREAK_POINT);
var StyledCarousel = styled(Carousel)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && .slick-dots {\n    li {\n      margin-left: 16px;\n\n      button {\n        width: 12px;\n        height: 12px;\n        background: #cdcdcd;\n        border-radius: 50%;\n        transition: transform 0.2s ease-in-out;\n      }\n    }\n    li:first-child {\n      margin-left: 0;\n    }\n    li.slick-active {\n      button {\n        width: 12px;\n        transform: scale(1.25, 1.25);\n        background: #ff5760;\n      }\n    }\n  }\n\n  && .slick-track {\n    display: flex;\n  }\n"], ["\n  && .slick-dots {\n    li {\n      margin-left: 16px;\n\n      button {\n        width: 12px;\n        height: 12px;\n        background: #cdcdcd;\n        border-radius: 50%;\n        transition: transform 0.2s ease-in-out;\n      }\n    }\n    li:first-child {\n      margin-left: 0;\n    }\n    li.slick-active {\n      button {\n        width: 12px;\n        transform: scale(1.25, 1.25);\n        background: #ff5760;\n      }\n    }\n  }\n\n  && .slick-track {\n    display: flex;\n  }\n"])));
var StyledSlide = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  max-width: 100vw;\n  padding: 4px 16px 64px;\n\n  @media (min-width: ", "px) {\n    max-width: 570px;\n  }\n"], ["\n  max-width: 100vw;\n  padding: 4px 16px 64px;\n\n  @media (min-width: ", "px) {\n    max-width: 570px;\n  }\n"])), BREAK_POINT);
var StyleCard = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex-flow: column;\n  justify-content: space-between;\n  align-items: flex-start;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);\n  height: 248px;\n  width: 198px;\n\n  h5 {\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n    color: var(--gray-darker);\n  }\n  p {\n    margin-bottom: 0px;\n    height: 60px;\n    line-height: 1.24;\n    letter-spacing: 0.4px;\n    color: #9b9b9b;\n    font-size: 14px;\n    font-weight: 500;\n  }\n\n  @media (min-width: ", "px) {\n    width: 19%;\n    margin-bottom: 20px;\n  }\n"], ["\n  display: flex;\n  flex-flow: column;\n  justify-content: space-between;\n  align-items: flex-start;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);\n  height: 248px;\n  width: 198px;\n\n  h5 {\n    font-size: 18px;\n    font-weight: bold;\n    letter-spacing: 0.8px;\n    color: var(--gray-darker);\n  }\n  p {\n    margin-bottom: 0px;\n    height: 60px;\n    line-height: 1.24;\n    letter-spacing: 0.4px;\n    color: #9b9b9b;\n    font-size: 14px;\n    font-weight: 500;\n  }\n\n  @media (min-width: ", "px) {\n    width: 19%;\n    margin-bottom: 20px;\n  }\n"])), BREAK_POINT);
var StyledCardWrapper = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: flex;\n  align-items: flex-start;\n  flex-flow: column;\n  justify-content: space-between;\n  padding: 24px;\n  height: 100%;\n"], ["\n  display: flex;\n  align-items: flex-start;\n  flex-flow: column;\n  justify-content: space-between;\n  padding: 24px;\n  height: 100%;\n"])));
var ProjectCardSection = function (_a) {
    var items = _a.items, title = _a.title, subtitle = _a.subtitle;
    return (React.createElement(StyledSection, null,
        React.createElement("div", { className: "container" },
            React.createElement("div", { className: "wrapper" },
                React.createElement(StyledHeader, null,
                    React.createElement("h3", null, title.split(';').map(function (text, idx) { return (React.createElement("span", { key: idx }, text)); })),
                    React.createElement("h4", null, subtitle)),
                React.createElement(Responsive.Default, null,
                    React.createElement(StyledCarousel, { dots: true, draggable: true, slidesToShow: 3, slidesToScroll: 1, variableWidth: true }, items.map(function (card) { return (React.createElement(StyledSlide, { key: card.title },
                        React.createElement(StyleCard, null,
                            React.createElement(StyledCardWrapper, null,
                                React.createElement("img", { src: card.icon, alt: "card icon" }),
                                React.createElement("div", null,
                                    React.createElement("h5", null, card.title),
                                    React.createElement("p", null, card.description)))))); }))),
                React.createElement(Responsive.Desktop, null,
                    React.createElement("div", { className: "container d-flex flex-row flex-wrap justify-content-between" }, items.map(function (card) { return (React.createElement(StyleCard, { key: card.title + card.description },
                        React.createElement(StyledCardWrapper, null,
                            React.createElement("img", { src: card.icon, alt: "card icon" }),
                            React.createElement("div", null,
                                React.createElement("h5", null, card.title),
                                React.createElement("p", null, card.description))))); })))))));
};
export default ProjectCardSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ProjectCardSection.js.map
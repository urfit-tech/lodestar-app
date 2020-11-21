var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Carousel } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { BREAK_POINT } from '../common/Responsive';
var StyledSection = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
var StyledContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0 auto;\n  width: 320px;\n  padding: 80px 0;\n\n  @media (min-width: ", "px) {\n    width: 960px;\n    padding-top: 120px;\n  }\n"], ["\n  margin: 0 auto;\n  width: 320px;\n  padding: 80px 0;\n\n  @media (min-width: ", "px) {\n    width: 960px;\n    padding-top: 120px;\n  }\n"])), BREAK_POINT);
var StyledCarousel = styled(Carousel)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && .slick-dots {\n    li {\n      margin-left: 16px;\n\n      button {\n        width: 12px;\n        height: 12px;\n        background: #cdcdcd;\n        border-radius: 50%;\n        transition: transform 0.2s ease-in-out;\n      }\n    }\n    li:first-child {\n      margin-left: 0;\n    }\n    li.slick-active {\n      button {\n        width: 12px;\n        transform: scale(1.25, 1.25);\n        background: #ff5760;\n      }\n    }\n  }\n\n  && .slick-track {\n    display: flex;\n  }\n"], ["\n  && .slick-dots {\n    li {\n      margin-left: 16px;\n\n      button {\n        width: 12px;\n        height: 12px;\n        background: #cdcdcd;\n        border-radius: 50%;\n        transition: transform 0.2s ease-in-out;\n      }\n    }\n    li:first-child {\n      margin-left: 0;\n    }\n    li.slick-active {\n      button {\n        width: 12px;\n        transform: scale(1.25, 1.25);\n        background: #ff5760;\n      }\n    }\n  }\n\n  && .slick-track {\n    display: flex;\n  }\n"])));
var StyledSlide = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  max-width: 100vw;\n  padding: 32px 16px;\n\n  @media (min-width: ", "px) {\n    max-width: 320px;\n  }\n"], ["\n  max-width: 100vw;\n  padding: 32px 16px;\n\n  @media (min-width: ", "px) {\n    max-width: 320px;\n  }\n"])), BREAK_POINT);
var StyledIntro = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  p {\n    line-height: 1.71;\n    letter-spacing: 0.4px;\n    font-size: 14px;\n    font-weight: 500;\n    text-align: center;\n    color: var(--gray-darker);\n  }\n"], ["\n  p {\n    line-height: 1.71;\n    letter-spacing: 0.4px;\n    font-size: 14px;\n    font-weight: 500;\n    text-align: center;\n    color: var(--gray-darker);\n  }\n"])));
var StyledAvatar = styled.img(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  width: 64px;\n  margin: 0 auto 16px;\n"], ["\n  width: 64px;\n  margin: 0 auto 16px;\n"])));
var StyledComment = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  h4 {\n    letter-spacing: 0.2px;\n    text-align: center;\n    font-size: 16px;\n    font-weight: bold;\n    color: #585858;\n  }\n  p {\n    line-height: 1.69;\n    letter-spacing: 0.2px;\n    text-align: justify;\n    font-size: 16px;\n    font-weight: 500;\n    color: #585858;\n  }\n  @media (min-width: ", "px) {\n  }\n"], ["\n  h4 {\n    letter-spacing: 0.2px;\n    text-align: center;\n    font-size: 16px;\n    font-weight: bold;\n    color: #585858;\n  }\n  p {\n    line-height: 1.69;\n    letter-spacing: 0.2px;\n    text-align: justify;\n    font-size: 16px;\n    font-weight: 500;\n    color: #585858;\n  }\n  @media (min-width: ", "px) {\n  }\n"])), BREAK_POINT);
var OnSaleCommentSection = function (_a) {
    var comments = _a.comments;
    return (React.createElement(StyledSection, null,
        React.createElement(StyledContainer, null,
            React.createElement(StyledCarousel, { dots: true, draggable: true, slidesToShow: 1, slidesToScroll: 1, variableWidth: true, responsive: [
                    {
                        breakpoint: BREAK_POINT,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        },
                    },
                ] }, comments.map(function (comment) { return (React.createElement(StyledSlide, { key: comment.title },
                React.createElement("div", null,
                    React.createElement(StyledIntro, null,
                        React.createElement(StyledAvatar, { src: comment.avatar, alt: comment.title }),
                        React.createElement("p", null, comment.name)),
                    React.createElement(StyledComment, null,
                        !!comment.title && React.createElement("h4", null, comment.title),
                        React.createElement("p", null, comment.description))))); })))));
};
export default OnSaleCommentSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=OnSaleCommentSection.js.map
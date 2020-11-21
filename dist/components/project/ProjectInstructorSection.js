var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Carousel } from 'antd';
import React from 'react';
import styled, { css } from 'styled-components';
import { desktopViewMixin } from '../../helpers';
import AngleThinLeft from '../../images/angle-thin-left.svg';
import AngleThinRight from '../../images/angle-thin-right.svg';
import ProjectCalloutButton from './ProjectCalloutButton';
var SectionTitle = styled.h1(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 2.5rem;\n  color: #585858;\n  text-align: center;\n  font-size: 28px;\n  font-weight: bold;\n  letter-spacing: 0.23px;\n"], ["\n  margin-bottom: 2.5rem;\n  color: #585858;\n  text-align: center;\n  font-size: 28px;\n  font-weight: bold;\n  letter-spacing: 0.23px;\n"])));
var StyledAvatar = styled.img(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: block;\n  margin: 0 auto 1.5rem;\n  width: ", "px;\n  height: ", "px;\n  border-radius: 50%;\n  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);\n  object-fit: cover;\n  object-position: center;\n"], ["\n  display: block;\n  margin: 0 auto 1.5rem;\n  width: ", "px;\n  height: ", "px;\n  border-radius: 50%;\n  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);\n  object-fit: cover;\n  object-position: center;\n"])), function (props) { return props.size || 56; }, function (props) { return props.size || 56; });
var StyledSection = styled.section(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: relative;\n  padding: 5rem 0;\n  overflow: hidden;\n\n  ", "\n"], ["\n  position: relative;\n  padding: 5rem 0;\n  overflow: hidden;\n\n  ",
    "\n"])), function () {
    return desktopViewMixin(css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      padding: 5rem 0;\n    "], ["\n      padding: 5rem 0;\n    "]))));
});
var StyledContainer = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin: 0 auto 4rem;\n  padding: 0 4rem;\n  width: 100%;\n  max-width: 1088px;\n"], ["\n  margin: 0 auto 4rem;\n  padding: 0 4rem;\n  width: 100%;\n  max-width: 1088px;\n"])));
var StyledCarousel = styled(Carousel)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  && {\n    .slick-prev,\n    .slick-next {\n      margin-top: -32px;\n      width: 64px;\n      height: 64px;\n      font-size: 64px;\n    }\n    .slick-prev {\n      left: -64px;\n      &,\n      &:hover,\n      &:focus {\n        background-image: url(", ");\n      }\n    }\n    .slick-next {\n      right: -64px;\n      &,\n      &:hover,\n      &:focus {\n        background-image: url(", ");\n      }\n    }\n  }\n"], ["\n  && {\n    .slick-prev,\n    .slick-next {\n      margin-top: -32px;\n      width: 64px;\n      height: 64px;\n      font-size: 64px;\n    }\n    .slick-prev {\n      left: -64px;\n      &,\n      &:hover,\n      &:focus {\n        background-image: url(", ");\n      }\n    }\n    .slick-next {\n      right: -64px;\n      &,\n      &:hover,\n      &:focus {\n        background-image: url(", ");\n      }\n    }\n  }\n"])), AngleThinLeft, AngleThinRight);
var StyledInstructorBlock = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  padding: 0 2rem;\n  color: #9b9b9b;\n"], ["\n  padding: 0 2rem;\n  color: #9b9b9b;\n"])));
var StyledSubTitle = styled.h2(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: #585858;\n  text-align: center;\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77;\n"], ["\n  color: #585858;\n  text-align: center;\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77;\n"])));
var ProjectInstructorSection = function (_a) {
    var title = _a.title, callout = _a.callout, items = _a.items;
    return (React.createElement(StyledSection, null,
        React.createElement(SectionTitle, null, title),
        React.createElement(StyledContainer, null,
            React.createElement(StyledCarousel, { arrows: true, dots: false, draggable: true, swipeToSlide: true, slidesToShow: 4, slidesToScroll: 1, responsive: [
                    {
                        breakpoint: 192 * 5 - 1 + 128,
                        settings: {
                            slidesToShow: 4,
                        },
                    },
                    {
                        breakpoint: 192 * 4 - 1 + 128,
                        settings: {
                            slidesToShow: 3,
                        },
                    },
                    {
                        breakpoint: 192 * 3 - 1 + 128,
                        settings: {
                            slidesToShow: 2,
                        },
                    },
                    {
                        breakpoint: 192 * 2 - 1 + 128,
                        settings: {
                            slidesToShow: 1,
                        },
                    },
                ] }, items.map(function (item, idx) { return (React.createElement(StyledInstructorBlock, { key: idx },
                React.createElement(StyledAvatar, { src: item.picture, alt: item.title, size: 128 }),
                React.createElement(StyledSubTitle, null, item.title),
                React.createElement("div", { className: "text-center" }, item.description))); })),
            React.createElement("div", { className: "pt-5 d-flex justify-content-center" }, callout && React.createElement(ProjectCalloutButton, { href: callout.href, label: callout.label })))));
};
export default ProjectInstructorSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=ProjectInstructorSection.js.map
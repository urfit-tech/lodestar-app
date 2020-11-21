var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Carousel } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { BREAK_POINT } from '../common/Responsive';
import FundingCoverBlock from './FundingCoverBlock';
var StyledSection = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  h3 {\n    font-size: 28px;\n    font-weight: bold;\n    letter-spacing: 0.23px;\n    color: var(--gray-darker);\n    margin: 0 auto;\n    text-align: center;\n  }\n"], ["\n  h3 {\n    font-size: 28px;\n    font-weight: bold;\n    letter-spacing: 0.23px;\n    color: var(--gray-darker);\n    margin: 0 auto;\n    text-align: center;\n  }\n"])));
var StyledContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0 auto;\n  width: 100%;\n  max-width: 270px;\n  padding-bottom: 80px;\n\n  @media (min-width: ", "px) {\n    max-width: 960px;\n  }\n"], ["\n  margin: 0 auto;\n  width: 100%;\n  max-width: 270px;\n  padding-bottom: 80px;\n\n  @media (min-width: ", "px) {\n    max-width: 960px;\n  }\n"])), BREAK_POINT);
var StyledSlide = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n  max-width: 100vw;\n  padding: 52px 32px;\n\n  h4 {\n    position: absolute;\n    left: 50%;\n    transform: translateX(-50%);\n    padding-top: 10px;\n    width: 200px;\n    text-align: center;\n  }\n\n  @media (min-width: ", "px) {\n    h4 {\n      width: 100%;\n    }\n  }\n"], ["\n  position: relative;\n  max-width: 100vw;\n  padding: 52px 32px;\n\n  h4 {\n    position: absolute;\n    left: 50%;\n    transform: translateX(-50%);\n    padding-top: 10px;\n    width: 200px;\n    text-align: center;\n  }\n\n  @media (min-width: ", "px) {\n    h4 {\n      width: 100%;\n    }\n  }\n"])), BREAK_POINT);
var StyledImage = styled.img(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  width: 40px !important;\n  height: 40px !important;\n"], ["\n  width: 40px !important;\n  height: 40px !important;\n"])));
var OnSaleTrialSection = function (_a) {
    var title = _a.title, videos = _a.videos;
    return (React.createElement(StyledSection, null,
        React.createElement(StyledContainer, null,
            React.createElement("h3", null, title),
            React.createElement(Carousel, { arrows: true, draggable: true, slidesToShow: 2, dots: false, slidesToScroll: 1, prevArrow: React.createElement(StyledImage, { src: "https://static.kolable.com/images/xuemi/angle-thin-left.svg" }), nextArrow: React.createElement(StyledImage, { src: "https://static.kolable.com/images/xuemi/angle-thin-right.svg" }), responsive: [
                    {
                        breakpoint: BREAK_POINT,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        },
                    },
                ] }, videos.map(function (video) { return (React.createElement(StyledSlide, { key: video.src },
                React.createElement(FundingCoverBlock, { coverType: "video", coverUrl: video.src }),
                React.createElement("h4", null, video.title))); })))));
};
export default OnSaleTrialSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=OnSaleTrialSection.js.map
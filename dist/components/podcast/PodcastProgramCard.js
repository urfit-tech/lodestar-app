var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { durationFullFormatter } from '../../helpers';
import EmptyCover from '../../images/empty-cover.png';
import { AvatarImage, CustomRatioImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
import Responsive, { BREAK_POINT } from '../common/Responsive';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow: hidden;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.1);\n"], ["\n  overflow: hidden;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.1);\n"])));
var StyledCoverBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var StyledDuration = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 0.5rem;\n  left: 0.5rem;\n  padding: 0 0.25rem;\n  border-radius: 2px;\n  background: rgba(0, 0, 0, 0.6);\n  color: white;\n  font-size: 12px;\n  letter-spacing: 0.58px;\n"], ["\n  position: absolute;\n  bottom: 0.5rem;\n  left: 0.5rem;\n  padding: 0 0.25rem;\n  border-radius: 2px;\n  background: rgba(0, 0, 0, 0.6);\n  color: white;\n  font-size: 12px;\n  letter-spacing: 0.58px;\n"])));
var StyledMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 0.75rem;\n\n  @media (min-width: ", "px) {\n    padding: 1.25rem;\n  }\n"], ["\n  padding: 0.75rem;\n\n  @media (min-width: ", "px) {\n    padding: 1.25rem;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  height: 1.5em;\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n\n  @media (min-width: ", "px) {\n    -webkit-line-clamp: 2;\n    height: 3em;\n  }\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  height: 1.5em;\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n\n  @media (min-width: ", "px) {\n    -webkit-line-clamp: 2;\n    height: 3em;\n  }\n"])), BREAK_POINT);
var StyledDescription = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n  line-height: 16px;\n  letter-spacing: 0.4px;\n\n  @media (min-width: ", "px) {\n    line-height: 20px;\n\n    span:first-child {\n      display: inline;\n    }\n  }\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n  line-height: 16px;\n  letter-spacing: 0.4px;\n\n  @media (min-width: ", "px) {\n    line-height: 20px;\n\n    span:first-child {\n      display: inline;\n    }\n  }\n"])), BREAK_POINT);
var PodcastProgramCard = function (_a) {
    var coverUrl = _a.coverUrl, title = _a.title, instructor = _a.instructor, salePrice = _a.salePrice, listPrice = _a.listPrice, duration = _a.duration, durationSecond = _a.durationSecond, variant = _a.variant, percent = _a.percent, isEnrolled = _a.isEnrolled, noPrice = _a.noPrice;
    return (React.createElement(StyledWrapper, { className: "d-flex justify-content-between" },
        React.createElement(StyledCoverBlock, { className: "flex-shrink-0" },
            React.createElement(Responsive.Default, null,
                React.createElement(CustomRatioImage, { width: "88px", ratio: 1, src: coverUrl || EmptyCover })),
            React.createElement(Responsive.Desktop, null,
                React.createElement(CustomRatioImage, { width: "140px", ratio: 1, src: coverUrl || EmptyCover })),
            React.createElement(StyledDuration, null, durationFullFormatter(durationSecond))),
        React.createElement(StyledMeta, { className: "flex-grow-1 d-flex flex-column justify-content-between" },
            React.createElement(StyledTitle, null, title),
            React.createElement(StyledDescription, { className: "d-flex justify-content-between" },
                React.createElement("div", { className: "d-none d-lg-flex align-items-center" },
                    React.createElement(AvatarImage, { src: instructor === null || instructor === void 0 ? void 0 : instructor.avatarUrl, size: 36, className: "mr-2" }),
                    React.createElement("span", null, instructor === null || instructor === void 0 ? void 0 : instructor.name)),
                !noPrice && (React.createElement("div", { className: "text-right" },
                    React.createElement(PriceLabel, { variant: "inline", listPrice: listPrice, salePrice: salePrice })))))));
};
export default PodcastProgramCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=PodcastProgramCard.js.map
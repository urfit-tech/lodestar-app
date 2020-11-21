var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import EmptyCover from '../../images/empty-cover.png';
import { CustomRatioImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
import { BREAK_POINT } from '../common/Responsive';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow: hidden;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.1);\n"], ["\n  overflow: hidden;\n  background-color: white;\n  border-radius: 4px;\n  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.1);\n"])));
var StyledMeta = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 0.75rem;\n\n  @media (min-width: ", "px) {\n    padding: 1.25rem;\n  }\n"], ["\n  padding: 0.75rem;\n\n  @media (min-width: ", "px) {\n    padding: 1.25rem;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  height: 1.5em;\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n\n  @media (min-width: ", "px) {\n    -webkit-line-clamp: 2;\n    height: 3em;\n  }\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  height: 1.5em;\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n\n  @media (min-width: ", "px) {\n    -webkit-line-clamp: 2;\n    height: 3em;\n  }\n"])), BREAK_POINT);
var PodcastProgramBriefCard = function (_a) {
    var coverUrl = _a.coverUrl, title = _a.title, listPrice = _a.listPrice, salePrice = _a.salePrice, soldAt = _a.soldAt;
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledWrapper, { className: "d-flex flex-column justify-content-between" },
            React.createElement(CustomRatioImage, { width: "100%", ratio: 1, src: coverUrl || EmptyCover }),
            React.createElement(StyledMeta, { className: "flex-grow-1 d-flex flex-column justify-content-between" },
                React.createElement(StyledTitle, null, title),
                React.createElement("div", { className: "text-right" },
                    React.createElement(PriceLabel, { variant: "inline", listPrice: listPrice, salePrice: ((soldAt === null || soldAt === void 0 ? void 0 : soldAt.getTime()) || 0) > Date.now() ? salePrice : undefined }))))));
};
export default PodcastProgramBriefCard;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=PodcastProgramBriefCard.js.map
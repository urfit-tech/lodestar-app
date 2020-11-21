var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import EmptyCover from '../../images/empty-cover.png';
import { CustomRatioImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
var StyledTitle = styled.h3(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 16px;\n  font-weight: bold;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"])));
var MerchandiseCard = function (_a) {
    var _b;
    var title = _a.title, minPrice = _a.minPrice, maxPrice = _a.maxPrice, images = _a.images;
    return (React.createElement(React.Fragment, null,
        React.createElement(CustomRatioImage, { width: "100%", ratio: 1, src: (images && ((_b = images[0]) === null || _b === void 0 ? void 0 : _b.url)) || EmptyCover, shape: "rounded", className: "mb-2" }),
        React.createElement("div", { className: "text-center" },
            React.createElement(StyledTitle, null, title),
            React.createElement("div", null,
                React.createElement(PriceLabel, { listPrice: minPrice }), " ~ ",
                React.createElement(PriceLabel, { listPrice: maxPrice })))));
};
export default MerchandiseCard;
var templateObject_1;
//# sourceMappingURL=MerchandiseCard.js.map
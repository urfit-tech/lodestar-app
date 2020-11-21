var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import DefaultAvatar from '../../images/avatar.svg';
import { CustomRatioImage } from '../common/Image';
var StyledCardBody = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  background-color: white;\n\n  ", "\n"], ["\n  background-color: white;\n\n  ",
    "\n"])), function (props) {
    return props.variant === 'featuring'
        ? css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n          position: relative;\n          top: -20px;\n        "], ["\n          position: relative;\n          top: -20px;\n        "]))) : '';
});
var StyledTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  text-align: center;\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  text-align: center;\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  overflow: hidden;\n  color: var(--gray-dark);\n  text-align: center;\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  overflow: hidden;\n  color: var(--gray-dark);\n  text-align: center;\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledDescription = styled.p(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 16px;\n  text-align: center;\n  line-height: 1.69;\n  letter-spacing: 0.2px;\n"], ["\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 16px;\n  text-align: center;\n  line-height: 1.69;\n  letter-spacing: 0.2px;\n"])));
var CreatorBriefCard = function (_a) {
    var imageUrl = _a.imageUrl, title = _a.title, meta = _a.meta, description = _a.description, variant = _a.variant;
    return (React.createElement("div", null,
        React.createElement(CustomRatioImage, { width: "100%", ratio: 1, src: imageUrl || DefaultAvatar, shape: "circle" }),
        React.createElement(StyledCardBody, { variant: variant, className: "py-3" },
            React.createElement(StyledTitle, { className: "mb-1" }, title),
            meta && React.createElement(StyledMeta, { className: "mb-2" }, meta),
            description && React.createElement(StyledDescription, { className: "mt-1" }, description))));
};
export default CreatorBriefCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=CreatorBriefCard.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  overflow: hidden;\n"], ["\n  position: relative;\n  overflow: hidden;\n"])));
var BackgroundWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform: scale(1.1);\n"], ["\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform: scale(1.1);\n"])));
var BlurredCover = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  filter: blur(6px);\n"], ["\n  width: 100%;\n  height: 100%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n  background-attachment: fixed;\n  filter: blur(6px);\n"])), function (props) { return props.coverUrl || ''; });
var ContentWrapper = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: relative;\n  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));\n"], ["\n  position: relative;\n  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));\n"])));
var BlurredBanner = function (_a) {
    var coverUrl = _a.coverUrl, children = _a.children;
    return (React.createElement(StyledWrapper, null,
        React.createElement(BackgroundWrapper, null,
            React.createElement(BlurredCover, { coverUrl: coverUrl })),
        React.createElement(ContentWrapper, null, children)));
};
export default BlurredBanner;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=BlurredBanner.js.map
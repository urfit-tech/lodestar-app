var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  padding-top: 56.25%;\n  width: 100%;\n  background-image: ", ";\n  background-size: cover;\n  background-position: center;\n"], ["\n  position: relative;\n  padding-top: 56.25%;\n  width: 100%;\n  background-image: ", ";\n  background-size: cover;\n  background-position: center;\n"])), function (props) { return (props.coverType === 'image' ? "url(" + props.coverUrl + ")" : 'none'); });
var FundingCoverBlock = function (_a) {
    var coverType = _a.coverType, coverUrl = _a.coverUrl;
    return (React.createElement(StyledWrapper, { coverType: coverType, coverUrl: coverUrl }, coverType === 'video' && (React.createElement(ReactPlayer, { url: coverUrl, width: "100%", height: "100%", style: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } }))));
};
export default FundingCoverBlock;
var templateObject_1;
//# sourceMappingURL=FundingCoverBlock.js.map
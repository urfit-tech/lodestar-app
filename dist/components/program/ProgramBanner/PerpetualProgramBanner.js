var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledReactPlayer, StyledTags, StyledTitle, StyledVideoWrapper } from '.';
import BlurredBanner from '../../common/BlurredBanner';
import { BREAK_POINT } from '../../common/Responsive';
var StyledTitleBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  padding: ", ";\n\n  @media (min-width: ", "px) {\n    padding: ", ";\n  }\n"], ["\n  position: relative;\n  padding: ", ";\n\n  @media (min-width: ", "px) {\n    padding: ", ";\n  }\n"])), function (props) { return (props.noVideo ? '6rem 2rem' : '2rem'); }, BREAK_POINT, function (props) { return (props.noVideo ? '7.5rem 2rem' : '4rem 2rem'); });
var StyledVideoBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n  margin-bottom: -1px;\n  padding-bottom: 2px;\n  background: linear-gradient(to bottom, transparent 50%, white 50%);\n"], ["\n  position: relative;\n  margin-bottom: -1px;\n  padding-bottom: 2px;\n  background: linear-gradient(to bottom, transparent 50%, white 50%);\n"])));
var StyledLink = styled(Link)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: white;\n"], ["\n  color: white;\n"])));
var PerpetualProgramBanner = function (_a) {
    var _b;
    var program = _a.program;
    return (React.createElement(BlurredBanner, { coverUrl: program.coverUrl || undefined },
        React.createElement(StyledTitleBlock, { noVideo: !program.coverVideoUrl },
            React.createElement(StyledTags, { className: "text-center" }, (_b = program.tags) === null || _b === void 0 ? void 0 : _b.map(function (programTag) { return (React.createElement(StyledLink, { key: programTag, to: "/search?tag=" + programTag + "&tab=programs", className: "mr-2" },
                "#",
                programTag)); })),
            React.createElement(StyledTitle, { className: "text-center" }, program.title)),
        program.coverVideoUrl && (React.createElement(StyledVideoBlock, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledVideoWrapper, null,
                    React.createElement(StyledReactPlayer, { controls: true, url: program.coverVideoUrl, width: "100%", height: "100%" })))))));
};
export default PerpetualProgramBanner;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=PerpetualProgramBanner.js.map
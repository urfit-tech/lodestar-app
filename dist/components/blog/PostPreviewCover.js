var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import Icon from 'react-inlinesvg';
import styled, { css } from 'styled-components';
import EmptyCover from '../../images/empty-cover.png';
import PlayCircleIcon from '../../images/play-circle.svg';
import { CustomRatioImage } from '../common/Image';
var StyledCover = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  border-radius: 4px;\n  overflow: hidden;\n"], ["\n  position: relative;\n  border-radius: 4px;\n  overflow: hidden;\n"])));
var StyledVideoIconBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 0.5rem;\n  font-size: 1.5rem;\n  line-height: 1;\n\n  ", "\n"], ["\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 0.5rem;\n  font-size: 1.5rem;\n  line-height: 1;\n\n  ",
    "\n"])), function (props) {
    return props.variant === 'featuring'
        ? css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n          padding: 0.75rem;\n        "], ["\n          padding: 0.75rem;\n        "]))) : props.variant === 'popular'
        ? css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n          font-size: 1rem;\n        "], ["\n          font-size: 1rem;\n        "]))) : '';
});
var PostPreviewCover = function (_a) {
    var withVideo = _a.withVideo, coverUrl = _a.coverUrl, variant = _a.variant;
    return (React.createElement(StyledCover, null,
        withVideo && (React.createElement(StyledVideoIconBlock, { variant: variant },
            React.createElement(Icon, { src: PlayCircleIcon }))),
        React.createElement(CustomRatioImage, { width: "100%", ratio: variant === 'list-item' ? 2 / 3 : 9 / 16, src: coverUrl || EmptyCover })));
};
export default PostPreviewCover;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=PostPreviewCover.js.map
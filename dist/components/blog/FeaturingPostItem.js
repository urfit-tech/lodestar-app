var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import moment from 'moment';
import React from 'react';
import Icon from 'react-inlinesvg';
import styled from 'styled-components';
import { StyledPostMeta, StyledPostTitle } from '.';
import CalendarAltOIcon from '../../images/calendar-alt-o.svg';
import UserOIcon from '../../images/user-o.svg';
import PostPreviewCover from './PostPreviewCover';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  border-radius: 4px;\n  overflow: hidden;\n\n  ::after {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    content: ' ';\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, black);\n  }\n"], ["\n  position: relative;\n  border-radius: 4px;\n  overflow: hidden;\n\n  ::after {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    content: ' ';\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, black);\n  }\n"])));
var StyledBody = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  z-index: 10;\n  position: absolute;\n  bottom: 0;\n  padding: 1.25rem;\n  width: 100%;\n"], ["\n  z-index: 10;\n  position: absolute;\n  bottom: 0;\n  padding: 1.25rem;\n  width: 100%;\n"])));
var FeaturingPostItem = function (_a) {
    var coverUrl = _a.coverUrl, videoUrl = _a.videoUrl, title = _a.title, author = _a.author, publishedAt = _a.publishedAt, variant = _a.variant;
    return (React.createElement(StyledWrapper, { className: "mb-3" },
        React.createElement(PostPreviewCover, { variant: "featuring", coverUrl: coverUrl, withVideo: typeof videoUrl === 'string' }),
        React.createElement(StyledBody, null,
            React.createElement(StyledPostTitle, { className: variant }, title),
            React.createElement(StyledPostMeta, null,
                React.createElement(Icon, { src: UserOIcon, className: "mr-1" }),
                React.createElement("span", { className: "mr-2" }, author.name),
                React.createElement(Icon, { src: CalendarAltOIcon, className: "mr-1" }),
                React.createElement("span", null, publishedAt ? moment(publishedAt).format('YYYY-MM-DD') : '')))));
};
export default FeaturingPostItem;
var templateObject_1, templateObject_2;
//# sourceMappingURL=FeaturingPostItem.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button } from 'antd';
import { uniqBy } from 'ramda';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledPostTitle } from '.';
import { commonMessages } from '../../helpers/translation';
import PostPreviewCover from './PostPreviewCover';
import PostPreviewMeta from './PostPreviewMeta';
var StyledTagButton = styled(Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  transition: background-color 0.2s ease-in-out;\n\n  &,\n  &:active,\n  &:hover,\n  &:focus {\n    background-color: ", ";\n    color: ", ";\n  }\n"], ["\n  margin-bottom: 0.75rem;\n  transition: background-color 0.2s ease-in-out;\n\n  &,\n  &:active,\n  &:hover,\n  &:focus {\n    background-color: ", ";\n    color: ", ";\n  }\n"])), function (props) { return (props.selected ? props.theme['@primary-color'] : 'transparent'); }, function (props) { return (props.selected ? 'white' : 'var(--gray-darker)'); });
var PostItemCollection = function (_a) {
    var posts = _a.posts, withTagSelector = _a.withTagSelector;
    var formatMessage = useIntl().formatMessage;
    var _b = useState(null), selectedCategoryId = _b[0], setSelectedCategoryId = _b[1];
    var categories = uniqBy(function (category) { return category.id; }, posts.map(function (post) { return post.categories; }).flat());
    return (React.createElement(React.Fragment, null,
        withTagSelector && (React.createElement("div", { className: "mb-4" },
            React.createElement(StyledTagButton, { type: "link", selected: selectedCategoryId === null, shape: "round", onClick: function () { return setSelectedCategoryId(null); } }, formatMessage(commonMessages.form.option.all)),
            categories.map(function (category) { return (React.createElement(StyledTagButton, { key: category.id, type: "link", selected: selectedCategoryId === category.id, shape: "round", className: "ml-2", onClick: function () { return setSelectedCategoryId(category.id); } }, category.name)); }))),
        React.createElement("div", { className: "row" }, posts
            .filter(function (post) { return !selectedCategoryId || post.categories.some(function (category) { return category.id === selectedCategoryId; }); })
            .map(function (post) { return (React.createElement("div", { key: post.id, className: "col-6 col-lg-4 pb-2 mb-4" },
            React.createElement(Link, { to: "/posts/" + (post.codeName || post.id) },
                React.createElement("div", { className: "mb-3" },
                    React.createElement(PostPreviewCover, { coverUrl: post.coverUrl, withVideo: typeof post.videoUrl === 'string' })),
                React.createElement(StyledPostTitle, null, post.title),
                React.createElement(PostPreviewMeta, { author: post.author, publishedAt: post.publishedAt })))); }))));
};
export default PostItemCollection;
var templateObject_1;
//# sourceMappingURL=PostItemCollection.js.map
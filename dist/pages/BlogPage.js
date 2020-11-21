var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { messages, StyledTitle } from '../components/blog';
import FeaturingPostPreview from '../components/blog/FeaturingPostItem';
import PostItemCollection from '../components/blog/PostItemCollection';
import { PopularPostCollection } from '../components/blog/PostLinkCollection';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { desktopViewMixin } from '../helpers';
import { usePostPreviewCollection } from '../hooks/blog';
import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';
var PopularPostsBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), desktopViewMixin(css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    order: 1;\n  "], ["\n    order: 1;\n  "])))));
var BlogPage = function () {
    var formatMessage = useIntl().formatMessage;
    var _a = useApp(), loading = _a.loading, enabledModules = _a.enabledModules;
    var posts = usePostPreviewCollection().posts;
    var latestPosts = posts.slice(0, 3);
    if (loading) {
        return React.createElement(LoadingPage, null);
    }
    if (!enabledModules.blog) {
        return React.createElement(NotFoundPage, null);
    }
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement("div", { className: "container py-5" },
            React.createElement("div", { className: "row mb-4" },
                React.createElement("div", { className: "col-12 col-lg-8" }, latestPosts[0] && (React.createElement(Link, { to: "/posts/" + (latestPosts[0].codeName || latestPosts[0].id) },
                    React.createElement(FeaturingPostPreview, __assign({}, latestPosts[0], { variant: "headline" }))))),
                React.createElement("div", { className: "col-12 col-lg-4 d-flex flex-column justify-content-between" },
                    latestPosts[1] && (React.createElement(Link, { to: "/posts/" + (latestPosts[1].codeName || latestPosts[1].id) },
                        React.createElement(FeaturingPostPreview, __assign({}, latestPosts[1], { variant: "featuring" })))),
                    latestPosts[2] && (React.createElement(Link, { to: "/posts/" + (latestPosts[2].codeName || latestPosts[2].id) },
                        React.createElement(FeaturingPostPreview, __assign({}, latestPosts[2], { variant: "featuring" })))))),
            React.createElement("div", { className: "row" },
                React.createElement(PopularPostsBlock, { className: "col-12 col-lg-3 pl-4 mb-4" },
                    React.createElement(PopularPostCollection, null)),
                React.createElement("div", { className: "col-12 col-lg-9" },
                    React.createElement(StyledTitle, null, formatMessage(messages.latest)),
                    React.createElement(PostItemCollection, { posts: posts.slice(3), withTagSelector: true }))))));
};
export default BlogPage;
var templateObject_1, templateObject_2;
//# sourceMappingURL=BlogPage.js.map
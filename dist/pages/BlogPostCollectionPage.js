var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { StyledPostTitle } from '../components/blog';
import { PopularPostCollection } from '../components/blog/PostLinkCollection';
import PostPreviewCover from '../components/blog/PostPreviewCover';
import PostPreviewMeta from '../components/blog/PostPreviewMeta';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { desktopViewMixin } from '../helpers';
import { usePostPreviewCollection } from '../hooks/blog';
import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';
var StyledBanner = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  height: 6rem;\n  background-color: var(--gray-lighter);\n\n  ", "\n"], ["\n  display: flex;\n  align-items: center;\n  height: 6rem;\n  background-color: var(--gray-lighter);\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    height: 10rem;\n  "], ["\n    height: 10rem;\n  "])))));
var StyledBannerTitle = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n  text-align: center;\n\n  ", "\n"], ["\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n  text-align: center;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    font-size: 24px;\n    line-height: normal;\n    letter-spacing: 0.2px;\n    text-align: left;\n  "], ["\n    font-size: 24px;\n    line-height: normal;\n    letter-spacing: 0.2px;\n    text-align: left;\n  "])))));
var StyledAbstract = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  display: none;\n\n  ", "\n"], ["\n  display: none;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    overflow: hidden;\n    color: var(--gray-darker);\n    line-height: 1.69;\n    letter-spacing: 0.2px;\n    text-align: justify;\n  "], ["\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    overflow: hidden;\n    color: var(--gray-darker);\n    line-height: 1.69;\n    letter-spacing: 0.2px;\n    text-align: justify;\n  "])))));
var BlogPostCollectionPage = function () {
    var tags = useQueryParam('tags', StringParam)[0];
    var _a = useApp(), loading = _a.loading, enabledModules = _a.enabledModules;
    var posts = usePostPreviewCollection({ tags: tags === null || tags === void 0 ? void 0 : tags.split(',') }).posts;
    if (loading) {
        return React.createElement(LoadingPage, null);
    }
    if (!enabledModules.blog) {
        return React.createElement(NotFoundPage, null);
    }
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(StyledBanner, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledBannerTitle, null, tags === null || tags === void 0 ? void 0 : tags.split(',').map(function (tag) { return (React.createElement("span", { key: tag, className: "ml-2" },
                    "#",
                    tag)); })))),
        React.createElement("div", { className: "container py-5" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-12 col-lg-9" }, posts.map(function (post) { return (React.createElement(Link, { key: post.id, to: "/posts/" + (post.codeName || post.id) },
                    React.createElement("div", { className: "row no-gutters align-items-center mb-4" },
                        React.createElement("div", { className: "col-6 col-lg-4" },
                            React.createElement(PostPreviewCover, { variant: "list-item", coverUrl: post.coverUrl, withVideo: typeof post.videoUrl === 'string' })),
                        React.createElement("div", { className: "col-6 col-lg-8 pl-3 pl-lg-4" },
                            React.createElement(StyledPostTitle, { className: "list-item" }, post.title),
                            React.createElement("div", { className: "mb-lg-4" },
                                React.createElement(PostPreviewMeta, { author: post.author, publishedAt: post.publishedAt })),
                            React.createElement(StyledAbstract, null, post.abstract))))); })),
                React.createElement("div", { className: "col-12 col-lg-3 d-none d-lg-block pl-4" },
                    React.createElement(PopularPostCollection, null))))));
};
export default BlogPostCollectionPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=BlogPostCollectionPage.js.map
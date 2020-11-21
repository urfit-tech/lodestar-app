var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Divider, Skeleton } from 'antd';
import BraftEditor from 'braft-editor';
import { throttle } from 'lodash';
import moment from 'moment';
import { render } from 'mustache';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { StyledPostMeta } from '../components/blog';
import PostCover from '../components/blog/PostCover';
import { RelativePostCollection } from '../components/blog/PostLinkCollection';
import CreatorCard from '../components/common/CreatorCard';
import { BraftContent } from '../components/common/StyledBraftEditor';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { useAddPostViews, usePost } from '../hooks/blog';
import CalendarAltOIcon from '../images/calendar-alt-o.svg';
import EyeIcon from '../images/eye.svg';
import UserOIcon from '../images/user-o.svg';
import LoadingPage from './LoadingPage';
import NotFoundPage from './NotFoundPage';
var messages = defineMessages({
    prevPost: { id: 'blog.common.prevPost', defaultMessage: '上一則' },
    nextPost: { id: 'blog.common.nextPost', defaultMessage: '下一則' },
});
var StyledTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 2.5rem;\n  color: var(--gray-darker);\n  font-size: 28px;\n  font-weight: bold;\n  letter-spacing: 0.23px;\n"], ["\n  margin-bottom: 2.5rem;\n  color: var(--gray-darker);\n  font-size: 28px;\n  font-weight: bold;\n  letter-spacing: 0.23px;\n"])));
var StyledTag = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.4px;\n"], ["\n  color: ", ";\n  font-size: 14px;\n  line-height: 1.57;\n  letter-spacing: 0.4px;\n"])), function (props) { return props.theme; });
var StyledLabel = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 12px;\n  line-height: 1.83;\n  letter-spacing: 0.6px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 12px;\n  line-height: 1.83;\n  letter-spacing: 0.6px;\n"])));
var StyledSubTitle = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 16px;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 16px;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"])));
var BlogPostPage = function () {
    var formatMessage = useIntl().formatMessage;
    var postId = useParams().postId;
    var _a = useApp(), appId = _a.id, loading = _a.loading, enabledModules = _a.enabledModules, settings = _a.settings;
    var _b = usePost(postId), loadingPost = _b.loadingPost, post = _b.post;
    var addPostView = useAddPostViews();
    var _c = useState(false), isScrollingDown = _c[0], setIsScrollingDown = _c[1];
    var handleScroll = useCallback(throttle(function () {
        var postCoverElem = document.querySelector('#post-cover');
        var layoutContentElem = document.querySelector('#layout-content');
        if (!postCoverElem || !layoutContentElem) {
            return;
        }
        if (layoutContentElem.scrollTop > postCoverElem.scrollHeight) {
            if (isScrollingDown) {
                return;
            }
            setIsScrollingDown(true);
        }
        else {
            setIsScrollingDown(false);
        }
    }, 100), [post]);
    useEffect(function () {
        var _a;
        (_a = document.getElementById('layout-content')) === null || _a === void 0 ? void 0 : _a.scrollTo({ top: 0 });
    }, [postId]);
    useEffect(function () {
        var layoutContentElem = document.querySelector('#layout-content');
        if (!layoutContentElem) {
            return;
        }
        layoutContentElem.addEventListener('scroll', function () { return handleScroll(); });
        return layoutContentElem.removeEventListener('scroll', function () { return handleScroll(); });
    }, [handleScroll]);
    if (loading || loadingPost) {
        return React.createElement(LoadingPage, null);
    }
    if (!enabledModules.blog || !post) {
        return React.createElement(NotFoundPage, null);
    }
    if (post.codeName && post.codeName !== postId) {
        return React.createElement(Redirect, { to: "/posts/" + post.codeName });
    }
    try {
        var visitedPosts = JSON.parse(sessionStorage.getItem('kolable.posts.visited') || '[]');
        if (!visitedPosts.includes(post.id)) {
            visitedPosts.push(post.id);
            sessionStorage.setItem('kolable.posts.visited', JSON.stringify(visitedPosts));
            addPostView(post.id);
        }
    }
    catch (error) { }
    var seoMeta;
    try {
        seoMeta = JSON.parse(settings['seo.meta']).ActivityPage;
    }
    catch (error) { }
    var siteTitle = post.title
        ? (seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title) ? "" + render(seoMeta.title, { activityTitle: post.title })
            : post.title
        : appId;
    var siteDescription = BraftEditor.createEditorState(post.description)
        .toHTML()
        .replace(/(<([^>]+)>)/gi, '')
        .substr(0, 50);
    var ldData = JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: siteTitle,
        image: post.coverUrl,
        description: siteDescription,
        url: window.location.href,
        brand: {
            '@type': 'Brand',
            name: siteTitle,
            description: siteDescription,
        },
    });
    return (React.createElement(DefaultLayout, { white: true, noHeader: isScrollingDown },
        React.createElement(Helmet, null,
            React.createElement("title", null, siteTitle),
            React.createElement("meta", { name: "description", content: siteDescription }),
            React.createElement("meta", { property: "og:type", content: "website" }),
            React.createElement("meta", { property: "og:title", content: siteTitle }),
            React.createElement("meta", { property: "og:url", content: window.location.href }),
            React.createElement("meta", { property: "og:image", content: post.coverUrl || '' }),
            React.createElement("meta", { property: "og:description", content: siteDescription }),
            React.createElement("script", { type: "application/ld+json" }, ldData)),
        !loadingPost && (React.createElement(PostCover, { title: (post === null || post === void 0 ? void 0 : post.title) || '', coverUrl: (post === null || post === void 0 ? void 0 : post.videoUrl) || (post === null || post === void 0 ? void 0 : post.coverUrl) || null, type: (post === null || post === void 0 ? void 0 : post.videoUrl) ? 'video' : 'picture', merchandises: (post === null || post === void 0 ? void 0 : post.merchandises) || [], isScrollingDown: isScrollingDown })),
        React.createElement("div", { className: "container py-5" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-12 col-lg-9" },
                    React.createElement(StyledPostMeta, { className: "pb-3" },
                        React.createElement(Icon, { src: UserOIcon, className: "mr-1" }),
                        React.createElement("span", { className: "mr-2" }, post === null || post === void 0 ? void 0 : post.author.name),
                        React.createElement(Icon, { src: CalendarAltOIcon, className: "mr-1" }),
                        React.createElement("span", { className: "mr-2" }, (post === null || post === void 0 ? void 0 : post.publishedAt) ? moment(post.publishedAt).format('YYYY-MM-DD') : ''),
                        React.createElement(Icon, { src: EyeIcon, className: "mr-1" }),
                        React.createElement("span", null, post === null || post === void 0 ? void 0 : post.views)),
                    React.createElement(StyledTitle, null, post === null || post === void 0 ? void 0 : post.title),
                    React.createElement("div", { className: "mb-5" }, loadingPost ? React.createElement(Skeleton, { active: true }) : React.createElement(BraftContent, null, post === null || post === void 0 ? void 0 : post.description)),
                    React.createElement("div", { className: "mb-5" }, post === null || post === void 0 ? void 0 : post.tags.map(function (tag) { return (React.createElement(Link, { key: tag, to: "/posts/?tags=" + tag, className: "mr-2" },
                        React.createElement(StyledTag, null,
                            "#",
                            tag))); })),
                    React.createElement(Divider, null),
                    React.createElement("div", { className: "py-3" }, (post === null || post === void 0 ? void 0 : post.author) && (React.createElement(CreatorCard, { id: post.author.id, avatarUrl: post.author.avatarUrl, title: post.author.name, labels: [], description: post.author.abstract || '', withProgram: true, withPodcast: true, withAppointment: true, withBlog: true, noPadding: true }))),
                    React.createElement(Divider, { className: "mb-5" }),
                    React.createElement("div", { className: "row mb-5" },
                        React.createElement("div", { className: "col-6 col-lg-4" }, (post === null || post === void 0 ? void 0 : post.prevPost) && (React.createElement(Link, { to: "/posts/" + (post.prevPost.codeName || post.prevPost.id) },
                            React.createElement(StyledLabel, null, formatMessage(messages.prevPost)),
                            React.createElement(StyledSubTitle, null, post.prevPost.title)))),
                        React.createElement("div", { className: "col-6 col-lg-4 offset-lg-4" }, (post === null || post === void 0 ? void 0 : post.nextPost) && (React.createElement(Link, { to: "/posts/" + (post.nextPost.codeName || post.nextPost.id), className: "text-right" },
                            React.createElement(StyledLabel, null, formatMessage(messages.nextPost)),
                            React.createElement(StyledSubTitle, null, post.nextPost.title)))))),
                React.createElement("div", { className: "col-12 col-lg-3 pl-4" },
                    React.createElement(RelativePostCollection, { postId: postId, tags: post === null || post === void 0 ? void 0 : post.tags }))))));
};
export default BlogPostPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=BlogPostPage.js.map
import { Button } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { messages, StyledPostTitle, StyledTitle } from '.';
import { commonMessages } from '../../helpers/translation';
import { usePopularPostCollection, useRelativePostCollection } from '../../hooks/blog';
import PostPreviewCover from './PostPreviewCover';
export var PopularPostCollection = function () {
    var formatMessage = useIntl().formatMessage;
    var _a = usePopularPostCollection(), posts = _a.posts, postCount = _a.postCount, fetchMorePost = _a.fetchMorePost;
    var _b = useState(0), page = _b[0], setPage = _b[1];
    return (React.createElement(PostLinkCollection, { title: formatMessage(messages.popular), posts: posts, onFetchMore: posts.length < postCount ? function () { return fetchMorePost(page + 1).then(function () { return setPage(page + 1); }); } : undefined }));
};
export var RelativePostCollection = function (_a) {
    var postId = _a.postId, tags = _a.tags;
    var formatMessage = useIntl().formatMessage;
    var _b = useRelativePostCollection(postId, tags), posts = _b.posts, postCount = _b.postCount, fetchMorePost = _b.fetchMorePost;
    var _c = useState(0), page = _c[0], setPage = _c[1];
    return (React.createElement(PostLinkCollection, { title: posts.length ? formatMessage(messages.relative) : undefined, posts: posts, onFetchMore: posts.length < postCount ? function () { return fetchMorePost(page + 1).then(function () { return setPage(page + 1); }); } : undefined }));
};
var PostLinkCollection = function (_a) {
    var title = _a.title, posts = _a.posts, onFetchMore = _a.onFetchMore;
    var formatMessage = useIntl().formatMessage;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    return (React.createElement(React.Fragment, null,
        typeof title === 'string' && React.createElement(StyledTitle, null, title),
        posts.map(function (post) { return (React.createElement(Link, { key: post.id, to: "/posts/" + (post.codeName || post.id) },
            React.createElement("div", { className: "row align-items-center mb-3" },
                React.createElement("div", { className: "col-6" },
                    React.createElement(PostPreviewCover, { variant: "popular", coverUrl: post.coverUrl, withVideo: !!post.videoUrl })),
                React.createElement("div", { className: "col-6 pl-1" },
                    React.createElement(StyledPostTitle, { className: "feature", rows: 2 }, post.title))))); }),
        onFetchMore && (React.createElement("div", null,
            React.createElement(Button, { type: "link", className: "p-0", onClick: function () {
                    setLoading(true);
                    onFetchMore && onFetchMore().finally(function () { return setLoading(false); });
                }, loading: loading }, formatMessage(commonMessages.defaults.more))))));
};
//# sourceMappingURL=PostLinkCollection.js.map
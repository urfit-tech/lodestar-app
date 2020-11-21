import moment from 'moment-timezone';
import React from 'react';
import Icon from 'react-inlinesvg';
import { StyledPostMeta } from '.';
import CalendarAltOIcon from '../../images/calendar-alt-o.svg';
import UserOIcon from '../../images/user-o.svg';
var PostPreviewMeta = function (_a) {
    var author = _a.author, publishedAt = _a.publishedAt;
    return (React.createElement(StyledPostMeta, null,
        React.createElement("div", { className: "mb-1" },
            React.createElement(Icon, { src: UserOIcon, className: "mr-1" }),
            React.createElement("span", { className: "mr-2" }, author.name)),
        React.createElement("div", { className: "mb-1" },
            React.createElement(Icon, { src: CalendarAltOIcon, className: "mr-1" }),
            React.createElement("span", null, publishedAt ? moment(publishedAt).format('YYYY-MM-DD') : ''))));
};
export default PostPreviewMeta;
//# sourceMappingURL=PostPreviewMeta.js.map
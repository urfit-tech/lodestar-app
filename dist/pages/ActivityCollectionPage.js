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
import { Button, Icon, Skeleton } from 'antd';
import { uniqBy, unnest } from 'ramda';
import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import Activity from '../components/activity/Activity';
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout';
import DefaultLayout from '../components/layout/DefaultLayout';
import LanguageContext from '../contexts/LanguageContext';
import { commonMessages, productMessages } from '../helpers/translation';
import { usePublishedActivityCollection } from '../hooks/activity';
import { useNav } from '../hooks/data';
var ActivityCollectionPage = function () {
    var currentLanguage = useContext(LanguageContext).currentLanguage;
    var _a = usePublishedActivityCollection(), loadingActivities = _a.loadingActivities, errorActivities = _a.errorActivities, activities = _a.activities;
    var _b = useState(null), selectedCategoryId = _b[0], setSelectedCategoryId = _b[1];
    var formatMessage = useIntl().formatMessage;
    var pageTitle = useNav().pageTitle;
    var categories = uniqBy(function (category) { return category.id; }, unnest(activities.map(function (activity) { return activity.categories; })));
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(StyledBanner, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledBannerTitle, null,
                    React.createElement(Icon, { type: "appstore", theme: "filled", className: "mr-3" }),
                    React.createElement("span", null, pageTitle || formatMessage(productMessages.activity.title.default))),
                React.createElement(Button, { type: selectedCategoryId === null ? 'primary' : 'default', shape: "round", onClick: function () { return setSelectedCategoryId(null); }, className: "mb-2" }, formatMessage(commonMessages.button.allCategory)),
                categories.map(function (category) { return (React.createElement(Button, { key: category.id, type: selectedCategoryId === category.id ? 'primary' : 'default', shape: "round", className: "ml-2 mb-2", onClick: function () { return setSelectedCategoryId(category.id); } }, category.name)); }))),
        React.createElement(StyledCollection, null,
            React.createElement("div", { className: "container" },
                loadingActivities && React.createElement(Skeleton, null),
                errorActivities && React.createElement("div", null, formatMessage(commonMessages.status.readingError)),
                React.createElement("div", { className: "row" }, activities
                    .filter(function (activity) {
                    return selectedCategoryId === null ||
                        activity.categories.some(function (category) { return category.id === selectedCategoryId; });
                })
                    .filter(function (activity) {
                    return !activity.supportLocales || activity.supportLocales.find(function (locale) { return locale === currentLanguage; });
                })
                    .map(function (activity) { return (React.createElement("div", { key: activity.id, className: "col-12 col-md-6 col-lg-4 mb-4" },
                    React.createElement(Activity, __assign({}, activity)))); }))))));
};
export default ActivityCollectionPage;
//# sourceMappingURL=ActivityCollectionPage.js.map
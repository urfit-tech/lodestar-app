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
import { Input } from 'antd';
import { flatten, uniqBy } from 'ramda';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout';
import DefaultLayout from '../components/layout/DefaultLayout';
import MerchandiseCard from '../components/merchandise/MerchandiseCard';
import { commonMessages, productMessages } from '../helpers/translation';
import { useMerchandiseCollection } from '../hooks/merchandise';
import ShopIcon from '../images/shop.svg';
var messages = defineMessages({
    keywordSearch: { id: 'product.merchandise.placeholder.keywordSearch', defaultMessage: '關鍵字搜尋' },
});
var StyledSearchBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  max-width: 835px;\n  width: 100%;\n  margin: 0 auto;\n"], ["\n  max-width: 835px;\n  width: 100%;\n  margin: 0 auto;\n"])));
var StyledTagGroup = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1.57;\n  letter-spacing: 0.4px;\n"], ["\n  color: ", ";\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1.57;\n  letter-spacing: 0.4px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledCategoryList = styled.ul(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  list-style-type: none;\n\n  li {\n    cursor: pointer;\n    transition: 0.3s;\n\n    &:hover {\n      color: ", ";\n    }\n  }\n"], ["\n  list-style-type: none;\n\n  li {\n    cursor: pointer;\n    transition: 0.3s;\n\n    &:hover {\n      color: ", ";\n    }\n  }\n"])), function (props) { return props.theme['@primary-color']; });
var MerchandiseCollectionPage = function () {
    var formatMessage = useIntl().formatMessage;
    var tag = useQueryParam('tag', StringParam)[0];
    var _a = useQueryParam('keyword', StringParam), keyword = _a[0], setKeyword = _a[1];
    var _b = useMerchandiseCollection(keyword), merchandises = _b.merchandises, merchandiseTags = _b.merchandiseTags;
    var _c = useState(), categoryId = _c[0], setCategoryId = _c[1];
    var filteredMerchandises = merchandises.filter(function (merchandise) { var _a; return !tag || ((_a = merchandise.tags) === null || _a === void 0 ? void 0 : _a.includes(tag)); });
    var merchandiseCategories = uniqBy(function (category) { return category.id; }, flatten(filteredMerchandises.map(function (merchandise) { return merchandise.categories || []; })));
    useEffect(function () {
        if (merchandises) {
            var index = 1;
            for (var _i = 0, merchandises_1 = merchandises; _i < merchandises_1.length; _i++) {
                var merchandise = merchandises_1[_i];
                for (var _a = 0, _b = merchandise.specs; _a < _b.length; _a++) {
                    var spec = _b[_a];
                    ReactGA.plugin.execute('ec', 'addImpression', {
                        id: spec.id,
                        name: merchandise.title + " - " + spec.title,
                        category: 'MerchandiseSpec',
                        price: "" + spec.listPrice,
                        position: index,
                    });
                    index += 1;
                    if (index % 20 === 0)
                        ReactGA.ga('send', 'pageview');
                }
            }
            ReactGA.ga('send', 'pageview');
        }
    }, [merchandises]);
    return (React.createElement(DefaultLayout, { white: true },
        React.createElement(StyledBanner, null,
            React.createElement("div", { className: "container" },
                React.createElement(StyledBannerTitle, null, tag ? (React.createElement(React.Fragment, null,
                    "#",
                    tag)) : (React.createElement(React.Fragment, null,
                    React.createElement(Icon, { src: ShopIcon, className: "mr-3" }),
                    React.createElement("span", null, formatMessage(productMessages.merchandise.title.mall))))),
                !tag && (React.createElement(StyledSearchBlock, null,
                    React.createElement(Input.Search, { className: "mb-2", placeholder: formatMessage(messages.keywordSearch), onSearch: function (keyword) {
                            setKeyword(keyword);
                            setCategoryId(null);
                        } }),
                    React.createElement(StyledTagGroup, null, merchandiseTags.map(function (merchandiseTag) { return (React.createElement(Link, { key: merchandiseTag, to: "/merchandises?tag=" + merchandiseTag, onClick: function () {
                            setKeyword('');
                            setCategoryId(null);
                        }, className: "mr-2" },
                        "#",
                        merchandiseTag)); })))))),
        React.createElement(StyledCollection, { className: "container" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: tag ? 'col-12' : 'col-lg-8 col-12' },
                    React.createElement("div", { className: "row" }, filteredMerchandises
                        .filter(function (merchandise) { var _a; return !categoryId || ((_a = merchandise.categories) === null || _a === void 0 ? void 0 : _a.map(function (category) { return category.id; }).includes(categoryId)); })
                        .map(function (merchandise) { return (React.createElement("div", { key: merchandise.id, className: "col-lg-4 col-12 mb-5" },
                        React.createElement(Link, { to: "/merchandises/" + merchandise.id },
                            React.createElement(MerchandiseCard, __assign({}, merchandise))))); }))),
                !tag && (React.createElement("div", { className: "col-lg-4 col-12" },
                    React.createElement(StyledCategoryList, null,
                        React.createElement("li", { className: "mb-2", onClick: function () { return setCategoryId(null); } },
                            formatMessage(commonMessages.ui.all),
                            " (",
                            filteredMerchandises.length,
                            ")"),
                        merchandiseCategories.map(function (merchandiseCategory) {
                            var count = filteredMerchandises.filter(function (merchandise) { var _a; return (_a = merchandise.categories) === null || _a === void 0 ? void 0 : _a.map(function (category) { return category.id; }).includes(merchandiseCategory.id); }).length;
                            return (React.createElement("li", { className: "mb-2", key: merchandiseCategory.id, onClick: function () { return setCategoryId(merchandiseCategory.id); } },
                                merchandiseCategory.name,
                                " (",
                                count,
                                ")"));
                        }))))))));
};
export default MerchandiseCollectionPage;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=MerchandiseCollectionPage.js.map
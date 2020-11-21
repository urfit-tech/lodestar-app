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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useContext } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import LanguageContext from '../../contexts/LanguageContext';
import ShortenPeriodTypeLabel from './ShortenPeriodTypeLabel';
var messages = defineMessages({
    listPrice: { id: 'common.label.listPrice', defaultMessage: '定價' },
    free: { id: 'common.label.free', defaultMessage: '免費' },
    firstPeriod: { id: 'common.label.firstPeriod', defaultMessage: '首期' },
    fromSecondPeriod: { id: 'common.label.fromSecondPeriod', defaultMessage: '第二期開始' },
    originalPrice: { id: 'common.label.originalPrice', defaultMessage: '原價' },
});
var FullDetailPrice = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  > div:first-child {\n    color: var(--gray-darker);\n    font-size: 28px;\n    font-weight: bold;\n  }\n  > div:nth-child(2) {\n    color: var(--gray-darker);\n  }\n"], ["\n  > div:first-child {\n    color: var(--gray-darker);\n    font-size: 28px;\n    font-weight: bold;\n  }\n  > div:nth-child(2) {\n    color: var(--gray-darker);\n  }\n"])));
var SalePrice = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var ListPrice = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  ", " + && {\n    color: var(--black-45);\n    font-size: 14px;\n    text-decoration: line-through;\n  }\n"], ["\n  ", " + && {\n    color: var(--black-45);\n    font-size: 14px;\n    text-decoration: line-through;\n  }\n"])), SalePrice);
var InlinePrice = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: ", ";\n\n  & > span:first-child:not(:last-child) {\n    margin-right: 0.5rem;\n    color: ", ";\n    text-decoration: line-through;\n  }\n"], ["\n  color: ", ";\n\n  & > span:first-child:not(:last-child) {\n    margin-right: 0.5rem;\n    color: ", ";\n    text-decoration: line-through;\n  }\n"])), function (props) { return props.theme['@primary-color']; }, function (props) { return 'var(--gray-dark);'; });
var PriceLabel = function (_a) {
    var variant = _a.variant, render = _a.render, noFreeText = _a.noFreeText, options = __rest(_a, ["variant", "render", "noFreeText"]);
    var listPrice = options.listPrice, salePrice = options.salePrice, downPrice = options.downPrice, periodAmount = options.periodAmount, periodType = options.periodType;
    var formatMessage = useIntl().formatMessage;
    var _b = useApp(), appCurrencyId = _b.currencyId, settings = _b.settings;
    var currentLanguage = useContext(LanguageContext).currentLanguage;
    var currencyId = options.currencyId || appCurrencyId;
    var displayPrice = salePrice || listPrice;
    var firstPeriodPrice = displayPrice - (downPrice || 0);
    var formatPrice = function (price) {
        if (currencyId === 'LSC') {
            return price + (settings['coin.unit'] || 'Coins');
        }
        return price.toLocaleString(currentLanguage, { style: 'currency', currency: currencyId, minimumFractionDigits: 0 });
    };
    if (render) {
        return render(__assign(__assign({}, options), { formatPrice: formatPrice }));
    }
    var periodElem = !!periodType && (React.createElement(React.Fragment, null, " / " + (periodAmount && periodAmount > 1 ? periodAmount : ''),
        React.createElement(ShortenPeriodTypeLabel, { periodType: periodType, withQuantifier: !!periodAmount && periodAmount > 1 })));
    if (variant === 'full-detail') {
        return (React.createElement(FullDetailPrice, null,
            !!downPrice && (React.createElement("div", null,
                formatMessage(messages.firstPeriod),
                firstPeriodPrice === 0 && !noFreeText && formatMessage(messages.free),
                formatPrice(firstPeriodPrice))),
            typeof salePrice === 'number' && (React.createElement(SalePrice, null,
                !!downPrice && formatMessage(messages.fromSecondPeriod),
                salePrice === 0 && !noFreeText && formatMessage(messages.free),
                formatPrice(salePrice),
                React.createElement("span", { style: { fontSize: '16px' } }, periodElem))),
            React.createElement(ListPrice, null,
                typeof salePrice === 'number'
                    ? formatMessage(messages.originalPrice)
                    : !!downPrice
                        ? formatMessage(messages.fromSecondPeriod)
                        : '',
                listPrice === 0 && !noFreeText && formatMessage(messages.free),
                formatPrice(listPrice),
                React.createElement("span", { style: { fontSize: '16px' } }, periodElem))));
    }
    if (variant === 'inline') {
        return (React.createElement(InlinePrice, null,
            React.createElement("span", null,
                formatPrice(listPrice),
                periodElem),
            typeof salePrice === 'number' && (React.createElement("span", null,
                formatPrice(salePrice),
                periodElem))));
    }
    return React.createElement(React.Fragment, null, formatPrice(listPrice));
};
export default PriceLabel;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=PriceLabel.js.map
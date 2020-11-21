var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Spin, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import ProductTypeLabel from '../../components/common/ProductTypeLabel';
import { desktopViewMixin } from '../../helpers';
import { commonMessages, productMessages } from '../../helpers/translation';
import { useSimpleProduct } from '../../hooks/common';
import EmptyCover from '../../images/empty-cover.png';
import { CustomRatioImage } from './Image';
import PriceLabel from './PriceLabel';
var StyledCoverImage = styled.img(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 64px;\n  height: 48px;\n  min-height: 1px;\n  border-radius: 4px;\n  object-fit: cover;\n  object-position: center;\n"], ["\n  width: 64px;\n  height: 48px;\n  min-height: 1px;\n  border-radius: 4px;\n  object-fit: cover;\n  object-position: center;\n"])));
var StyledProductType = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 12px;\n  letter-spacing: 0.6px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 12px;\n  letter-spacing: 0.6px;\n"])));
var StyledProductTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"])));
var StyledTitle = styled(Typography.Title)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  && {\n    color: var(--gray-darker);\n    font-size: 20px;\n    font-weight: bold;\n    line-height: 1.3;\n    letter-spacing: 0.77px;\n  }\n"], ["\n  && {\n    color: var(--gray-darker);\n    font-size: 20px;\n    font-weight: bold;\n    line-height: 1.3;\n    letter-spacing: 0.77px;\n  }\n"])));
var StyledPeriod = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  color: var(--gray-dark);\n"], ["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  color: var(--gray-dark);\n"])));
var StyledMeta = styled.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-top: 0.5rem;\n  min-width: 4.5rem;\n  white-space: nowrap;\n\n  ", "\n"], ["\n  margin-top: 0.5rem;\n  min-width: 4.5rem;\n  white-space: nowrap;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    margin-top: 0;\n    text-align: right;\n  "], ["\n    margin-top: 0;\n    text-align: right;\n  "])))));
var StyledHighlight = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n  letter-spacing: 0.18px;\n  margin-top: 8px;\n"], ["\n  color: ", ";\n  font-size: 14px;\n  letter-spacing: 0.18px;\n  margin-top: 8px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledListLabelBLock = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  width: 5rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  width: 5rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledListTitleBlock = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  overflow: hidden;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n"], ["\n  overflow: hidden;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n"])));
var ProductItem = function (_a) {
    var id = _a.id, startedAt = _a.startedAt, variant = _a.variant, quantity = _a.quantity;
    var formatMessage = useIntl().formatMessage;
    var target = useSimpleProduct({ id: id, startedAt: startedAt }).target;
    var productType = id.split('_')[0];
    if (!target) {
        if (variant === 'coupon-product') {
            return React.createElement(Spin, { size: "small", className: "d-block" });
        }
        return React.createElement(Spin, { size: "large" });
    }
    var title = target.title, coverUrl = target.coverUrl, listPrice = target.listPrice, salePrice = target.salePrice, discountDownPrice = target.discountDownPrice, periodAmount = target.periodAmount, periodType = target.periodType, endedAt = target.endedAt, isSubscription = target.isSubscription;
    switch (variant) {
        case 'simple':
            return (React.createElement(React.Fragment, null,
                React.createElement(StyledTitle, { level: 2, ellipsis: { rows: 2 }, className: "flex-grow-1 m-0 mr-5" }, title),
                React.createElement(StyledCoverImage, { src: coverUrl || EmptyCover, alt: id, className: "flex-shrink-0" })));
        case 'coupon-product':
            return (React.createElement("div", { className: "d-flex mb-1" },
                React.createElement(StyledListLabelBLock, { className: "flex-shrink-0" },
                    React.createElement(ProductTypeLabel, { productType: productType })),
                React.createElement(StyledListTitleBlock, { className: "flex-grow-1" }, title)));
        case 'simpleCartProduct':
            return (React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
                React.createElement(CustomRatioImage, { width: "4rem", ratio: 2 / 3, src: coverUrl || EmptyCover, shape: "rounded", className: "flex-shrink-0 mr-3" }),
                React.createElement("div", { className: "flex-grow-1" },
                    React.createElement(Typography.Paragraph, { ellipsis: { rows: 2 }, className: "mb-0" },
                        title,
                        typeof quantity === 'number' ? " x" + quantity : ''),
                    React.createElement(StyledMeta, { className: "text-left" },
                        React.createElement(PriceLabel, { listPrice: (salePrice || listPrice || 0) * (quantity || 1) })))));
        case 'checkout':
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
                    React.createElement(StyledTitle, { level: 2, ellipsis: { rows: 2 }, className: "flex-grow-1 m-0 mr-5" },
                        React.createElement("span", null, title),
                        !!startedAt && !!endedAt && (React.createElement(StyledPeriod, { className: "mt-2" }, moment(startedAt).format('YYYY-MM-DD(dd)') + " " + moment(startedAt).format('HH:mm') + " - " + moment(endedAt).format('HH:mm')))),
                    React.createElement(CustomRatioImage, { width: "88px", ratio: 3 / 4, src: coverUrl || EmptyCover, shape: "rounded", className: "flex-shrink-0" })),
                typeof listPrice == 'number' && (React.createElement(PriceLabel, { variant: "full-detail", listPrice: listPrice, salePrice: salePrice, downPrice: discountDownPrice, periodType: isSubscription === undefined && periodType ? periodType : undefined, periodAmount: isSubscription === undefined && periodType ? periodAmount : undefined })),
                isSubscription === false && periodType && (React.createElement(StyledHighlight, { className: "mb-3" }, formatMessage(productMessages.programPackage.label.availableForLimitTime, {
                    amount: periodAmount,
                    unit: periodType === 'D'
                        ? formatMessage(commonMessages.unit.day)
                        : periodType === 'W'
                            ? formatMessage(commonMessages.unit.week)
                            : periodType === 'M'
                                ? formatMessage(commonMessages.unit.monthWithQuantifier)
                                : periodType === 'Y'
                                    ? formatMessage(commonMessages.unit.year)
                                    : formatMessage(commonMessages.unknown.period),
                })))));
    }
    return (React.createElement("div", { className: "d-flex align-items-center justify-content-start" },
        React.createElement(CustomRatioImage, { width: "64px", ratio: 3 / 4, src: coverUrl || EmptyCover, shape: "rounded", className: "flex-shrink-0 mr-3" }),
        React.createElement("div", { className: "flex-grow-1" },
            React.createElement(StyledProductType, null,
                React.createElement(ProductTypeLabel, { productType: productType })),
            React.createElement(StyledProductTitle, null, title))));
};
export default ProductItem;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=ProductItem.js.map
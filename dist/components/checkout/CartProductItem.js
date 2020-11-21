var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Spin, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import ProductTypeLabel from '../../components/common/ProductTypeLabel';
import CartContext from '../../contexts/CartContext';
import { desktopViewMixin } from '../../helpers';
import { commonMessages } from '../../helpers/translation';
import { useSimpleProduct } from '../../hooks/common';
import EmptyCover from '../../images/empty-cover.png';
import ExclamationCircleIcon from '../../images/exclamation-circle.svg';
import { CustomRatioImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
import QuantityInput from '../common/QuantityInput';
var messages = defineMessages({
    remainStock: { id: 'product.text.remainStock', defaultMessage: '剩餘庫存' },
});
var StyledContentBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), desktopViewMixin(css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  "], ["\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n  "])))));
var StyledMeta = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-top: 0.5rem;\n  min-width: 4.5rem;\n  white-space: nowrap;\n\n  ", "\n"], ["\n  margin-top: 0.5rem;\n  min-width: 4.5rem;\n  white-space: nowrap;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    margin-top: 0;\n    text-align: right;\n  "], ["\n    margin-top: 0;\n    text-align: right;\n  "])))));
var StyledInventoryBlock = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 14px;\n"], ["\n  font-size: 14px;\n"])));
var CartProductItem = function (_a) {
    var id = _a.id, quantity = _a.quantity, buyableQuantity = _a.buyableQuantity;
    var formatMessage = useIntl().formatMessage;
    var updatePluralCartProductQuantity = useContext(CartContext).updatePluralCartProductQuantity;
    var target = useSimpleProduct({ id: id }).target;
    var _b = useState(quantity || 1), pluralProductQuantity = _b[0], setPluralProductQuantity = _b[1];
    useEffect(function () {
        updatePluralCartProductQuantity === null || updatePluralCartProductQuantity === void 0 ? void 0 : updatePluralCartProductQuantity(id, pluralProductQuantity);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, pluralProductQuantity]);
    if (!target) {
        return React.createElement(Spin, { size: "large" });
    }
    var productType = id.split('_')[0];
    var title = target.title, coverUrl = target.coverUrl, listPrice = target.listPrice, salePrice = target.salePrice, isLimited = target.isLimited, isPhysical = target.isPhysical;
    return (React.createElement("div", { className: "flex-grow-1 d-flex align-items-center justify-content-start" },
        React.createElement(CustomRatioImage, { width: "5rem", ratio: 2 / 3, src: coverUrl || EmptyCover, shape: "rounded", className: "flex-shrink-0 mr-3", disabled: buyableQuantity === 0 }),
        React.createElement(StyledContentBlock, { className: "flex-grow-1 mr-2" },
            React.createElement(Typography.Paragraph, { ellipsis: { rows: 2 }, className: "flex-grow-1 mb-0 mr-2" },
                title,
                pluralProductQuantity > 0 && " x" + pluralProductQuantity),
            !!buyableQuantity && quantity > buyableQuantity && (React.createElement(StyledInventoryBlock, { className: "d-flex align-items-center mr-3" },
                React.createElement(Icon, { src: ExclamationCircleIcon, className: "mr-2" }), formatMessage(messages.remainStock) + " " + buyableQuantity)),
            ((productType === 'ProjectPlan' && isLimited === true) ||
                (productType === 'Merchandise' && isPhysical === true)) &&
                !!buyableQuantity &&
                buyableQuantity > 0 && (React.createElement("div", { className: "d-flex flex-column flex-md-row align-items-left align-items-md-center mr-md-3" },
                React.createElement(QuantityInput, { value: pluralProductQuantity, min: 1, max: buyableQuantity, onChange: function (value) { return setPluralProductQuantity(value || 1); } }))),
            productType === 'ProjectPlan' && isLimited === true && isPhysical === false && (React.createElement("div", { className: "mr-3" },
                React.createElement(QuantityInput, { value: pluralProductQuantity, min: 1, onChange: function (value) { return setPluralProductQuantity(value || 1); } }))),
            ((productType === 'ProjectPlan' && isLimited === true) || productType === 'Merchandise') &&
                buyableQuantity === 0 ? (React.createElement(StyledInventoryBlock, { className: "d-flex align-items-center" },
                React.createElement(Icon, { src: ExclamationCircleIcon, className: "mr-2" }),
                React.createElement("span", null, formatMessage(commonMessages.button.soldOut)))) : (React.createElement(React.Fragment, null,
                React.createElement(StyledMeta, { className: "mr-2 d-none d-md-block" },
                    React.createElement(ProductTypeLabel, { productType: productType })),
                React.createElement(StyledMeta, null,
                    React.createElement(PriceLabel, { listPrice: (salePrice || listPrice || 0) * pluralProductQuantity })))))));
};
export default CartProductItem;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=CartProductItem.js.map
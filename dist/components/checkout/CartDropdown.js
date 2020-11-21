var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Badge, Button, List, Popover } from 'antd';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ProductItem from '../../components/common/ProductItem';
import CartContext from '../../contexts/CartContext';
import { checkoutMessages, commonMessages } from '../../helpers/translation';
var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100vw;\n  max-width: 320px;\n"], ["\n  width: 100vw;\n  max-width: 320px;\n"])));
var StyledList = styled(List)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    max-height: calc(70vh - 57px - 42px);\n    overflow-y: auto;\n    overflow-x: hidden;\n  }\n"], ["\n  && {\n    max-height: calc(70vh - 57px - 42px);\n    overflow-y: auto;\n    overflow-x: hidden;\n  }\n"])));
var StyledListItem = styled(List.Item)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    padding: 12px;\n    cursor: pointer;\n  }\n"], ["\n  && {\n    padding: 12px;\n    cursor: pointer;\n  }\n"])));
var StyledAction = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  border-top: 1px solid #ececec;\n\n  button {\n    color: #9b9b9b;\n  }\n"], ["\n  border-top: 1px solid #ececec;\n\n  button {\n    color: #9b9b9b;\n  }\n"])));
var StyledBadge = styled(Badge)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  button {\n    font-size: 20px;\n  }\n\n  .ant-badge-count {\n    top: 8px;\n    right: 4px;\n  }\n"], ["\n  button {\n    font-size: 20px;\n  }\n\n  .ant-badge-count {\n    top: 8px;\n    right: 4px;\n  }\n"])));
var StyledButton = styled(Button)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  &&,\n  &&:hover,\n  &&:active,\n  &&:focus {\n    color: var(--gray-darker);\n  }\n"], ["\n  &&,\n  &&:hover,\n  &&:active,\n  &&:focus {\n    color: var(--gray-darker);\n  }\n"])));
var CartDropdown = function () {
    var cartProducts = useContext(CartContext).cartProducts;
    var formatMessage = useIntl().formatMessage;
    var content = (React.createElement(Wrapper, null, cartProducts.length > 0 ? (React.createElement(React.Fragment, null,
        React.createElement(StyledList, { itemLayout: "horizontal" }, cartProducts.map(function (cartProduct) {
            var _a;
            return (React.createElement(StyledListItem, { key: cartProduct.productId },
                React.createElement(ProductItem, { id: cartProduct.productId, variant: "simpleCartProduct", quantity: (_a = cartProduct.options) === null || _a === void 0 ? void 0 : _a.quantity })));
        })),
        React.createElement(StyledAction, null,
            React.createElement(Link, { to: "/cart" },
                React.createElement(Button, { type: "link", block: true }, formatMessage(commonMessages.button.list)))))) : (React.createElement("div", { className: "p-3 d-flex align-items-center" },
        React.createElement("span", { className: "mr-2" }, formatMessage(checkoutMessages.content.cartNothing)),
        React.createElement(Link, { to: "/programs" }, formatMessage(checkoutMessages.link.cartExplore))))));
    return (React.createElement(Popover, { placement: "bottomRight", trigger: "click", title: formatMessage(checkoutMessages.title.cart), content: content },
        React.createElement(StyledBadge, { count: cartProducts.length, className: "mr-2" },
            React.createElement(StyledButton, { type: "link", icon: "shopping-cart" }))));
};
export default CartDropdown;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=CartDropdown.js.map
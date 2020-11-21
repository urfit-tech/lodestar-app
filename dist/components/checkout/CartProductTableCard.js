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
import { useQuery } from '@apollo/react-hooks';
import { Icon } from '@chakra-ui/react';
import { Button, Divider, List, Skeleton } from 'antd';
import gql from 'graphql-tag';
import React, { Fragment, useContext, useEffect } from 'react';
import ReactGA from 'react-ga';
import { AiOutlineClose } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import CartContext from '../../contexts/CartContext';
import { checkoutMessages } from '../../helpers/translation';
import { useMemberShop } from '../../hooks/checkout';
import EmptyAvatar from '../../images/avatar.svg';
import AdminCard from '../common/AdminCard';
import { CustomRatioImage } from '../common/Image';
import CartProductItem from './CartProductItem';
var CartProductTableCard = function (_a) {
    var shopId = _a.shopId, cartProductWithoutInventory = _a.cartProducts, withCartLink = _a.withCartLink, cardProps = __rest(_a, ["shopId", "cartProducts", "withCartLink"]);
    var formatMessage = useIntl().formatMessage;
    var removeCartProducts = useContext(CartContext).removeCartProducts;
    var _b = useProductInventory(cartProductWithoutInventory), loading = _b.loading, cartProducts = _b.cartProducts, refetch = _b.refetch;
    var memberShop = useMemberShop(shopId).memberShop;
    useEffect(function () {
        refetch && refetch();
    });
    if (loading) {
        return (React.createElement(AdminCard, __assign({}, cardProps),
            React.createElement(Skeleton, { active: true })));
    }
    return (React.createElement(AdminCard, __assign({}, cardProps),
        cartProducts.length === 0 && (React.createElement("div", { className: "d-flex align-items-center" },
            React.createElement("span", { className: "mr-2" }, formatMessage(checkoutMessages.content.cartNothing)),
            React.createElement(Link, { to: "/programs" }, formatMessage(checkoutMessages.link.cartExplore)))),
        memberShop && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "d-flex align-items-center" },
                React.createElement(CustomRatioImage, { width: "32px", ratio: 1, src: memberShop.pictureUrl || EmptyAvatar, shape: "circle", className: "mr-2" }),
                React.createElement("span", null, memberShop.title)),
            React.createElement(Divider, { className: "my-4" }))),
        React.createElement(List, { itemLayout: "horizontal", className: "mb-4" }, cartProducts.map(function (cartProduct) {
            var _a;
            return cartProduct.productId && (React.createElement(Fragment, { key: cartProduct.productId },
                React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
                    React.createElement(CartProductItem, { id: cartProduct.productId, quantity: (_a = cartProduct.options) === null || _a === void 0 ? void 0 : _a.quantity, buyableQuantity: cartProduct.buyableQuantity }),
                    React.createElement(Icon, { as: AiOutlineClose, className: "flex-shrink-0", onClick: function () {
                            var _a;
                            ReactGA.plugin.execute('ec', 'addProduct', {
                                id: cartProduct.productId,
                                quantity: "" + (((_a = cartProduct.options) === null || _a === void 0 ? void 0 : _a.quantity) || 1),
                            });
                            ReactGA.plugin.execute('ec', 'setAction', 'remove');
                            ReactGA.ga('send', 'event', 'UX', 'click', 'remove from cart');
                            removeCartProducts && removeCartProducts([cartProduct.productId]);
                        } })),
                React.createElement(Divider, { className: "my-4" })));
        })),
        withCartLink && (React.createElement("div", { className: "text-right mt-2" },
            React.createElement(Link, { to: "/cart?shopId=" + shopId },
                React.createElement(Button, { type: "primary", className: "px-5" }, formatMessage(checkoutMessages.button.cartSubmit)))))));
};
export default CartProductTableCard;
var useProductInventory = function (cartProducts) {
    var _a = useQuery(GET_PRODUCT_INVENTORY, {
        variables: {
            productIds: cartProducts.map(function (cartProduct) { return cartProduct.productId; }),
        },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var productInventories = loading || error || !data
        ? []
        : data.product_inventory_status.map(function (productInventory) { return ({
            productId: productInventory.product_id || '',
            buyableQuantity: productInventory.buyable_quantity,
        }); });
    return {
        loading: loading,
        error: error,
        cartProducts: cartProducts.map(function (cartProduct) { return (__assign(__assign(__assign({}, cartProduct), { buyableQuantity: null }), productInventories.find(function (cartProductsInventory) { return cartProduct.productId === cartProductsInventory.productId; }))); }),
        refetch: refetch,
    };
};
var GET_PRODUCT_INVENTORY = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_PRODUCT_INVENTORY($productIds: [String!]) {\n    product_inventory_status(where: { product_id: { _in: $productIds } }) {\n      product_id\n      buyable_quantity\n    }\n  }\n"], ["\n  query GET_PRODUCT_INVENTORY($productIds: [String!]) {\n    product_inventory_status(where: { product_id: { _in: $productIds } }) {\n      product_id\n      buyable_quantity\n    }\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=CartProductTableCard.js.map
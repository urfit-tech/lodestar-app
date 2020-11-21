import { Icon, Skeleton, Typography } from 'antd';
import { groupBy } from 'ramda';
import React, { useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { StringParam, useQueryParam } from 'use-query-params';
import { useAuth } from '../components/auth/AuthContext';
import CartProductTableCard from '../components/checkout/CartProductTableCard';
import CheckoutBlock from '../components/checkout/CheckoutBlock';
import DefaultLayout from '../components/layout/DefaultLayout';
import CartContext from '../contexts/CartContext';
import { checkoutMessages } from '../helpers/translation';
import { useMember } from '../hooks/member';
var CartPage = function () {
    var formatMessage = useIntl().formatMessage;
    var shopId = useQueryParam('shopId', StringParam)[0];
    var cartProducts = useContext(CartContext).cartProducts;
    var _a = useAuth(), isAuthenticating = _a.isAuthenticating, currentMemberId = _a.currentMemberId;
    var _b = useMember(currentMemberId || ''), loadingMember = _b.loadingMember, member = _b.member;
    var cartProductGroups = groupBy(function (cartProduct) { return cartProduct.shopId || ''; }, cartProducts);
    var shopIds = Object.keys(cartProductGroups);
    // "Scroll To Top" every cart router change if not top
    useEffect(function () {
        // DefaultLayout component ID : layout-content
        var layoutContent = document.getElementById('layout-content');
        if ((layoutContent === null || layoutContent === void 0 ? void 0 : layoutContent.scrollTop) !== 0) {
            layoutContent === null || layoutContent === void 0 ? void 0 : layoutContent.scrollTo(0, 0);
        }
    }, [shopId]);
    if (isAuthenticating || loadingMember) {
        return (React.createElement(DefaultLayout, null,
            React.createElement(Skeleton, { active: true })));
    }
    return (React.createElement(DefaultLayout, null,
        shopIds.length > 1 && typeof shopId === 'undefined' && (React.createElement("div", { className: "container py-5" },
            React.createElement(Typography.Title, { level: 3, className: "mb-4" },
                React.createElement(Icon, { type: "shopping-cart", className: "mr-2" }),
                React.createElement("span", null, formatMessage(checkoutMessages.title.chooseCart))),
            shopIds.map(function (shopId) { return (React.createElement(CartProductTableCard, { key: shopId, className: "mb-3", shopId: shopId, cartProducts: cartProductGroups[shopId], withCartLink: true })); }))),
        typeof shopId === 'string' && (React.createElement(CheckoutBlock, { member: member, shopId: shopId, cartProducts: cartProducts.filter(function (cartProduct) { return cartProduct.shopId === (shopId || ''); }) })),
        shopIds.length === 1 && React.createElement(CheckoutBlock, { member: member, shopId: shopIds[0] || '', cartProducts: cartProducts }),
        cartProducts.length === 0 && (React.createElement("div", { className: "container py-5" },
            React.createElement(Typography.Title, { level: 3, className: "mb-4" },
                React.createElement(Icon, { type: "shopping-cart", className: "mr-2" }),
                React.createElement("span", null, formatMessage(checkoutMessages.title.cart))),
            React.createElement(CartProductTableCard, { className: "mb-3", shopId: "", cartProducts: cartProducts })))));
};
export default CartPage;
//# sourceMappingURL=CartPage.js.map
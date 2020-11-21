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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { uniqBy } from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { useApp } from '../containers/common/AppContext';
var CartContext = React.createContext({
    cartProducts: [],
});
export var CartProvider = function (_a) {
    var children = _a.children;
    var appId = useApp().id;
    var apolloClient = useApolloClient();
    var currentMemberId = useAuth().currentMemberId;
    var updateCartProducts = useMutation(UPDATE_CART_PRODUCTS)[0];
    var _b = useState([]), cartProducts = _b[0], setCartProducts = _b[1];
    var getLocalCartProducts = function () {
        var cachedCartProducts;
        try {
            // remove deprecated localStorage key
            localStorage.removeItem('kolable.cart');
            localStorage.removeItem('kolable.cart.products');
            cachedCartProducts = JSON.parse(localStorage.getItem('kolable.cart._products') || '[]');
        }
        catch (error) {
            cachedCartProducts = [];
        }
        return cachedCartProducts;
    };
    // sync cart products: save to localStorage & update to remote
    var syncCartProducts = useCallback(function (isInit) {
        var cachedCartProducts = getLocalCartProducts();
        var cartProductOptions = {};
        cachedCartProducts.forEach(function (cartProduct) {
            cartProductOptions[cartProduct.productId] = cartProduct.options;
        });
        apolloClient
            .query({
            query: GET_CART_PRODUCT_COLLECTION,
            variables: {
                appId: appId,
                memberId: currentMemberId || '',
                productIds: isInit ? undefined : cachedCartProducts.map(function (cartProduct) { return cartProduct.productId; }),
                localProductIds: cachedCartProducts.map(function (cartProduct) { return cartProduct.productId; }),
                merchandiseSpecIds: cachedCartProducts
                    .filter(function (cartProduct) { return cartProduct.productId.startsWith('MerchandiseSpec_'); })
                    .map(function (cartProduct) { return cartProduct.productId.replace('MerchandiseSpec_', ''); }),
            },
            fetchPolicy: 'no-cache',
        })
            .then(function (_a) {
            var data = _a.data;
            var cartProducts = uniqBy(function (cartProduct) { return cartProduct.productId; }, __spreadArrays(data.cart_product.map(function (cartProduct) {
                var _a;
                return ({
                    productId: cartProduct.product.id,
                    shopId: cartProduct.product.id.startsWith('MerchandiseSpec_')
                        ? ((_a = data.merchandise_spec.find(function (v) { return v.id === cartProduct.product.id.replace('MerchandiseSpec_', ''); })) === null || _a === void 0 ? void 0 : _a.merchandise.member_shop_id) || ''
                        : '',
                    enrollments: cartProduct.product.product_enrollments.map(function (enrollment) { return ({
                        memberId: enrollment.member_id,
                        isPhysical: enrollment.is_physical,
                    }); }),
                    options: cartProductOptions[cartProduct.product.id],
                });
            }), cachedCartProducts.map(function (cartProduct) {
                var _a, _b;
                return (__assign(__assign({}, cartProduct), { shopId: cartProduct.productId.startsWith('MerchandiseSpec_')
                        ? ((_a = data.merchandise_spec.find(function (v) { return v.id === cartProduct.productId.replace('MerchandiseSpec_', ''); })) === null || _a === void 0 ? void 0 : _a.merchandise.member_shop_id) || ''
                        : '', enrollments: (_b = data.product
                        .find(function (product) { return product.id === cartProduct.productId; })) === null || _b === void 0 ? void 0 : _b.product_enrollments.map(function (enrollment) { return ({
                        memberId: enrollment.member_id,
                        isPhysical: enrollment.is_physical,
                    }); }) }));
            })));
            var filteredProducts = cartProducts.filter(function (cartProduct) {
                return cartProduct && cartProduct.enrollments
                    ? cartProduct.enrollments.length === 0 ||
                        cartProduct.enrollments.map(function (enrollment) { return enrollment.isPhysical; }).includes(true)
                    : false;
            });
            localStorage.setItem('kolable.cart._products', JSON.stringify(filteredProducts));
            setCartProducts(filteredProducts);
            if (!currentMemberId) {
                return;
            }
            updateCartProducts({
                variables: {
                    memberId: currentMemberId,
                    cartProductObjects: filteredProducts.map(function (product) { return ({
                        app_id: appId,
                        member_id: currentMemberId,
                        product_id: product.productId,
                    }); }),
                },
            }).catch(function () { });
        })
            .catch(function () { });
    }, [apolloClient, currentMemberId, updateCartProducts]);
    // init state
    useEffect(function () {
        syncCartProducts(true);
    }, [syncCartProducts]);
    return (React.createElement(CartContext.Provider, { value: {
            cartProducts: cartProducts,
            isProductInCart: function (productType, productTarget) {
                return cartProducts.some(function (cartProduct) { return cartProduct.productId === productType + "_" + productTarget; });
            },
            getCartProduct: function (productId) {
                var targetCartProduct = cartProducts.find(function (cartProduct) { return cartProduct.productId === productId; });
                return targetCartProduct || null;
            },
            addCartProduct: function (productType, productTarget, productOptions) { return __awaiter(void 0, void 0, void 0, function () {
                var cachedCartProducts, repeatedCartProduct, newCartProducts;
                var _a;
                return __generator(this, function (_b) {
                    cachedCartProducts = getLocalCartProducts();
                    repeatedCartProduct = cachedCartProducts.find(function (cartProduct) { return cartProduct.productId === productType + "_" + productTarget; });
                    newCartProducts = cachedCartProducts.filter(function (cartProduct) { return cartProduct.productId !== productType + "_" + productTarget; });
                    newCartProducts.push({
                        productId: productType + "_" + productTarget,
                        shopId: '',
                        options: productType === 'MerchandiseSpec'
                            ? {
                                quantity: ((productOptions === null || productOptions === void 0 ? void 0 : productOptions.quantity) || 1) + (((_a = repeatedCartProduct === null || repeatedCartProduct === void 0 ? void 0 : repeatedCartProduct.options) === null || _a === void 0 ? void 0 : _a.quantity) || 0),
                            }
                            : productOptions,
                    });
                    localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProducts));
                    syncCartProducts();
                    return [2 /*return*/];
                });
            }); },
            updatePluralCartProductQuantity: function (productId, quantity) { return __awaiter(void 0, void 0, void 0, function () {
                var cachedCartProducts, newCartProducts;
                return __generator(this, function (_a) {
                    cachedCartProducts = getLocalCartProducts();
                    newCartProducts = cachedCartProducts.map(function (cartProduct) {
                        return cartProduct.productId === productId
                            ? __assign(__assign({}, cartProduct), { options: __assign(__assign({}, cartProduct.options), { quantity: quantity }) }) : cartProduct;
                    });
                    localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProducts));
                    syncCartProducts();
                    return [2 /*return*/];
                });
            }); },
            removeCartProducts: function (productIds) { return __awaiter(void 0, void 0, void 0, function () {
                var cachedCartProducts, newCartProduct;
                return __generator(this, function (_a) {
                    cachedCartProducts = getLocalCartProducts();
                    newCartProduct = cachedCartProducts.filter(function (cartProduct) { return !productIds.includes(cartProduct.productId); });
                    localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProduct));
                    syncCartProducts();
                    return [2 /*return*/];
                });
            }); },
            clearCart: function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    localStorage.removeItem('kolable.cart._products');
                    setCartProducts([]);
                    currentMemberId && updateCartProducts({ variables: { memberId: currentMemberId, cartProductObjects: [] } });
                    return [2 /*return*/];
                });
            }); },
        } }, children));
};
var GET_CART_PRODUCT_COLLECTION = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_CART_PRODUCT_COLLECTION(\n    $appId: String!\n    $memberId: String!\n    $productIds: [String!]\n    $localProductIds: [String!]!\n    $merchandiseSpecIds: [uuid!]!\n  ) {\n    cart_product(\n      where: {\n        app_id: { _eq: $appId }\n        member_id: { _eq: $memberId }\n        product: { id: { _in: $productIds }, product_owner: { member: { app_id: { _eq: $appId } } } }\n      }\n    ) {\n      id\n      product {\n        id\n        type\n        product_owner {\n          member_id\n        }\n        product_enrollments(where: { member_id: { _eq: $memberId } }) {\n          member_id\n          is_physical\n        }\n      }\n    }\n    product(where: { id: { _in: $localProductIds } }) {\n      id\n      type\n      product_enrollments(where: { member_id: { _eq: $memberId } }) {\n        member_id\n        is_physical\n      }\n    }\n    merchandise_spec(where: { id: { _in: $merchandiseSpecIds } }) {\n      id\n      merchandise {\n        id\n        member_shop_id\n      }\n    }\n  }\n"], ["\n  query GET_CART_PRODUCT_COLLECTION(\n    $appId: String!\n    $memberId: String!\n    $productIds: [String!]\n    $localProductIds: [String!]!\n    $merchandiseSpecIds: [uuid!]!\n  ) {\n    cart_product(\n      where: {\n        app_id: { _eq: $appId }\n        member_id: { _eq: $memberId }\n        product: { id: { _in: $productIds }, product_owner: { member: { app_id: { _eq: $appId } } } }\n      }\n    ) {\n      id\n      product {\n        id\n        type\n        product_owner {\n          member_id\n        }\n        product_enrollments(where: { member_id: { _eq: $memberId } }) {\n          member_id\n          is_physical\n        }\n      }\n    }\n    product(where: { id: { _in: $localProductIds } }) {\n      id\n      type\n      product_enrollments(where: { member_id: { _eq: $memberId } }) {\n        member_id\n        is_physical\n      }\n    }\n    merchandise_spec(where: { id: { _in: $merchandiseSpecIds } }) {\n      id\n      merchandise {\n        id\n        member_shop_id\n      }\n    }\n  }\n"])));
var UPDATE_CART_PRODUCTS = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  mutation UPDATE_CART_PRODUCTS($memberId: String!, $cartProductObjects: [cart_product_insert_input!]!) {\n    delete_cart_product(where: { member_id: { _eq: $memberId } }) {\n      affected_rows\n    }\n    insert_cart_product(objects: $cartProductObjects) {\n      affected_rows\n    }\n  }\n"], ["\n  mutation UPDATE_CART_PRODUCTS($memberId: String!, $cartProductObjects: [cart_product_insert_input!]!) {\n    delete_cart_product(where: { member_id: { _eq: $memberId } }) {\n      affected_rows\n    }\n    insert_cart_product(objects: $cartProductObjects) {\n      affected_rows\n    }\n  }\n"])));
export default CartContext;
var templateObject_1, templateObject_2;
//# sourceMappingURL=CartContext.js.map
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
import { Icon } from '@chakra-ui/react';
import { message, Skeleton, Typography } from 'antd';
import { prop, sum } from 'ramda';
import React, { useContext, useRef, useState } from 'react';
import ReactPixel from 'react-facebook-pixel';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import CartProductTableCard from '../../components/checkout/CartProductTableCard';
import CheckoutCard from '../../components/checkout/CheckoutCard';
import DiscountSelectionCard from '../../components/checkout/DiscountSelectionCard';
import InvoiceInput, { validateInvoice } from '../../components/checkout/InvoiceInput';
import ShippingInput, { csvShippingMethods, validateShipping, } from '../../components/checkout/ShippingInput';
import AdminCard from '../../components/common/AdminCard';
import DefaultLayout from '../../components/layout/DefaultLayout';
import { useApp } from '../../containers/common/AppContext';
import CartContext from '../../contexts/CartContext';
import { checkoutMessages } from '../../helpers/translation';
import { useCheck, useMemberShop, usePhysicalProductCollection } from '../../hooks/checkout';
import { useUpdateMemberMetadata } from '../../hooks/member';
import { AuthModalContext } from '../auth/AuthModal';
var CheckoutBlock = function (_a) {
    var _b, _c;
    var member = _a.member, shopId = _a.shopId, cartProducts = _a.cartProducts;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _d = useAuth(), isAuthenticating = _d.isAuthenticating, isAuthenticated = _d.isAuthenticated;
    var settings = useApp().settings;
    var setVisible = useContext(AuthModalContext).setVisible;
    var removeCartProducts = useContext(CartContext).removeCartProducts;
    var memberShop = useMemberShop(shopId).memberShop;
    var updateMemberMetadata = useUpdateMemberMetadata();
    var cartProductIds = cartProducts.map(function (v) { return v.productId.split('_')[1]; });
    var hasPhysicalProduct = usePhysicalProductCollection(cartProductIds).hasPhysicalProduct;
    // payment information
    var cachedPaymentInfor = {
        shipping: {
            name: '',
            phone: '',
            address: '',
            shippingMethod: 'home-delivery',
            specification: '',
            storeId: '',
            storeName: '',
        },
        invoice: {
            name: '',
            phone: '',
            email: (member === null || member === void 0 ? void 0 : member.email) || '',
        },
    };
    try {
        var cachedShipping = localStorage.getItem('kolable.cart.shipping');
        var cachedInvoice = localStorage.getItem('kolable.cart.invoice');
        cachedPaymentInfor.shipping = cachedShipping
            ? JSON.parse(cachedShipping)
            : __assign(__assign({}, cachedPaymentInfor.shipping), (_b = member === null || member === void 0 ? void 0 : member.metadata) === null || _b === void 0 ? void 0 : _b.shipping);
        cachedPaymentInfor.invoice = cachedInvoice
            ? JSON.parse(cachedInvoice).value
            : __assign(__assign({}, cachedPaymentInfor.invoice), (_c = member === null || member === void 0 ? void 0 : member.metadata) === null || _c === void 0 ? void 0 : _c.invoice);
    }
    catch (_e) { }
    var shippingRef = useRef(null);
    var invoiceRef = useRef(null);
    var _f = useState(cachedPaymentInfor.shipping), shipping = _f[0], setShipping = _f[1];
    var _g = useState(cachedPaymentInfor.invoice), invoice = _g[0], setInvoice = _g[1];
    var _h = useState(false), isValidating = _h[0], setIsValidating = _h[1];
    // checkout
    var _j = useState(null), discountId = _j[0], setDiscountId = _j[1];
    var cartProductOptions = cartProducts.reduce(function (accumulator, currentValue) {
        var newOptions = __assign({}, accumulator);
        newOptions[currentValue.productId] = currentValue.options;
        return newOptions;
    }, {});
    var _k = useCheck(cartProducts.map(function (cartProduct) { return cartProduct.productId; }), discountId, hasPhysicalProduct ? shipping : null, cartProductOptions), check = _k.check, orderChecking = _k.orderChecking, placeOrder = _k.placeOrder, orderPlacing = _k.orderPlacing;
    if (isAuthenticating) {
        return (React.createElement(DefaultLayout, null,
            React.createElement(Skeleton, { active: true })));
    }
    var handleCheckout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isValidShipping, isValidInvoice, taskId, _a, _b;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!isAuthenticated) {
                        setVisible && setVisible(true);
                        return [2 /*return*/];
                    }
                    if (discountId && discountId !== 'None' && !discountId.split('_')[1]) {
                        message.error(formatMessage(checkoutMessages.message.noCoupon));
                        return [2 /*return*/];
                    }
                    !isValidating && setIsValidating(true);
                    isValidShipping = !hasPhysicalProduct || validateShipping(shipping);
                    isValidInvoice = validateInvoice(invoice).length === 0;
                    if (hasPhysicalProduct &&
                        memberShop &&
                        memberShop.shippingMethods.find(function (shippingMethod) { return shippingMethod.id === shipping.shippingMethod; }) === undefined) {
                        (_c = shippingRef.current) === null || _c === void 0 ? void 0 : _c.scrollIntoView({ behavior: 'smooth' });
                        return [2 /*return*/];
                    }
                    if (csvShippingMethods.find(function (shippingMethod) { return shippingMethod === shipping.shippingMethod; }) &&
                        shipping.storeId === '') {
                        (_d = shippingRef.current) === null || _d === void 0 ? void 0 : _d.scrollIntoView({ behavior: 'smooth' });
                        return [2 /*return*/];
                    }
                    if (!isValidShipping) {
                        (_e = shippingRef.current) === null || _e === void 0 ? void 0 : _e.scrollIntoView({ behavior: 'smooth' });
                        return [2 /*return*/];
                    }
                    else if (!isValidInvoice) {
                        (_f = invoiceRef.current) === null || _f === void 0 ? void 0 : _f.scrollIntoView({ behavior: 'smooth' });
                        return [2 /*return*/];
                    }
                    // tracking add payment info event
                    settings['tracking.fb_pixel_id'] &&
                        ReactPixel.track('AddPaymentInfo', {
                            value: check ? sum(check.orderProducts.map(prop('price'))) - sum(check.orderDiscounts.map(prop('price'))) : 0,
                            currency: 'TWD',
                        });
                    return [4 /*yield*/, placeOrder('perpetual', invoice)];
                case 1:
                    taskId = _g.sent();
                    _a = member;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateMemberMetadata({
                            variables: {
                                memberId: member.id,
                                metadata: __assign(__assign({}, member.metadata), { invoice: invoice, shipping: hasPhysicalProduct ? shipping : undefined }),
                            },
                        })];
                case 2:
                    _a = (_g.sent());
                    _g.label = 3;
                case 3:
                    _a;
                    _b = removeCartProducts;
                    if (!_b) return [3 /*break*/, 5];
                    return [4 /*yield*/, removeCartProducts(cartProducts.map(function (cartProduct) { return cartProduct.productId; }))];
                case 4:
                    _b = (_g.sent());
                    _g.label = 5;
                case 5:
                    _b;
                    history.push("/tasks/order/" + taskId);
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "container py-5" },
        React.createElement(Typography.Title, { level: 3, className: "mb-4" },
            React.createElement(Icon, { as: AiOutlineShoppingCart }),
            React.createElement("span", { className: "ml-2" }, formatMessage(checkoutMessages.title.cart))),
        React.createElement(CartProductTableCard, { className: "mb-3", shopId: shopId, cartProducts: cartProducts }),
        hasPhysicalProduct && (React.createElement("div", { ref: shippingRef, className: "mb-3" },
            React.createElement(AdminCard, null,
                React.createElement(ShippingInput, { value: shipping, shippingMethods: memberShop === null || memberShop === void 0 ? void 0 : memberShop.shippingMethods, onChange: function (value) { return setShipping(value); }, isValidating: isValidating })))),
        React.createElement("div", { ref: invoiceRef, className: "mb-3" },
            React.createElement(AdminCard, null,
                React.createElement(InvoiceInput, { value: invoice, onChange: function (value) { return setInvoice(value); }, isValidating: isValidating, shouldSameToShippingCheckboxDisplay: hasPhysicalProduct }))),
        cartProducts.length !== 0 && (React.createElement(AdminCard, { className: "mb-3" },
            React.createElement(DiscountSelectionCard, { check: check, value: discountId, onChange: setDiscountId }))),
        React.createElement("div", { className: "mb-3" },
            React.createElement(CheckoutCard, { check: check, cartProducts: cartProducts, discountId: discountId, invoice: invoice, shipping: hasPhysicalProduct ? shipping : null, loading: orderChecking || orderPlacing, onCheckout: handleCheckout }))));
};
export default CheckoutBlock;
//# sourceMappingURL=CheckoutBlock.js.map
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
import { Button, message } from 'antd';
import React, { useContext } from 'react';
import ReactGA from 'react-ga';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import CheckoutProductModal from '../../containers/checkout/CheckoutProductModal';
import CartContext from '../../contexts/CartContext';
import { commonMessages } from '../../helpers/translation';
import { useMember } from '../../hooks/member';
import CartIcon from '../../images/cart.svg';
import { useAuth } from '../auth/AuthContext';
import { AuthModalContext } from '../auth/AuthModal';
var MerchandisePaymentButton = function (_a) {
    var merchandise = _a.merchandise, merchandiseSpec = _a.merchandiseSpec, quantity = _a.quantity;
    var formatMessage = useIntl().formatMessage;
    if (merchandise.startedAt && Date.now() < merchandise.startedAt.getTime()) {
        return (React.createElement(Button, { block: true, disabled: true }, formatMessage(commonMessages.button.unreleased)));
    }
    if (merchandise.endedAt && merchandise.endedAt.getTime() < Date.now()) {
        return (React.createElement(Button, { block: true, disabled: true }, formatMessage(commonMessages.button.soldOut)));
    }
    return merchandise.isCustomized ? (React.createElement(React.Fragment, null, merchandise.specs.map(function (spec) {
        return spec.id === merchandiseSpec.id ? (React.createElement(CustomizedMerchandisePaymentBlock, { key: spec.id, merchandise: merchandise, merchandiseSpec: merchandiseSpec })) : null;
    }))) : (React.createElement(GeneralMerchandisePaymentBlock, { merchandise: merchandise, merchandiseSpec: merchandiseSpec, quantity: quantity }));
};
var GeneralMerchandisePaymentBlock = function (_a) {
    var _b, _c;
    var merchandise = _a.merchandise, merchandiseSpec = _a.merchandiseSpec, quantity = _a.quantity;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _d = useContext(CartContext), getCartProduct = _d.getCartProduct, addCartProduct = _d.addCartProduct;
    if (!addCartProduct) {
        return null;
    }
    var inCartQuantity = ((_c = (_b = getCartProduct === null || getCartProduct === void 0 ? void 0 : getCartProduct("MerchandiseSpec_" + merchandiseSpec.id)) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.quantity) || 0;
    var remainQuantity = (merchandiseSpec.buyableQuantity || 0) - inCartQuantity;
    if (!merchandise.isPhysical && inCartQuantity) {
        return (React.createElement(Button, { type: "primary", block: true, onClick: function () { return history.push('/cart'); } }, formatMessage(commonMessages.button.cart)));
    }
    var handleClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addCartProduct('MerchandiseSpec', merchandiseSpec.id, { quantity: merchandise.isPhysical ? quantity : 1 })];
                case 1:
                    _a.sent();
                    ReactGA.plugin.execute('ec', 'addProduct', {
                        id: merchandiseSpec.id,
                        name: merchandise.title + " - " + merchandiseSpec.title,
                        category: 'MerchandiseSpec',
                        price: "" + merchandiseSpec.listPrice,
                        quantity: "" + (merchandise.isPhysical ? quantity : 1),
                        currency: 'TWD',
                    });
                    ReactGA.plugin.execute('ec', 'setAction', 'add');
                    ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart');
                    message.success(formatMessage(commonMessages.text.addToCartSuccessfully));
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "d-flex" },
        React.createElement("div", { className: "flex-shrink-0" },
            React.createElement(Button, { className: "d-flex align-items-center mr-2", disabled: merchandise.isLimited && (quantity === 0 || quantity > remainQuantity), onClick: function () { return quantity && handleClick(); } },
                React.createElement(Icon, { src: CartIcon }))),
        React.createElement("div", { className: "flex-grow-1" },
            React.createElement(Button, { type: "primary", block: true, disabled: merchandise.isLimited && (quantity === 0 || quantity > remainQuantity), onClick: function () { return quantity && handleClick().then(function () { return history.push('/cart'); }); } }, formatMessage(commonMessages.button.purchase)))));
};
var CustomizedMerchandisePaymentBlock = function (_a) {
    var _b;
    var merchandise = _a.merchandise, merchandiseSpec = _a.merchandiseSpec;
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var setAuthModal = useContext(AuthModalContext).setVisible;
    var member = useMember(currentMemberId || '').member;
    if (merchandise.isLimited && !merchandiseSpec.buyableQuantity) {
        return (React.createElement(Button, { block: true, disabled: true }, formatMessage(commonMessages.button.soldOut)));
    }
    return (React.createElement(CheckoutProductModal, { renderTrigger: function (_a) {
            var setVisible = _a.setVisible;
            return (React.createElement(Button, { type: "primary", block: true, onClick: function () { return (!currentMemberId ? setAuthModal === null || setAuthModal === void 0 ? void 0 : setAuthModal(true) : setVisible()); } }, formatMessage(commonMessages.button.purchase)));
        }, paymentType: "perpetual", defaultProductId: "MerchandiseSpec_" + merchandiseSpec.id, isProductPhysical: merchandise.isPhysical, member: member, shippingMethods: (_b = merchandise.memberShop) === null || _b === void 0 ? void 0 : _b.shippingMethods }));
};
export default MerchandisePaymentButton;
//# sourceMappingURL=MerchandisePaymentButton.js.map
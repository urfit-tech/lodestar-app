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
import { Icon } from '@chakra-ui/react';
import { Button } from 'antd';
import React, { useContext } from 'react';
import ReactGA from 'react-ga';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import CartContext from '../../contexts/CartContext';
import { commonMessages } from '../../helpers/translation';
var StyleButton = styled(Button)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  span {\n    display: none;\n  }\n\n  ", "\n"], ["\n  span {\n    display: none;\n  }\n\n  ",
    "\n"])), function (props) {
    return props.variant === 'multiline' && css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      order: 1;\n      margin-top: 0.75rem;\n\n      span {\n        display: inline;\n      }\n    "], ["\n      order: 1;\n      margin-top: 0.75rem;\n\n      span {\n        display: inline;\n      }\n    "])));
});
var ProgramPaymentButton = function (_a) {
    var program = _a.program, cartButtonProps = _a.cartButtonProps, orderButtonProps = _a.orderButtonProps, variant = _a.variant;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _b = useContext(CartContext), addCartProduct = _b.addCartProduct, isProductInCart = _b.isProductInCart;
    var sharingCode = useQueryParam('sharing', StringParam)[0];
    var onClickAddCartProduct = function () {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = addCartProduct;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, addCartProduct('Program', program.id, {
                                from: window.location.pathname,
                                sharingCode: sharingCode,
                            })];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        ReactGA.plugin.execute('ec', 'addProduct', {
                            id: program.id,
                            name: program.title,
                            category: 'Program',
                            price: "" + program.listPrice,
                            quantity: '1',
                            currency: 'TWD',
                        });
                        ReactGA.plugin.execute('ec', 'setAction', 'add');
                        ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart');
                        resolve();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        reject(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    return program.isSoldOut ? (React.createElement(Button, { block: true, disabled: true }, formatMessage(commonMessages.button.soldOut))) : isProductInCart && isProductInCart('Program', program.id) ? (React.createElement(Button, { block: true, type: "primary", onClick: function () { return history.push("/cart"); } }, formatMessage(commonMessages.button.cart))) : (React.createElement("div", { className: variant === 'multiline' ? 'd-flex flex-column' : 'd-flex' },
        program.listPrice !== 0 && (React.createElement(StyleButton, __assign({ onClick: function () { return onClickAddCartProduct(); }, className: "mr-2", block: variant === 'multiline', variant: variant }, cartButtonProps),
            React.createElement(Icon, { as: AiOutlineShoppingCart }),
            React.createElement("span", { className: "ml-2" }, formatMessage(commonMessages.button.addCart)))),
        React.createElement(Button, __assign({ type: "primary", block: true, onClick: function () { return onClickAddCartProduct().then(function () { return history.push('/cart'); }); } }, orderButtonProps), program.listPrice !== 0
            ? formatMessage(commonMessages.button.purchase)
            : formatMessage(commonMessages.button.join))));
};
export default ProgramPaymentButton;
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProgramPaymentButton.js.map
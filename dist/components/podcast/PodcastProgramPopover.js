var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
import { Button, Popover } from 'antd';
import React, { useContext } from 'react';
import ReactGA from 'react-ga';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import CartContext from '../../contexts/CartContext';
import { durationFullFormatter } from '../../helpers';
import { commonMessages } from '../../helpers/translation';
import { usePodcastPlanIds } from '../../hooks/podcast';
import MicrophoneIcon from '../../images/microphone.svg';
import { AvatarImage } from '../common/Image';
import Responsive, { BREAK_POINT } from '../common/Responsive';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1.25rem;\n  width: 100vw;\n  max-width: 272px;\n  max-height: 70vh;\n  overflow: auto;\n  background-color: white;\n  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);\n\n  @media (min-width: ", "px) {\n    max-width: 320px;\n  }\n"], ["\n  padding: 1.25rem;\n  width: 100vw;\n  max-width: 272px;\n  max-height: 70vh;\n  overflow: auto;\n  background-color: white;\n  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);\n\n  @media (min-width: ", "px) {\n    max-width: 320px;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledMeta = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  margin-bottom: 0.75rem;\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledCategory = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: ", ";\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  margin-bottom: 0.75rem;\n  color: ", ";\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledDescription = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  margin-bottom: 0.75rem;\n  color: var(--gray-darker);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var PodcastProgramPopover = function (_a) {
    var podcastProgramId = _a.podcastProgramId, title = _a.title, duration = _a.duration, durationSecond = _a.durationSecond, listPrice = _a.listPrice, salePrice = _a.salePrice, description = _a.description, categories = _a.categories, instructor = _a.instructor, isEnrolled = _a.isEnrolled, isSubscribed = _a.isSubscribed, onSubscribe = _a.onSubscribe, children = _a.children;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _b = useContext(CartContext), addCartProduct = _b.addCartProduct, isProductInCart = _b.isProductInCart;
    var podcastPlanIds = usePodcastPlanIds((instructor === null || instructor === void 0 ? void 0 : instructor.id) || '').podcastPlanIds;
    var withPodcastPlan = podcastPlanIds.length > 0;
    var onClickAddCartProduct = function () {
        return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = addCartProduct;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, addCartProduct('PodcastProgram', podcastProgramId)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        ReactGA.plugin.execute('ec', 'addProduct', {
                            id: podcastProgramId,
                            name: title,
                            category: 'PodcastProgram',
                            price: "" + listPrice,
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
    var content = (React.createElement(StyledWrapper, null,
        React.createElement(StyledTitle, null, title),
        React.createElement(StyledMeta, null,
            React.createElement(Icon, { src: MicrophoneIcon, className: "mr-2" }),
            React.createElement("span", null, durationFullFormatter(durationSecond))),
        React.createElement(StyledDescription, null, description),
        React.createElement(StyledCategory, { className: "mb-4" }, categories.map(function (category) { return (React.createElement("span", { key: category.id, className: "mr-2" },
            "#",
            category.name)); })),
        React.createElement("div", { className: "d-flex align-items-center justify-content-between mb-3" },
            instructor && (React.createElement(Link, { to: "/creators/" + instructor.id + "?tabkey=podcasts", className: "d-flex align-items-center" },
                React.createElement(AvatarImage, { className: "mr-2", src: instructor.avatarUrl, size: 36 }),
                React.createElement(StyledMeta, { className: "m-0" }, instructor.name))),
            React.createElement("div", { className: "flex-grow-1 text-right" }, withPodcastPlan && !isSubscribed && (React.createElement(Button, { type: "link", icon: "plus", size: "small", onClick: function () { return onSubscribe && onSubscribe(); } }, formatMessage(commonMessages.title.podcastSubscription))))),
        React.createElement("div", null, isEnrolled ? (React.createElement(Link, { to: "/podcasts/" + podcastProgramId },
            React.createElement(Button, { block: true }, formatMessage(commonMessages.button.enterPodcast)))) : isProductInCart && isProductInCart('PodcastProgram', podcastProgramId) ? (React.createElement(Button, { type: "primary", onClick: function () { return history.push("/cart"); }, block: true }, formatMessage(commonMessages.button.cart))) : (React.createElement(React.Fragment, null,
            React.createElement(Button, { type: "primary", className: "mb-2", block: true, onClick: function () {
                    onClickAddCartProduct().then(function () { return history.push("/cart"); });
                } }, formatMessage(commonMessages.button.purchase)),
            React.createElement(Button, { onClick: function () {
                    onClickAddCartProduct();
                }, block: true }, formatMessage(commonMessages.button.addCart)))))));
    return (React.createElement(React.Fragment, null,
        React.createElement(Responsive.Default, null,
            React.createElement(Popover, { placement: "bottomRight", trigger: "click", content: content },
                React.createElement("div", { className: "cursor-pointer" }, children))),
        React.createElement(Responsive.Desktop, null,
            React.createElement(Popover, { placement: "right", trigger: "click", content: content },
                React.createElement("div", { className: "cursor-pointer" }, children)))));
};
export default PodcastProgramPopover;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=PodcastProgramPopover.js.map
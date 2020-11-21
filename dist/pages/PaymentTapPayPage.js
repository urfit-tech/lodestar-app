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
import { Button, message } from 'antd';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../components/auth/AuthContext';
import DefaultLayout from '../components/layout/DefaultLayout';
import { StyledContainer } from '../components/layout/DefaultLayout.styled';
import CreditCardSelector from '../components/payment/CreditCardSelector';
import TapPayForm from '../components/payment/TapPayForm';
import { codeMessages } from '../helpers/translation';
import { useTappay } from '../hooks/util';
var StyledFreeSubscriptionNotice = styled.p(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 12px;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  margin-top: 24px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 12px;\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  margin-top: 24px;\n"])));
var messages = defineMessages({
    freeSubscriptionNotice: {
        id: 'common.label.freeSubscriptionNotice',
        defaultMessage: '訂閱金額為 NT$ 0 時，系統需紀錄您的信用卡卡號，並於下期進行扣款',
    },
});
/* choose the credit card from the member to subscribe
1. get the credit cards from the member
2. allow member to add a new credit card
3. member choose the credit card and pay the payment
*/
var PaymentTapPayPage = function () {
    return (React.createElement(DefaultLayout, { noFooter: true, noHeader: true, centeredBox: true }, window['TPDirect'] && React.createElement(PaymentTapPayBlock, null)));
};
var PaymentTapPayBlock = function () {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var paymentNo = useParams().paymentNo;
    var _a = useState(null), tpCreditCard = _a[0], setTpCreditCard = _a[1];
    var _b = useState(null), memberCreditCardId = _b[0], setMemberCreditCardId = _b[1];
    var currentMemberId = useAuth().currentMemberId;
    var _c = usePayment(parseInt(paymentNo)), paying = _c.paying, payPayment = _c.payPayment, addCreditCard = _c.addCreditCard;
    var isCreditCardReady = Boolean(memberCreditCardId || (tpCreditCard && tpCreditCard.canGetPrime));
    var handlePaymentPay = function () {
        ;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var _memberCreditCardId, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _memberCreditCardId = memberCreditCardId;
                        if (!!_memberCreditCardId) return [3 /*break*/, 2];
                        return [4 /*yield*/, addCreditCard({
                                phoneNumber: '0987654321',
                                name: 'test',
                                email: 'test@gmail.com',
                            })];
                    case 1:
                        _memberCreditCardId = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, payPayment(parseInt(paymentNo), _memberCreditCardId)];
                    case 3:
                        _a.sent();
                        history.push("/members/" + currentMemberId);
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        message.error(err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); })();
    };
    return (React.createElement(StyledContainer, null, currentMemberId ? (React.createElement("div", null,
        React.createElement(CreditCardSelector, { memberId: currentMemberId, value: memberCreditCardId, onChange: setMemberCreditCardId }),
        React.createElement("div", { className: (memberCreditCardId ? 'd-none' : '') + " ml-4" },
            React.createElement(TapPayForm, { onUpdate: setTpCreditCard })),
        React.createElement(Button, { block: true, type: "primary", loading: paying, disabled: !isCreditCardReady, onClick: handlePaymentPay }, "\u4ED8\u6B3E"),
        React.createElement(StyledFreeSubscriptionNotice, null, formatMessage(messages.freeSubscriptionNotice)))) : (React.createElement("div", null, "\u7121\u6CD5\u53D6\u5F97\u6703\u54E1\u8CC7\u6599"))));
};
var usePayment = function (paymentNo) {
    var TPDirect = useTappay().TPDirect;
    var formatMessage = useIntl().formatMessage;
    var _a = useAuth(), authToken = _a.authToken, backendEndpoint = _a.backendEndpoint;
    var _b = useState(false), paying = _b[0], setPaying = _b[1];
    var payPayment = useCallback(function (paymentNo, memberCreditCardId) {
        return new Promise(function (resolve, reject) {
            if (!authToken) {
                reject('no auth');
            }
            setPaying(true);
            axios
                .post(backendEndpoint + "/payment/pay/" + paymentNo, {
                memberCreditCardId: memberCreditCardId,
            }, {
                headers: { authorization: "Bearer " + authToken },
            })
                .then(function (_a) {
                var _b = _a.data, code = _b.code, result = _b.result;
                var codeMessage = codeMessages[code];
                if (code === 'SUCCESS') {
                    resolve(result);
                }
                else if (codeMessage) {
                    reject(formatMessage(codeMessage));
                }
                else {
                    reject(code);
                }
            })
                .catch(reject)
                .finally(function () { return setPaying(false); });
        });
    }, [authToken, backendEndpoint, formatMessage]);
    var addCreditCard = function (cardHolder) { return __awaiter(void 0, void 0, void 0, function () {
        var memberCreditCardId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        TPDirect.card.getPrime(function (result) {
                            if (result.status !== 0) {
                                console.error('getPrime error');
                            }
                            axios({
                                method: 'POST',
                                url: backendEndpoint + "/payment/credit-cards",
                                withCredentials: true,
                                data: { prime: result.card.prime, cardHolder: cardHolder },
                                headers: { authorization: "Bearer " + authToken },
                            })
                                .then(function (_a) {
                                var _b = _a.data, code = _b.code, result = _b.result;
                                if (code === 'SUCCESS') {
                                    resolve(result.memberCreditCardId);
                                }
                                else {
                                    reject(code);
                                }
                            })
                                .catch(reject);
                        });
                    })];
                case 1:
                    memberCreditCardId = _a.sent();
                    return [2 /*return*/, memberCreditCardId];
            }
        });
    }); };
    return { paying: paying, payPayment: payPayment, addCreditCard: addCreditCard };
};
export default PaymentTapPayPage;
var templateObject_1;
//# sourceMappingURL=PaymentTapPayPage.js.map
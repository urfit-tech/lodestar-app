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
import { Button, Modal } from 'antd';
import { sum } from 'ramda';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { handleError } from '../../helpers';
import { commonMessages, productMessages } from '../../helpers/translation';
import { useCheck } from '../../hooks/checkout';
import { useEnrolledProgramIds, useProgram } from '../../hooks/program';
import EmptyCover from '../../images/empty-cover.png';
import { useAuth } from '../auth/AuthContext';
import { CustomRatioImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
var StyledBody = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 2rem;\n"], ["\n  padding: 2rem;\n"])));
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: box;\n  box-orient: vertical;\n  line-clamp: 2;\n  max-height: 3rem;\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  line-height: 1.5rem;\n  text-overflow: ellipsis;\n"], ["\n  display: box;\n  box-orient: vertical;\n  line-clamp: 2;\n  max-height: 3rem;\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  line-height: 1.5rem;\n  text-overflow: ellipsis;\n"])));
var StyledPeriod = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n"], ["\n  color: ", ";\n  font-size: 14px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledCurrency = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n"])));
var ProgramCoinModal = function (_a) {
    var renderTrigger = _a.renderTrigger, programId = _a.programId, periodAmount = _a.periodAmount, periodType = _a.periodType, props = __rest(_a, ["renderTrigger", "programId", "periodAmount", "periodType"]);
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _b = useAuth(), currentMember = _b.currentMember, currentMemberId = _b.currentMemberId;
    var program = useProgram(programId).program;
    var _c = useState(false), visible = _c[0], setVisible = _c[1];
    var enrolledProgramIds = useEnrolledProgramIds(currentMemberId || '').enrolledProgramIds;
    var isEnrolled = enrolledProgramIds.includes(programId);
    var targetProgramPlan = program === null || program === void 0 ? void 0 : program.plans.find(function (programPlan) { return programPlan.periodAmount === periodAmount && programPlan.periodType === periodType; });
    var _d = useCheck(targetProgramPlan ? ["ProgramPlan_" + targetProgramPlan.id] : [], 'Coin', null, {}), orderChecking = _d.orderChecking, check = _d.check, placeOrder = _d.placeOrder, orderPlacing = _d.orderPlacing;
    var isPaymentAvailable = !orderChecking &&
        sum(check.orderProducts.map(function (orderProduct) { return orderProduct.price; })) ===
            sum(check.orderDiscounts.map(function (orderDiscount) { return orderDiscount.price; }));
    var handlePay = function () {
        placeOrder('perpetual', {
            name: (currentMember === null || currentMember === void 0 ? void 0 : currentMember.name) || (currentMember === null || currentMember === void 0 ? void 0 : currentMember.username) || '',
            phone: '',
            email: (currentMember === null || currentMember === void 0 ? void 0 : currentMember.email) || '',
        })
            .then(function (taskId) {
            history.push("/tasks/order/" + taskId);
        })
            .catch(handleError);
    };
    return (React.createElement(React.Fragment, null,
        renderTrigger && renderTrigger({ setVisible: setVisible }),
        React.createElement(Modal, __assign({ width: "24rem", footer: null, centered: true, destroyOnClose: true, visible: visible, bodyStyle: { padding: 0 }, onCancel: function () { return setVisible(false); } }, props),
            React.createElement(CustomRatioImage, { width: "100%", ratio: 9 / 16, src: (program === null || program === void 0 ? void 0 : program.coverUrl) || EmptyCover }),
            React.createElement(StyledBody, null,
                React.createElement(StyledTitle, { className: "mb-3" }, program === null || program === void 0 ? void 0 : program.title),
                React.createElement("div", { className: "d-flex align-items-center justify-content-between mb-4" },
                    React.createElement(StyledPeriod, null, formatMessage(productMessages.programPackage.label.availableForLimitTime, {
                        amount: periodAmount,
                        unit: periodType === 'D'
                            ? formatMessage(commonMessages.unit.day)
                            : periodType === 'W'
                                ? formatMessage(commonMessages.unit.week)
                                : periodType === 'M'
                                    ? formatMessage(commonMessages.unit.monthWithQuantifier)
                                    : periodType === 'Y'
                                        ? formatMessage(commonMessages.unit.year)
                                        : formatMessage(commonMessages.unit.unknown),
                    })),
                    (targetProgramPlan === null || targetProgramPlan === void 0 ? void 0 : targetProgramPlan.listPrice) && (React.createElement(StyledCurrency, null,
                        React.createElement(PriceLabel, { listPrice: targetProgramPlan.listPrice, currencyId: targetProgramPlan.currency.id })))),
                React.createElement(Button, { type: "primary", block: true, disabled: orderChecking || !isPaymentAvailable || isEnrolled, loading: orderChecking || orderPlacing, onClick: handlePay }, isEnrolled ? '已使用代幣兌換' : formatMessage(commonMessages.button.useCoin))))));
};
export default ProgramCoinModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=ProgramCoinModal.js.map
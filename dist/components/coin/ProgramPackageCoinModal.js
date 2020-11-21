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
import { Button, Divider, Modal } from 'antd';
import gql from 'graphql-tag';
import { sum } from 'ramda';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { handleError } from '../../helpers';
import { commonMessages, productMessages } from '../../helpers/translation';
import { useCheck } from '../../hooks/checkout';
import { useEnrolledProgramIds } from '../../hooks/program';
import EmptyCover from '../../images/empty-cover.png';
import { useAuth } from '../auth/AuthContext';
import { CustomRatioImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
var messages = defineMessages({
    programPackageContent: { id: 'project.label.programPackageContent', defaultMessage: '課程內容' },
});
var StyledTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: box;\n  box-orient: vertical;\n  line-clamp: 2;\n  max-height: 3rem;\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  line-height: 1.5rem;\n  text-overflow: ellipsis;\n"], ["\n  display: box;\n  box-orient: vertical;\n  line-clamp: 2;\n  max-height: 3rem;\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  line-height: 1.5rem;\n  text-overflow: ellipsis;\n"])));
var StyledPlanTitle = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  line-height: 1.5rem;\n  text-overflow: ellipsis;\n"], ["\n  color: var(--gray-darker);\n  line-height: 1.5rem;\n  text-overflow: ellipsis;\n"])));
var StyledCurrency = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-weight: bold;\n"], ["\n  color: var(--gray-darker);\n  font-weight: bold;\n"])));
var StyledProgramCollection = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  height: 20rem;\n  overflow: auto;\n"], ["\n  height: 20rem;\n  overflow: auto;\n"])));
var StyledSubTitle = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 14px;\n  font-weight: bold;\n  color: var(--gray-darker);\n"], ["\n  font-size: 14px;\n  font-weight: bold;\n  color: var(--gray-darker);\n"])));
var StyledPeriod = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 14px;\n"], ["\n  color: ", ";\n  font-size: 14px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledProgramTitle = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  display: box;\n  box-orient: vertical;\n  line-clamp: 2;\n  max-height: 3rem;\n  overflow: hidden;\n  color: var(--gray-darker);\n  line-height: 1.5rem;\n  text-overflow: ellipsis;\n  opacity: ", ";\n"], ["\n  display: box;\n  box-orient: vertical;\n  line-clamp: 2;\n  max-height: 3rem;\n  overflow: hidden;\n  color: var(--gray-darker);\n  line-height: 1.5rem;\n  text-overflow: ellipsis;\n  opacity: ", ";\n"])), function (props) { return props.disabled && 0.4; });
var ProgramPackageCoinModal = function (_a) {
    var _b, _c, _d;
    var renderTrigger = _a.renderTrigger, programPackageId = _a.programPackageId, periodAmount = _a.periodAmount, periodType = _a.periodType, props = __rest(_a, ["renderTrigger", "programPackageId", "periodAmount", "periodType"]);
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _e = useAuth(), currentMember = _e.currentMember, currentMemberId = _e.currentMemberId;
    var programPackage = useProgramPackageProgramCollection(programPackageId, periodAmount, periodType).programPackage;
    var _f = useState(false), visible = _f[0], setVisible = _f[1];
    var enrolledProgramIds = useEnrolledProgramIds(currentMemberId || '').enrolledProgramIds;
    var _g = useCheck((programPackage === null || programPackage === void 0 ? void 0 : programPackage.programs.filter(function (program) { return program.plan && !enrolledProgramIds.includes(program.id); }).map(function (program) { var _a; return "ProgramPlan_" + ((_a = program.plan) === null || _a === void 0 ? void 0 : _a.id); })) || [], 'Coin', null, (programPackage === null || programPackage === void 0 ? void 0 : programPackage.programs.reduce(function (accumulator, currentValue) {
        var _a;
        if (!currentValue.plan) {
            return accumulator;
        }
        return __assign(__assign({}, accumulator), (_a = {}, _a["ProgramPlan_" + currentValue.plan.id] = {
            position: currentValue.position,
        }, _a));
    }, {})) || {}), orderChecking = _g.orderChecking, check = _g.check, placeOrder = _g.placeOrder, orderPlacing = _g.orderPlacing;
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
        React.createElement(Modal, __assign({ width: "24rem", footer: null, centered: true, destroyOnClose: true, visible: visible, onCancel: function () { return setVisible(false); } }, props),
            React.createElement(StyledTitle, { className: "mb-2" }, programPackage === null || programPackage === void 0 ? void 0 : programPackage.title),
            React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
                React.createElement(StyledPlanTitle, null, (_b = programPackage === null || programPackage === void 0 ? void 0 : programPackage.programPackagePlan) === null || _b === void 0 ? void 0 : _b.title),
                React.createElement(StyledCurrency, null, (programPackage === null || programPackage === void 0 ? void 0 : programPackage.programs.map(function (program) { return enrolledProgramIds.includes(program.id); }).includes(false)) && (React.createElement(PriceLabel, { currencyId: (_d = (_c = programPackage === null || programPackage === void 0 ? void 0 : programPackage.programs[0]) === null || _c === void 0 ? void 0 : _c.plan) === null || _d === void 0 ? void 0 : _d.currency.id, listPrice: sum((programPackage === null || programPackage === void 0 ? void 0 : programPackage.programs.filter(function (program) { return !enrolledProgramIds.includes(program.id); }).map(function (program) { var _a; return ((_a = program.plan) === null || _a === void 0 ? void 0 : _a.listPrice) || 0; })) || []) })))),
            React.createElement(Divider, { className: "my-3" }),
            React.createElement("div", { className: "d-flex align-items-center justify-content-between mb-3" },
                React.createElement(StyledSubTitle, null, formatMessage(messages.programPackageContent)),
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
                }))),
            React.createElement(StyledProgramCollection, { className: "mb-3" }, programPackage === null || programPackage === void 0 ? void 0 : programPackage.programs.map(function (program) { return (React.createElement("div", { key: program.id, className: "d-flex align-items-center mb-2" },
                React.createElement(CustomRatioImage, { width: "120px", ratio: 9 / 16, src: program.coverUrl || EmptyCover, className: "flex-shrink-0 mr-3", disabled: enrolledProgramIds.includes(program.id) }),
                React.createElement(StyledProgramTitle, { className: "flex-grow-1", disabled: enrolledProgramIds.includes(program.id) }, program.title))); })),
            React.createElement(Button, { type: "primary", block: true, loading: orderChecking || orderPlacing, disabled: orderChecking ||
                    !isPaymentAvailable ||
                    !(programPackage === null || programPackage === void 0 ? void 0 : programPackage.programs.map(function (program) { return enrolledProgramIds.includes(program.id); }).includes(false)), onClick: handlePay }, (programPackage === null || programPackage === void 0 ? void 0 : programPackage.programs.map(function (program) { return enrolledProgramIds.includes(program.id); }).includes(false)) ? formatMessage(commonMessages.button.useCoin)
                : '已使用代幣兌換'))));
};
var useProgramPackageProgramCollection = function (programPackageId, periodAmount, periodType) {
    var _a = useQuery(gql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      query GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION(\n        $programPackageId: uuid!\n        $periodAmount: numeric!\n        $periodType: String!\n      ) {\n        program_package_by_pk(id: $programPackageId) {\n          id\n          title\n          program_package_plans(\n            where: { period_amount: { _eq: $periodAmount }, period_type: { _eq: $periodType } }\n            limit: 1\n          ) {\n            id\n            title\n          }\n          program_package_programs(order_by: { position: asc }) {\n            id\n            position\n            program {\n              id\n              cover_url\n              title\n              program_plans(\n                where: { period_amount: { _eq: $periodAmount }, period_type: { _eq: $periodType } }\n                limit: 1\n              ) {\n                id\n                title\n                currency {\n                  id\n                  label\n                  unit\n                  name\n                }\n                list_price\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PROGRAM_PACKAGE_PROGRAM_COLLECTION(\n        $programPackageId: uuid!\n        $periodAmount: numeric!\n        $periodType: String!\n      ) {\n        program_package_by_pk(id: $programPackageId) {\n          id\n          title\n          program_package_plans(\n            where: { period_amount: { _eq: $periodAmount }, period_type: { _eq: $periodType } }\n            limit: 1\n          ) {\n            id\n            title\n          }\n          program_package_programs(order_by: { position: asc }) {\n            id\n            position\n            program {\n              id\n              cover_url\n              title\n              program_plans(\n                where: { period_amount: { _eq: $periodAmount }, period_type: { _eq: $periodType } }\n                limit: 1\n              ) {\n                id\n                title\n                currency {\n                  id\n                  label\n                  unit\n                  name\n                }\n                list_price\n              }\n            }\n          }\n        }\n      }\n    "]))), { variables: { programPackageId: programPackageId, periodAmount: periodAmount, periodType: periodType } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var programPackage = loading || error || !data || !data.program_package_by_pk
        ? null
        : {
            id: data.program_package_by_pk.id,
            title: data.program_package_by_pk.title,
            programPackagePlan: data.program_package_by_pk.program_package_plans[0]
                ? {
                    id: data.program_package_by_pk.program_package_plans[0].id,
                    title: data.program_package_by_pk.program_package_plans[0].title,
                }
                : null,
            programs: data.program_package_by_pk.program_package_programs.map(function (v) { return ({
                id: v.program.id,
                coverUrl: v.program.cover_url,
                title: v.program.title,
                plan: v.program.program_plans[0]
                    ? {
                        id: v.program.program_plans[0].id,
                        title: v.program.program_plans[0].title || '',
                        listPrice: v.program.program_plans[0].list_price,
                        currency: {
                            id: v.program.program_plans[0].currency.id,
                            label: v.program.program_plans[0].currency.label,
                            unit: v.program.program_plans[0].currency.unit,
                            name: v.program.program_plans[0].currency.name,
                        },
                    }
                    : null,
                position: v.position,
            }); }),
        };
    return {
        loadingProgramPackage: loading,
        errorProgramPackage: error,
        programPackage: programPackage,
        refetchProgramPackage: refetch,
    };
};
export default ProgramPackageCoinModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=ProgramPackageCoinModal.js.map
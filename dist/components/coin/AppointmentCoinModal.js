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
import { Button, Divider, Form, Input, Skeleton } from 'antd';
import Modal from 'antd/lib/modal';
import gql from 'graphql-tag';
import moment from 'moment';
import { sum } from 'ramda';
import React, { useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { dateRangeFormatter, handleError, validationRegExp } from '../../helpers';
import { checkoutMessages } from '../../helpers/translation';
import { useCheck } from '../../hooks/checkout';
import DefaultAvatar from '../../images/avatar.svg';
import AppointmentPeriodCollection from '../appointment/AppointmentPeriodCollection';
import { useAuth } from '../auth/AuthContext';
import DiscountSelectionCard from '../checkout/DiscountSelectionCard';
import { CustomRatioImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
var messages = defineMessages({
    periodDurationAtMost: { id: 'appointment.text.periodDurationAtMost', defaultMessage: '諮詢一次 {duration} 分鐘為限' },
    makeAppointment: { id: 'appointment.ui.makeAppointment', defaultMessage: '預約諮詢' },
    phonePlaceholder: { id: 'appointment.text.phonePlaceholder', defaultMessage: '填寫手機以便發送簡訊通知' },
    selectDiscount: { id: 'appointment.label.selectDiscount', defaultMessage: '使用折扣' },
    contactInformation: { id: 'appointment.label.contactInformation', defaultMessage: '聯絡資訊' },
});
var StyledTitle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n"], ["\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n"])));
var StyledPlanTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n"])));
var StyledSubTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-weight: bold;\n"], ["\n  color: var(--gray-darker);\n  font-weight: bold;\n"])));
var StyledMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 12px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 12px;\n"])));
var StyledBody = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  max-height: 30rem;\n  overflow: auto;\n"], ["\n  max-height: 30rem;\n  overflow: auto;\n"])));
var StyledPeriod = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), function (props) { return props.theme['@primary-color']; });
var AppointmentCoinModal = function (_a) {
    var _b;
    var renderTrigger = _a.renderTrigger, appointmentPlanId = _a.appointmentPlanId, onCancel = _a.onCancel, props = __rest(_a, ["renderTrigger", "appointmentPlanId", "onCancel"]);
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var currentMember = useAuth().currentMember;
    var _c = useAppointmentPlan(appointmentPlanId), loadingAppointmentPlan = _c.loadingAppointmentPlan, appointmentPlan = _c.appointmentPlan;
    var phoneInputRef = useRef(null);
    var _d = useState(false), visible = _d[0], setVisible = _d[1];
    var _e = useState(null), selectedPeriod = _e[0], setSelectedPeriod = _e[1];
    var _f = useState(null), discountId = _f[0], setDiscountId = _f[1];
    var _g = useCheck(["AppointmentPlan_" + appointmentPlanId], discountId && discountId.split('_')[1] ? discountId : 'Coin', null, (_b = {},
        _b["AppointmentPlan_" + appointmentPlanId] = { startedAt: selectedPeriod === null || selectedPeriod === void 0 ? void 0 : selectedPeriod.startedAt },
        _b)), orderChecking = _g.orderChecking, check = _g.check, placeOrder = _g.placeOrder, orderPlacing = _g.orderPlacing;
    var isPaymentAvailable = !orderChecking &&
        sum(check.orderProducts.map(function (orderProduct) { return orderProduct.price; })) ===
            sum(check.orderDiscounts.map(function (orderDiscount) { return orderDiscount.price; }));
    var handlePay = function () {
        var _a;
        var phone = ((_a = phoneInputRef.current) === null || _a === void 0 ? void 0 : _a.input.value) || '';
        if (!validationRegExp.phone.test(phone)) {
            return;
        }
        placeOrder('perpetual', {
            name: (currentMember === null || currentMember === void 0 ? void 0 : currentMember.name) || (currentMember === null || currentMember === void 0 ? void 0 : currentMember.username) || '',
            phone: phone,
            email: (currentMember === null || currentMember === void 0 ? void 0 : currentMember.email) || '',
        })
            .then(function (taskId) {
            history.push("/tasks/order/" + taskId);
        })
            .catch(handleError);
    };
    return (React.createElement(React.Fragment, null,
        renderTrigger && renderTrigger({ setVisible: setVisible }),
        React.createElement(Modal, __assign({ width: "24rem", title: null, footer: null, centered: true, destroyOnClose: true, visible: visible }, props, { onCancel: function (e) {
                setSelectedPeriod(null);
                setVisible(false);
                onCancel && onCancel(e);
            } }), loadingAppointmentPlan || !appointmentPlan ? (React.createElement(Skeleton, { active: true })) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "d-flex align-self-start mb-4" },
                React.createElement("div", { className: "flex-shrink-0" },
                    React.createElement(CustomRatioImage, { width: "5rem", ratio: 1, src: appointmentPlan.creator.avatarUrl || DefaultAvatar, shape: "circle", className: "mr-3" })),
                React.createElement("div", { className: "flex-grow-1" },
                    React.createElement(StyledTitle, { className: "mb-1" }, appointmentPlan.creator.name),
                    React.createElement("div", { className: "mb-1" }, appointmentPlan.creator.abstract),
                    React.createElement(StyledMeta, null, formatMessage(messages.periodDurationAtMost, { duration: appointmentPlan.duration })))),
            React.createElement(StyledPlanTitle, { className: "d-flex align-items-center justify-content-between" },
                React.createElement("div", null, appointmentPlan.title),
                React.createElement(PriceLabel, { listPrice: appointmentPlan.price, currencyId: appointmentPlan.currency.id })),
            React.createElement(Divider, { className: "my-3" }),
            React.createElement(StyledBody, null, selectedPeriod ? (React.createElement(React.Fragment, null,
                React.createElement(StyledPeriod, { className: "mb-4" }, dateRangeFormatter({
                    startedAt: selectedPeriod.startedAt,
                    endedAt: selectedPeriod.endedAt,
                })),
                React.createElement("div", { className: "mb-3" },
                    React.createElement(StyledSubTitle, null, formatMessage(messages.selectDiscount)),
                    React.createElement(DiscountSelectionCard, { check: check, value: discountId, onChange: setDiscountId })),
                React.createElement(StyledSubTitle, null, formatMessage(messages.contactInformation)),
                React.createElement(Form.Item, { label: formatMessage(checkoutMessages.form.message.phone), required: true, colon: false, className: "mb-3" },
                    React.createElement(Input, { ref: phoneInputRef, placeholder: formatMessage(messages.phonePlaceholder) })),
                React.createElement(Button, { type: "primary", block: true, disabled: orderChecking || !isPaymentAvailable, loading: orderChecking || orderPlacing, onClick: handlePay }, formatMessage(messages.makeAppointment)))) : (React.createElement(AppointmentPeriodCollection, { appointmentPeriods: appointmentPlan.periods.filter(function (period) { return moment(period.startedAt) > moment().endOf('isoWeek'); }), onClick: function (period) { return setSelectedPeriod(period); } }))))))));
};
var useAppointmentPlan = function (appointmentPlanId) {
    var _a, _b, _c, _d, _e;
    var _f = useQuery(gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      query GET_APPOINTMENT_PLAN($appointmentPlanId: uuid!, $startedAt: timestamptz!) {\n        appointment_plan_by_pk(id: $appointmentPlanId) {\n          id\n          title\n          description\n          duration\n          price\n          support_locales\n          currency {\n            id\n            label\n            unit\n            name\n          }\n          appointment_periods(\n            where: { available: { _eq: true }, started_at: { _gt: $startedAt } }\n            order_by: { started_at: asc }\n          ) {\n            started_at\n            ended_at\n            booked\n          }\n          creator {\n            id\n            abstract\n            picture_url\n            name\n            username\n          }\n        }\n      }\n    "], ["\n      query GET_APPOINTMENT_PLAN($appointmentPlanId: uuid!, $startedAt: timestamptz!) {\n        appointment_plan_by_pk(id: $appointmentPlanId) {\n          id\n          title\n          description\n          duration\n          price\n          support_locales\n          currency {\n            id\n            label\n            unit\n            name\n          }\n          appointment_periods(\n            where: { available: { _eq: true }, started_at: { _gt: $startedAt } }\n            order_by: { started_at: asc }\n          ) {\n            started_at\n            ended_at\n            booked\n          }\n          creator {\n            id\n            abstract\n            picture_url\n            name\n            username\n          }\n        }\n      }\n    "]))), { variables: { appointmentPlanId: appointmentPlanId, startedAt: moment().endOf('minute').toDate() } }), loading = _f.loading, error = _f.error, data = _f.data, refetch = _f.refetch;
    var appointmentPlan = loading || error || !data || !data.appointment_plan_by_pk
        ? null
        : {
            id: data.appointment_plan_by_pk.id,
            title: data.appointment_plan_by_pk.title,
            description: data.appointment_plan_by_pk.description,
            duration: data.appointment_plan_by_pk.duration,
            price: data.appointment_plan_by_pk.price,
            phone: null,
            supportLocales: data.appointment_plan_by_pk.support_locales,
            currency: {
                id: data.appointment_plan_by_pk.currency.id,
                label: data.appointment_plan_by_pk.currency.label,
                unit: data.appointment_plan_by_pk.currency.unit,
                name: data.appointment_plan_by_pk.currency.name,
            },
            periods: data.appointment_plan_by_pk.appointment_periods.map(function (period) { return ({
                id: "" + period.started_at,
                startedAt: new Date(period.started_at),
                endedAt: new Date(period.ended_at),
                booked: !!period.booked,
            }); }),
            creator: {
                id: ((_a = data.appointment_plan_by_pk.creator) === null || _a === void 0 ? void 0 : _a.id) || '',
                avatarUrl: ((_b = data.appointment_plan_by_pk.creator) === null || _b === void 0 ? void 0 : _b.picture_url) || null,
                name: ((_c = data.appointment_plan_by_pk.creator) === null || _c === void 0 ? void 0 : _c.name) || ((_d = data.appointment_plan_by_pk.creator) === null || _d === void 0 ? void 0 : _d.username) || '',
                abstract: ((_e = data.appointment_plan_by_pk.creator) === null || _e === void 0 ? void 0 : _e.abstract) || null,
            },
        };
    return {
        loadingAppointmentPlan: loading,
        errorAppointmentPlan: error,
        appointmentPlan: appointmentPlan,
        refetchAppointmentPlan: refetch,
    };
};
export default AppointmentCoinModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=AppointmentCoinModal.js.map
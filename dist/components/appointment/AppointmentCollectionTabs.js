var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import moment from 'moment';
import momentTz from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import CheckoutProductModal from '../../containers/checkout/CheckoutProductModal';
import { productMessages } from '../../helpers/translation';
import { useMember } from '../../hooks/member';
import { useAuth } from '../auth/AuthContext';
import PriceLabel from '../common/PriceLabel';
import { BraftContent } from '../common/StyledBraftEditor';
import AppointmentPeriodCollection from './AppointmentPeriodCollection';
var StyledTab = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  padding: 1rem;\n  height: 104px;\n  user-select: none;\n  cursor: pointer;\n  transition: background 0.3s ease-in-out;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n  background: white;\n\n  > .title {\n    font-size: 18px;\n    font-weight: bold;\n    color: var(--gray-darker);\n    transition: color 0.3s ease-in-out;\n  }\n\n  > .info {\n    margin: 0;\n    color: ", ";\n    font-size: 14px;\n    letter-spacing: 0.18px;\n    transition: color 0.3s ease-in-out;\n  }\n\n  &:hover,\n  &.active {\n    background: ", ";\n\n    > .title,\n    > .info {\n      color: white;\n    }\n  }\n"], ["\n  margin-bottom: 0.75rem;\n  padding: 1rem;\n  height: 104px;\n  user-select: none;\n  cursor: pointer;\n  transition: background 0.3s ease-in-out;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n  background: white;\n\n  > .title {\n    font-size: 18px;\n    font-weight: bold;\n    color: var(--gray-darker);\n    transition: color 0.3s ease-in-out;\n  }\n\n  > .info {\n    margin: 0;\n    color: ", ";\n    font-size: 14px;\n    letter-spacing: 0.18px;\n    transition: color 0.3s ease-in-out;\n  }\n\n  &:hover,\n  &.active {\n    background: ", ";\n\n    > .title,\n    > .info {\n      color: white;\n    }\n  }\n"])), function (props) { return props.theme['@primary-color']; }, function (props) { return props.theme['@primary-color']; });
var StyledTimeStandardBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border-radius: 4px;\n  width: 100%;\n  height: 30px;\n  padding: 4px 8px;\n  line-height: 1.57;\n  letter-spacing: 0.18px;\n  font-size: 14px;\n  font-weight: 500;\n  font-family: NotoSansCJKtc;\n  color: var(--gray-darker);\n  background-color: var(--gray-lighter);\n"], ["\n  border-radius: 4px;\n  width: 100%;\n  height: 30px;\n  padding: 4px 8px;\n  line-height: 1.57;\n  letter-spacing: 0.18px;\n  font-size: 14px;\n  font-weight: 500;\n  font-family: NotoSansCJKtc;\n  color: var(--gray-darker);\n  background-color: var(--gray-lighter);\n"])));
var AppointmentCollectionTabs = function (_a) {
    var appointmentPlans = _a.appointmentPlans;
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var member = useMember(currentMemberId || '').member;
    var _b = useState(appointmentPlans[0].id), selectedAppointmentPlanId = _b[0], setSelectedAppointmentPlanId = _b[1];
    var _c = useState(null), selectedPeriod = _c[0], setSelectedPeriod = _c[1];
    useEffect(function () {
        if (appointmentPlans) {
            appointmentPlans.forEach(function (appointmentPlan, index) {
                ReactGA.plugin.execute('ec', 'addProduct', {
                    id: appointmentPlan.id,
                    name: appointmentPlan.title,
                    category: 'AppointmentPlan',
                    price: "" + appointmentPlan.price,
                    quantity: '1',
                    currency: 'TWD',
                });
                ReactGA.plugin.execute('ec', 'addImpression', {
                    id: appointmentPlan.id,
                    name: appointmentPlan.title,
                    category: 'AppointmentPlan',
                    price: "" + appointmentPlan.price,
                    position: index + 1,
                });
            });
            if (appointmentPlans.length > 0) {
                ReactGA.plugin.execute('ec', 'setAction', 'detail');
            }
            ReactGA.ga('send', 'pageview');
        }
    }, [appointmentPlans]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "row mb-4" }, appointmentPlans.map(function (appointmentPlan, index) { return (React.createElement("div", { key: appointmentPlan.id, className: "col-lg-4 col-6" },
            React.createElement(StyledTab, { key: appointmentPlan.title, className: "d-flex flex-column justify-content-between " + (selectedAppointmentPlanId === appointmentPlan.id || (selectedAppointmentPlanId === null && index === 0)
                    ? 'active'
                    : ''), onClick: function () { return setSelectedAppointmentPlanId(appointmentPlan.id); } },
                React.createElement("div", { className: "title" }, appointmentPlan.title),
                React.createElement("div", { className: "info" }, formatMessage({
                    id: 'product.appointment.unit',
                    defaultMessage: '每 {duration} 分鐘 {price}',
                }, {
                    duration: appointmentPlan.duration,
                    price: React.createElement(PriceLabel, { currencyId: appointmentPlan.currency.id, listPrice: appointmentPlan.price }),
                }))))); })),
        appointmentPlans
            .filter(function (appointmentPlan, index) {
            return selectedAppointmentPlanId ? selectedAppointmentPlanId === appointmentPlan.id : index === 0;
        })
            .map(function (appointmentPlan) { return (React.createElement("div", { key: appointmentPlan.id },
            appointmentPlan.description && (React.createElement("div", { className: "mb-4" },
                React.createElement(BraftContent, null, appointmentPlan.description))),
            React.createElement(StyledTimeStandardBlock, { className: "mb-4" }, formatMessage(productMessages.appointment.content.timezone, {
                city: momentTz.tz.guess().split('/')[1],
                timezone: moment().zone(momentTz.tz.guess()).format('Z'),
            })),
            React.createElement(CheckoutProductModal, { renderTrigger: function (_a) {
                    var setVisible = _a.setVisible;
                    return (React.createElement(AppointmentPeriodCollection, { appointmentPeriods: appointmentPlan.periods, onClick: function (period) {
                            ReactGA.plugin.execute('ec', 'addProduct', {
                                id: appointmentPlan.id,
                                name: appointmentPlan.title,
                                category: 'AppointmentPlan',
                                price: "" + appointmentPlan.price,
                                quantity: '1',
                                currency: 'TWD',
                            });
                            ReactGA.plugin.execute('ec', 'setAction', 'add');
                            ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart');
                            setSelectedPeriod(period);
                            setVisible();
                        } }));
                }, paymentType: "perpetual", defaultProductId: "AppointmentPlan_" + appointmentPlan.id, startedAt: selectedPeriod === null || selectedPeriod === void 0 ? void 0 : selectedPeriod.startedAt, warningText: formatMessage(productMessages.appointment.warningText.news), member: member }))); })));
};
export default AppointmentCollectionTabs;
var templateObject_1, templateObject_2;
//# sourceMappingURL=AppointmentCollectionTabs.js.map
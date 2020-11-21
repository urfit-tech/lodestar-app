var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import moment from 'moment';
import { groupBy } from 'ramda';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { useAuth } from '../auth/AuthContext';
import { AuthModalContext } from '../auth/AuthModal';
import AppointmentItem from './AppointmentItem';
var StyledScheduleTitle = styled.h3(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 1.25rem;\n  display: block;\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n"], ["\n  margin-bottom: 1.25rem;\n  display: block;\n  font-size: 16px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n"])));
var AppointmentPeriodCollection = function (_a) {
    var appointmentPeriods = _a.appointmentPeriods, onClick = _a.onClick;
    var setAuthModalVisible = useContext(AuthModalContext).setVisible;
    var isAuthenticated = useAuth().isAuthenticated;
    var periods = groupBy(function (period) { return moment(period.startedAt).format('YYYY-MM-DD(dd)'); }, appointmentPeriods);
    return (React.createElement(React.Fragment, null, Object.values(periods).map(function (periods) { return (React.createElement("div", { key: periods[0].id, className: "mb-4" },
        React.createElement(StyledScheduleTitle, null, moment(periods[0].startedAt).format('YYYY-MM-DD(dd)')),
        React.createElement("div", { className: "d-flex flex-wrap justify-content-start" }, periods.map(function (period) {
            var ItemElem = (React.createElement(AppointmentItem, { key: period.id, id: period.id, startedAt: period.startedAt, isEnrolled: period.booked }));
            return period.booked ? (ItemElem) : isAuthenticated ? (React.createElement("div", { key: period.id, onClick: function () { return onClick && onClick(period); } }, ItemElem)) : (React.createElement("div", { key: period.id, onClick: function () { return setAuthModalVisible && setAuthModalVisible(true); } }, ItemElem));
        })))); })));
};
export default AppointmentPeriodCollection;
var templateObject_1;
//# sourceMappingURL=AppointmentPeriodCollection.js.map
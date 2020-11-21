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
import { List } from 'antd';
import React from 'react';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { useEnrolledAppointmentCollection } from '../../hooks/appointment';
var AppointmentPlanCollectionBlock = function (_a) {
    var memberId = _a.memberId;
    var _b = useEnrolledAppointmentCollection(memberId), enrolledAppointments = _b.enrolledAppointments, refetchEnrolledAppointments = _b.refetchEnrolledAppointments;
    return (React.createElement("div", { className: "container py-3" },
        React.createElement(List, null, enrolledAppointments.map(function (appointmentEnrollment) { return (React.createElement("div", { key: appointmentEnrollment.orderProduct.id, className: "mb-4" },
            React.createElement(AppointmentCard, __assign({}, appointmentEnrollment, { onRefetch: refetchEnrolledAppointments })))); }))));
};
export default AppointmentPlanCollectionBlock;
//# sourceMappingURL=AppointmentPlanCollectionBlock.js.map
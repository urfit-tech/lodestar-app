import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { AppointmentEnrollmentProps } from '../../types/appointment';
declare type AppointmentCardProps = FormComponentProps & AppointmentEnrollmentProps & {
    onRefetch?: () => void;
};
declare const _default: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<AppointmentCardProps>, Pick<AppointmentCardProps, "title" | "startedAt" | "endedAt" | "onRefetch" | "wrappedComponentRef" | "member" | "appointmentIssue" | "canceledAt" | "creator" | "appointmentUrl" | "orderProduct">>;
export default _default;

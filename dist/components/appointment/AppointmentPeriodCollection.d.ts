import React from 'react';
import { AppointmentPeriodProps } from '../../types/appointment';
declare const AppointmentPeriodCollection: React.FC<{
    appointmentPeriods: AppointmentPeriodProps[];
    onClick?: (period: AppointmentPeriodProps) => void;
}>;
export default AppointmentPeriodCollection;

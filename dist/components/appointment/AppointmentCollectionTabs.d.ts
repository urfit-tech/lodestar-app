import React from 'react';
import { AppointmentPeriodProps, AppointmentPlanProps } from '../../types/appointment';
declare const AppointmentCollectionTabs: React.FC<{
    appointmentPlans: (AppointmentPlanProps & {
        periods: AppointmentPeriodProps[];
    })[];
}>;
export default AppointmentCollectionTabs;

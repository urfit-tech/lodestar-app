import { ModalProps } from 'antd/lib/modal';
import React from 'react';
declare const AppointmentCoinModal: React.FC<ModalProps & {
    renderTrigger?: React.FC<{
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    }>;
    appointmentPlanId: string;
}>;
export default AppointmentCoinModal;

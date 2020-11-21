import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { PeriodType } from '../../types/program';
declare const ProgramPackageCoinModal: React.FC<ModalProps & {
    renderTrigger?: React.FC<{
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    }>;
    programPackageId: string;
    periodAmount: number;
    periodType: PeriodType;
}>;
export default ProgramPackageCoinModal;

import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { PeriodType } from '../../types/program';
declare const ProgramCoinModal: React.FC<ModalProps & {
    renderTrigger?: React.FC<{
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    }>;
    programId: string;
    periodAmount: number;
    periodType: PeriodType;
}>;
export default ProgramCoinModal;

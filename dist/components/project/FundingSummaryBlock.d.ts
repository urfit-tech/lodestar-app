import React from 'react';
import { ProjectIntroProps } from '../../types/project';
declare const FundingSummaryBlock: React.FC<{
    projectId: string;
    title: string;
    description: string;
    targetAmount: number;
    targetUnit: ProjectIntroProps['targetUnit'];
    expiredAt: Date | null;
    type: string;
    isParticipantsVisible: boolean;
    isCountdownTimerVisible: boolean;
    totalSales: number;
    enrollmentCount: number;
}>;
export default FundingSummaryBlock;

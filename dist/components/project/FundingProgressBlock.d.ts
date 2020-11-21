import React from 'react';
import { ProjectIntroProps } from '../../types/project';
declare const FundingProgressBlock: React.FC<{
    targetAmount: number;
    targetUnit: ProjectIntroProps['targetUnit'];
    totalSales: number;
    enrollmentCount: number;
}>;
export default FundingProgressBlock;

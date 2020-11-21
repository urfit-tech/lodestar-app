import { CardProps } from 'antd/lib/card';
import React from 'react';
import { ProgramPlanProps } from '../../types/program';
declare const ProgramSubscriptionPlanCard: React.FC<CardProps & {
    memberId: string;
    programId: string;
    programPlan: ProgramPlanProps;
}>;
export default ProgramSubscriptionPlanCard;

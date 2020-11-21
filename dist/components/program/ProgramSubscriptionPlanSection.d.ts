import React from 'react';
import { ProgramPlanProps, ProgramProps } from '../../types/program';
declare const ProgramSubscriptionPlanSection: React.FC<{
    program: ProgramProps & {
        plans: ProgramPlanProps[];
    };
}>;
export default ProgramSubscriptionPlanSection;

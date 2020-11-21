import React from 'react';
import { ProgramBriefProps, ProgramPlanProps, ProgramRoleProps } from '../../types/program';
declare const ProgramCard: React.FC<{
    program: ProgramBriefProps & {
        roles: ProgramRoleProps[];
        plans: ProgramPlanProps[];
    };
    variant?: 'brief';
    programType?: string | null;
    isEnrolled?: boolean;
    noInstructor?: boolean;
    noPrice?: boolean;
    noTotalDuration?: boolean;
    withMeta?: boolean;
    withProgress?: boolean;
    renderCustomDescription?: () => JSX.Element;
}>;
export default ProgramCard;

import React from 'react';
declare const ProgramCard: React.FC<{
    memberId: string;
    programId: string;
    programType?: string;
    noInstructor?: boolean;
    noPrice?: boolean;
    withProgress?: boolean;
}>;
export default ProgramCard;

import React from 'react';
import { ProgramPackageProgramProps } from '../../types/programPackage';
export declare const ProgramDisplayedListItem: React.FC<{
    program: ProgramPackageProgramProps & {
        expiredAt?: Date | null;
    };
    memberId?: string | null;
}>;
